import { createClient } from "@/prismicio";
import { Content } from "@prismicio/client";

/**
 * Camada de queries do Prismic. Toda página que precisa de conteúdo real
 * passa por aqui em vez de chamar o client diretamente — mantém as
 * consultas (filtros, orderings, fetchLinks) num único lugar.
 */

const FORMAT_TO_LABEL = {
  noticias: "Notícia",
  reviews: "Review",
  "listas-top": "Lista TOP",
} as const;

export type LegacyFormat = keyof typeof FORMAT_TO_LABEL;

export async function getArticlesByFormat(
  format: LegacyFormat,
  { limit = 20, page = 1 }: { limit?: number; page?: number } = {},
) {
  const client = createClient();
  return client.getByType<Content.ArticleDocument>("article", {
    filters: [
      `[at(my.article.format, "${FORMAT_TO_LABEL[format]}")]`,
    ],
    orderings: [{ field: "document.first_publication_date", direction: "desc" }],
    pageSize: limit,
    page,
  });
}

export async function getAllArticles({ limit = 100 }: { limit?: number } = {}) {
  const client = createClient();
  return client.getAllByType<Content.ArticleDocument>("article", {
    orderings: [{ field: "document.first_publication_date", direction: "desc" }],
    limit,
  });
}

export async function getFeaturedArticle() {
  const client = createClient();
  try {
    return await client.getFirst<Content.ArticleDocument>({
      filters: [`[at(my.article.featured, true)]`],
      orderings: [{ field: "document.first_publication_date", direction: "desc" }],
    });
  } catch {
    // Sem nenhum artigo com featured=true: cai pro mais recente.
    return client.getFirst<Content.ArticleDocument>({
      orderings: [{ field: "document.first_publication_date", direction: "desc" }],
    });
  }
}

export async function getArticleByUid(uid: string) {
  const client = createClient();
  return client.getByUID<Content.ArticleDocument>("article", uid);
}

export async function getHomepage() {
  const client = createClient();
  return client.getSingle<Content.HomepageDocument>("homepage");
}

export async function getAboutPage() {
  const client = createClient();
  return client.getSingle<Content.AboutDocument>("about");
}

export async function getPageByUid(uid: string) {
  const client = createClient();
  return client.getByUID<Content.PageDocument>("page", uid);
}

export async function getSiteSettings() {
  const client = createClient();
  try {
    return await client.getSingle<Content.SiteSettingsDocument>("site_settings");
  } catch {
    // site_settings ainda não foi populado com os campos reais (ver HANDOFF) —
    // as páginas tratam esse `null` e caem no conteúdo fixo que já existia.
    return null;
  }
}

// TODO(schema): site_settings só tem o campo `slices` no repositório real hoje —
// nenhum dos campos de site_name/nav/newsletter/trending/ads foi criado ainda
// (ver HANDOFF-integracao-claude-code.md). Este tipo estende o que o Prismic
// gerou com o que o resto do schema documentado espera, e getSiteSettingsData()
// centraliza o cast num único lugar em vez de espalhar `as unknown as X` pelas
// páginas. Assim que os campos existirem de verdade e os tipos forem regerados,
// isso pode voltar a ser só `doc?.data`.
export type SiteSettingsData = Content.SiteSettingsDocument["data"] & {
  site_name?: string | null;
  logo?: { url?: string | null } | null;
  newsletter_heading?: string | null;
  newsletter_subtext?: string | null;
  newsletter_button_label?: string | null;
  trending_topics?: { title?: string | null; link?: unknown; views_label?: string | null }[];
  primary_nav?: { label?: string | null; link?: unknown }[];
  footer_nav?: { label?: string | null; link?: unknown; column?: string | null }[];
  social_links?: { platform?: string | null; url?: unknown }[];
  contact_email?: string | null;
};

export function getSiteSettingsData(
  doc: Content.SiteSettingsDocument | null | undefined,
): SiteSettingsData | undefined {
  return doc?.data as SiteSettingsData | undefined;
}

export async function getGameByUid(uid: string) {
  const client = createClient();
  return client.getByUID<Content.GameDocument>("game", uid);
}

export async function getAuthorByUid(uid: string) {
  const client = createClient();
  return client.getByUID<Content.AuthorDocument>("author", uid);
}
