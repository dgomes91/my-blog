import type { MetadataRoute } from "next";
import { createClient } from "@/prismicio";
import type { Content } from "@prismicio/client";
import { SITE_URL } from "./lib/seo";
import { CATEGORY_PATH, localeFromDocLang, withLocale } from "./lib/i18n";

export const revalidate = 3600;

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1, changeFrequency: "hourly" },
  { path: "/noticias", priority: 0.9, changeFrequency: "hourly" },
  { path: "/reviews", priority: 0.8, changeFrequency: "daily" },
  { path: "/top-lista", priority: 0.8, changeFrequency: "daily" },
  { path: "/about", priority: 0.4, changeFrequency: "monthly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Rotas estáticas + sua tradução en-us (categorias trocam de slug por locale).
  const base: MetadataRoute.Sitemap = STATIC_ROUTES.flatMap((r) => {
    const enPath =
      r.path === "/noticias"
        ? CATEGORY_PATH["en-us"].news
        : r.path === "/top-lista"
          ? CATEGORY_PATH["en-us"].topLists
          : withLocale("en-us", r.path);
    return [
      { path: r.path, priority: r.priority, changeFrequency: r.changeFrequency },
      { path: enPath, priority: r.priority, changeFrequency: r.changeFrequency },
    ];
  }).map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: new Date(),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  let articles: Content.ArticleDocument[] = [];
  let pages: Content.PageDocument[] = [];
  try {
    const client = createClient();
    // `lang: "*"` explícito — o sitemap precisa dos artigos/páginas de TODOS
    // os locales (o locale de cada um vem do campo `.lang` do próprio doc),
    // diferente das queries de página que sempre pedem um locale específico.
    [articles, pages] = await Promise.all([
      client.getAllByType<Content.ArticleDocument>("article", { lang: "*" }).catch(() => []),
      client.getAllByType<Content.PageDocument>("page", { lang: "*" }).catch(() => []),
    ]);
  } catch {
    // Prismic indisponível no build — devolve só as rotas estáticas.
  }

  const articleEntries: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE_URL}${withLocale(localeFromDocLang(a.lang), `/article/${a.uid}`)}`,
    lastModified: new Date(a.last_publication_date),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const pageEntries: MetadataRoute.Sitemap = pages.map((p) => ({
    url: `${SITE_URL}${withLocale(localeFromDocLang(p.lang), `/${p.uid}`)}`,
    lastModified: new Date(p.last_publication_date),
    changeFrequency: "yearly",
    priority: 0.3,
  }));

  return [...base, ...articleEntries, ...pageEntries];
}
