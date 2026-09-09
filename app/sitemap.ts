import type { MetadataRoute } from "next";
import { createClient } from "@/prismicio";
import type { Content } from "@prismicio/client";
import { SITE_URL } from "./lib/seo";
import { getAllArticles } from "./lib/queries";

export const revalidate = 3600;

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1, changeFrequency: "hourly" },
  { path: "/noticias", priority: 0.9, changeFrequency: "hourly" },
  { path: "/reviews", priority: 0.8, changeFrequency: "daily" },
  { path: "/top-lista", priority: 0.8, changeFrequency: "daily" },
  { path: "/about", priority: 0.4, changeFrequency: "monthly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: new Date(),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  let articles: Content.ArticleDocument[] = [];
  let pages: Content.PageDocument[] = [];
  try {
    const client = createClient();
    [articles, pages] = await Promise.all([
      getAllArticles({ limit: 1000 }),
      client.getAllByType<Content.PageDocument>("page").catch(() => []),
    ]);
  } catch {
    // Prismic indisponível no build — devolve só as rotas estáticas.
  }

  const articleEntries: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE_URL}/article/${a.uid}`,
    lastModified: new Date(a.last_publication_date),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const pageEntries: MetadataRoute.Sitemap = pages.map((p) => ({
    url: `${SITE_URL}/${p.uid}`,
    lastModified: new Date(p.last_publication_date),
    changeFrequency: "yearly",
    priority: 0.3,
  }));

  return [...base, ...articleEntries, ...pageEntries];
}
