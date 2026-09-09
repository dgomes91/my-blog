import { createClient } from "@/prismicio";
import type { Content } from "@prismicio/client";
import { SITE_URL, SITE_NAME } from "../lib/seo";

// Sitemap específico do Google Notícias: só artigos das últimas 48h.
// https://support.google.com/news/publisher-center/answer/9606710

export const revalidate = 300;

const TWO_DAYS_MS = 48 * 60 * 60 * 1000;

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  let recent: Content.ArticleDocument[] = [];
  try {
    const client = createClient();
    const all = await client.getAllByType<Content.ArticleDocument>("article", {
      orderings: [
        { field: "document.first_publication_date", direction: "desc" },
      ],
      limit: 1000,
    });
    const cutoff = Date.now() - TWO_DAYS_MS;
    recent = all.filter((a) => {
      const published = new Date(
        a.data.publish_date_override || a.first_publication_date,
      ).getTime();
      return Number.isFinite(published) && published >= cutoff;
    });
  } catch {
    // Prismic indisponível — devolve um sitemap vazio, mas válido.
  }

  const urls = recent
    .map((a) => {
      const published = new Date(
        a.data.publish_date_override || a.first_publication_date,
      ).toISOString();
      const title = xmlEscape((a.data.title || "").trim() || a.uid);
      return `  <url>
    <loc>${SITE_URL}/article/${a.uid}</loc>
    <news:news>
      <news:publication>
        <news:name>${xmlEscape(SITE_NAME)}</news:name>
        <news:language>pt</news:language>
      </news:publication>
      <news:publication_date>${published}</news:publication_date>
      <news:title>${title}</news:title>
    </news:news>
  </url>`;
    })
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}
</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
