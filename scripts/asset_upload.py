#!/usr/bin/env python3
"""
Prismic Asset API uploader with SHA256-based dedupe.

Required by gta6-content-pipeline skill: ANY cover/asset upload to Prismic
must go through this helper (upload_or_reuse), never a raw POST to
asset-api.prismic.io/assets, so that re-uploading byte-identical images
(same cover reused PT/EN or across days) reuses the existing asset_id
instead of cluttering the Media Library with duplicates.

Manifest file: scripts/asset_hash_manifest.json (committed to the repo,
NOT scratch) — maps sha256 hex digest -> {"asset_id":..., "filename":...,
"url":...}.

CLI usage:
    python3 scripts/asset_upload.py <local_image_path>
Prints a JSON object: {"asset_id":..., "url":..., "reused": true|false}

Library usage:
    from asset_upload import upload_or_reuse
    result = upload_or_reuse(img_bytes, filename, token)
"""
import hashlib
import json
import mimetypes
import os
import sys
import urllib.request
import uuid

REPO = "56a5a6cc"
ASSET_API = f"https://asset-api.prismic.io/assets?repository={REPO}"
MANIFEST_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "asset_hash_manifest.json")


def _load_manifest():
    if os.path.exists(MANIFEST_PATH):
        with open(MANIFEST_PATH, "r") as f:
            return json.load(f)
    return {}


def _save_manifest(manifest):
    with open(MANIFEST_PATH, "w") as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)


def _multipart_body(field_name, filename, content, content_type):
    boundary = uuid.uuid4().hex
    body = (
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="{field_name}"; filename="{filename}"\r\n'
        f"Content-Type: {content_type}\r\n\r\n"
    ).encode("utf-8")
    body += content
    body += f"\r\n--{boundary}--\r\n".encode("utf-8")
    return body, boundary


def upload_or_reuse(img_bytes: bytes, filename: str, token: str) -> dict:
    """Upload img_bytes to the Prismic Asset API, or reuse an existing
    asset_id if the exact same bytes were uploaded before (per the local
    hash manifest). Returns {"asset_id":..., "url":..., "reused": bool}.
    """
    digest = hashlib.sha256(img_bytes).hexdigest()
    manifest = _load_manifest()

    if digest in manifest:
        cached = manifest[digest]
        return {"asset_id": cached["asset_id"], "url": cached.get("url"), "reused": True}

    content_type = mimetypes.guess_type(filename)[0] or "application/octet-stream"
    body, boundary = _multipart_body("file", filename, img_bytes, content_type)

    req = urllib.request.Request(ASSET_API, data=body, method="POST")
    req.add_header("Authorization", f"Bearer {token}")
    req.add_header("repository", REPO)
    req.add_header("Content-Type", f"multipart/form-data; boundary={boundary}")

    with urllib.request.urlopen(req) as resp:
        result = json.loads(resp.read().decode("utf-8"))

    asset_id = result["id"]
    url = result.get("url")
    manifest[digest] = {"asset_id": asset_id, "filename": filename, "url": url}
    _save_manifest(manifest)
    return {"asset_id": asset_id, "url": url, "reused": False}


def main():
    if len(sys.argv) != 2:
        print("usage: asset_upload.py <local_image_path>", file=sys.stderr)
        sys.exit(1)

    path = sys.argv[1]
    token = os.environ.get("PRISMICR_WRITE_API_TOKEN")
    if not token:
        print("ERROR: PRISMICR_WRITE_API_TOKEN not set in environment", file=sys.stderr)
        sys.exit(1)

    with open(path, "rb") as f:
        img_bytes = f.read()

    result = upload_or_reuse(img_bytes, os.path.basename(path), token)
    print(json.dumps(result))


if __name__ == "__main__":
    main()
