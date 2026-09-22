import { createClient } from "@/prismicio";
import { Content } from "@prismicio/client";
import { DEFAULT_LOCALE, type Locale } from "./i18n";

/**
 * Camada de queries do Prismic. Toda página que precisa de conteúdo real
 * passa por aqui em vez de chamar o client diretamente — mantém as
 * consultas (filtros, orderings, fetchLinks) num único lugar.
 *
 * Todo documento (article/page/homepage/about/site_settings/game/author) tem
 * uma versão por `Locale`. Sem `lang` explícito, a Content API busca em todas
 * as línguas (`lang: "*"`) — por isso toda função aqui recebe `lang` e
 * default pra `DEFAULT_LOCALE` (pt-br), nunca deixando o parâmetro implícito.
 */

const FORMAT_TO_LABEL = {
  noticias: "Notícia",
  reviews: "Review",
  "listas-top": "Lista TOP",
} as const;

export type LegacyFormat = keyof typeof FORMAT_TO_LABEL;

/**
 * Enquanto o repositório não tem nenhum `article` publicado, a Content API
 * rejeita filtros/orderings sobre campos que ela nunca indexou
 * (ex.: `unexpected field 'my.article.format'`). Tratamos isso como
 * "sem resultados" para as páginas renderizarem o estado vazio em vez de 500.
 */
function isNoContentError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return (
    msg.includes("unexpected field") ||
    msg.includes("Empty responses are not supported") ||
    msg.includes("api_notfound_error")
  );
}

export async function getArticlesByFormat(
  format: LegacyFormat,
  {
    limit = 20,
    page = 1,
    lang = DEFAULT_LOCALE,
  }: { limit?: number; page?: number; lang?: Locale } = {},
): Promise<{ results: Content.ArticleDocument[] }> {
  const client = createClient();
  try {
    return await client.getByType<Content.ArticleDocument>("article", {
      lang,
      filters: [`[at(my.article.format, "${FORMAT_TO_LABEL[format]}")]`],
      orderings: [
        { field: "document.first_publication_date", direction: "desc" },
      ],
      pageSize: limit,
      page,
    });
  } catch (err) {
    if (isNoContentError(err)) return { results: [] };
    throw err;
  }
}

export async function getAllArticles({
  limit = 100,
  lang = DEFAULT_LOCALE,
}: { limit?: number; lang?: Locale } = {}): Promise<Content.ArticleDocument[]> {
  const client = createClient();
  try {
    return await client.getAllByType<Content.ArticleDocument>("article", {
      lang,
      orderings: [
        { field: "document.first_publication_date", direction: "desc" },
      ],
      limit,
    });
  } catch (err) {
    if (isNoContentError(err)) return [];
    throw err;
  }
}

export async function getFeaturedArticle(
  lang: Locale = DEFAULT_LOCALE,
): Promise<Content.ArticleDocument | null> {
  const client = createClient();
  try {
    return await client.getFirst<Content.ArticleDocument>({
      lang,
      filters: [`[at(my.article.featured, true)]`],
      orderings: [{ field: "document.first_publication_date", direction: "desc" }],
    });
  } catch {
    // Sem artigo com featured=true.
  }
  try {
    // Cai pro mais recente.
    return await client.getFirst<Content.ArticleDocument>({
      lang,
      orderings: [{ field: "document.first_publication_date", direction: "desc" }],
    });
  } catch {
    // Repositório ainda sem nenhum artigo — a home trata o `null`.
    return null;
  }
}

export async function getArticleByUid(uid: string, lang: Locale = DEFAULT_LOCALE) {
  const client = createClient();
  return client.getByUID<Content.ArticleDocument>("article", uid, { lang });
}

export async function getHomepage(lang: Locale = DEFAULT_LOCALE) {
  const client = createClient();
  return client.getSingle<Content.HomepageDocument>("homepage", { lang });
}

export async function getAboutPage(lang: Locale = DEFAULT_LOCALE) {
  const client = createClient();
  return client.getSingle<Content.AboutDocument>("about", { lang });
}

export async function getPageByUid(uid: string, lang: Locale = DEFAULT_LOCALE) {
  const client = createClient();
  return client.getByUID<Content.PageDocument>("page", uid, { lang });
}

export async function getSiteSettings(lang: Locale = DEFAULT_LOCALE) {
  const client = createClient();
  try {
    return await client.getSingle<Content.SiteSettingsDocument>("site_settings", { lang });
  } catch {
    // Documento `site_settings` ainda não publicado — as páginas tratam o
    // `null` e caem nos fallbacks de nav/rodapé/newsletter.
    return null;
  }
}

export type SiteSettingsData = Content.SiteSettingsDocument["data"];

export function getSiteSettingsData(
  doc: Content.SiteSettingsDocument | null | undefined,
): SiteSettingsData | undefined {
  return doc?.data;
}

export type TrendingItem = { id: number; rank: number; title: string; views: string };

/**
 * Normaliza `site_settings.trending_topics` para o formato do `TrendingSection`.
 * Sem o campo populado, devolve `[]` e o widget não é renderizado.
 */
export function getTrendingTopics(
  settings: SiteSettingsData | undefined,
): TrendingItem[] {
  const topics = settings?.trending_topics;
  if (!topics || topics.length === 0) return [];
  return topics.map((t, i) => ({
    id: i,
    rank: i + 1,
    title: t.title?.trim() || "Tema em destaque",
    views: t.views_label?.trim() || "0 views",
  }));
}

export async function getGameByUid(uid: string, lang: Locale = DEFAULT_LOCALE) {
  const client = createClient();
  return client.getByUID<Content.GameDocument>("game", uid, { lang });
}

export async function getAuthorByUid(uid: string, lang: Locale = DEFAULT_LOCALE) {
  const client = createClient();
  return client.getByUID<Content.AuthorDocument>("author", uid, { lang });
}
