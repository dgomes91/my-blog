import { notFound } from "next/navigation";
import { SliceZone } from "@prismicio/react";
import { asText } from "@prismicio/client";
import type { Metadata } from "next";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { OswaldText } from "@/app/components";
import { JsonLd } from "@/app/components/json-ld";
import {
  absoluteUrl,
  breadcrumbLd,
  jsonLdGraph,
  pageMetadata,
  rasterImage,
} from "@/app/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[uid]">): Promise<Metadata> {
  const { uid } = await params;
  const client = createClient();
  const page = await client.getByUID("page", uid).catch(() => null);
  if (!page) return {};

  const title = page.data.seo_title?.trim() || page.data.title?.trim() || uid;
  const firstRichText = page.data.slices?.find(
    (s) => s.slice_type === "rich_text",
  );
  const bodyText = firstRichText
    ? asText((firstRichText.primary as { content?: never }).content)
    : "";
  const description =
    page.data.seo_description?.trim() ||
    page.data.subtitle?.trim() ||
    (bodyText || "").slice(0, 200) ||
    title;

  return pageMetadata({
    title,
    description,
    path: `/${uid}`,
    images: [rasterImage(page.data.seo_image?.url)],
  });
}

export default async function GenericPage({ params }: PageProps<"/[uid]">) {
  const { uid } = await params;
  const client = createClient();
  const page = await client.getByUID("page", uid).catch(() => null);
  if (!page) notFound();

  const jsonLd = jsonLdGraph(
    {
      "@type": "WebPage",
      "@id": `${absoluteUrl(`/${uid}`)}#webpage`,
      url: absoluteUrl(`/${uid}`),
      name: page.data.title?.trim() || uid,
      ...(page.data.subtitle?.trim() ? { description: page.data.subtitle.trim() } : {}),
      inLanguage: "pt-BR",
      isPartOf: { "@id": `${absoluteUrl("/")}#website` },
      dateModified: page.last_publication_date,
    },
    breadcrumbLd([
      { name: "Início", path: "/" },
      { name: page.data.title?.trim() || uid, path: `/${uid}` },
    ]),
  );

  return (
    <main>
      <JsonLd json={jsonLd} />
      <div className="max-w-3xl mx-auto px-4 pt-16 pb-8">
        <OswaldText as="h1" className="text-3xl md:text-5xl font-bold text-foreground leading-tight mb-3">
          {page.data.title}
        </OswaldText>
        {page.data.subtitle && <p className="text-muted-foreground text-lg">{page.data.subtitle}</p>}
      </div>
      <SliceZone slices={page.data.slices} components={components} />
    </main>
  );
}
