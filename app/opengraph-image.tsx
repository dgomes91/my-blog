import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "./lib/seo";

export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Card social padrão. Rotas com imagem própria (artigos) sobrescrevem via
// openGraph.images em generateMetadata.
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background:
            "linear-gradient(135deg, #0e0e11 0%, #17171c 55%, #241014 100%)",
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 34,
            letterSpacing: 8,
            color: "#e5484d",
            fontWeight: 700,
          }}
        >
          {SITE_TAGLINE.toUpperCase()}
        </div>
        <div style={{ fontSize: 104, fontWeight: 800, lineHeight: 1.05, marginTop: 16 }}>
          {SITE_NAME}
        </div>
        <div style={{ fontSize: 30, color: "#a1a1aa", marginTop: 28, maxWidth: 900 }}>
          Notícias, trailers, mapa de Leonida, Jason e Lucia e data de lançamento de GTA 6.
        </div>
      </div>
    ),
    { ...size },
  );
}
