import { Content, asImageSrc, isFilled } from "@prismicio/client";
import type { Article } from "@/app/data";

/**
 * Os componentes de card (NewsCard, ReviewCard, SmallNewsCard, TagBadge,
 * ScoreBadge em app/components.tsx) foram construídos em cima do formato
 * mock `Article` de app/data.ts. Em vez de reescrever esses componentes,
 * este adaptador converte um ArticleDocument real do Prismic para o mesmo
 * formato — assim toda a UI já existente continua funcionando sem mudança.
 *
 * `platforms` é uma extensão opcional (não existe no `Article` original):
 * fica vazia até o campo `article.game` existir no schema (ver HANDOFF) e
 * os artigos serem ligados a um `game`. O ReviewCard usa isso com fallback
 * pro comportamento antigo quando estiver vazio.
 */
export type AdaptedArticle = Article & {
  platforms?: string[];
  listItemCount?: number;
  listType?: string;
};

const MESES = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

const FALLBACK_COVER_IMAGE =
  "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1400&h=700&fit=crop&auto=format";
const FALLBACK_TITLE = "Artigo sem título";
const FALLBACK_EXCERPT = "Confira mais detalhes desta matéria em breve.";
const FALLBACK_AUTHOR = "Redação";

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${String(d.getDate()).padStart(2, "0")} ${MESES[d.getMonth()]} ${d.getFullYear()}`;
}

const FORMAT_TO_CATEGORY: Record<string, Article["category"]> = {
  "Notícia": "noticias",
  "Review": "reviews",
  "Lista TOP": "listas-top",
};

// TODO(schema): o campo `game` (Content Relationship -> game) ainda não existe
// em customtypes/article/index.json — ver HANDOFF-integracao-claude-code.md.
// Uso um tipo local só pra esse campo em vez de travar a compilação do
// projeto inteiro; assim que o campo for criado via CLI e os tipos forem
// regerados, troque `data.game` por `doc.data.game` direto e apague isso.
type ArticleDataWithGame = Content.ArticleDocument["data"] & {
  game?: {
    uid?: string | null;
    data?: { platforms?: { platform: string | null }[] };
  } | null;
};

export function adaptArticle(
  doc: Content.ArticleDocument,
): AdaptedArticle {
  const data = doc.data as ArticleDataWithGame;
  const authorData = isFilled.contentRelationship(doc.data.author)
    ? (doc.data.author.data as { name?: string | null })
    : undefined;
  const gameData = data.game?.data;

  const publishedAt =
    formatDate(doc.data.publish_date_override) ||
    formatDate(doc.first_publication_date);

  return {
    slug: doc.uid,
    title: doc.data.title?.trim() || FALLBACK_TITLE,
    excerpt: doc.data.excerpt?.trim() || FALLBACK_EXCERPT,
    coverImageUrl: asImageSrc(doc.data.cover_image) || FALLBACK_COVER_IMAGE,
    category: FORMAT_TO_CATEGORY[doc.data.format ?? "Notícia"] ?? "noticias",
    gameSlug: data.game?.uid ?? "",
    author: authorData?.name?.trim() || FALLBACK_AUTHOR,
    breaking: doc.data.breaking ?? false,
    publishedAt,
    readingMinutes: doc.data.reading_minutes ?? 5,
    reviewScore: doc.data.review_score ?? undefined,
    tags: (doc.data.tags ?? []).map((t) => t.tag).filter((t): t is string => !!t),
    platforms: gameData?.platforms
      ?.map((p) => p.platform)
      .filter((p): p is string => !!p),
    listItemCount: doc.data.list_item_count ?? undefined,
    listType: doc.data.list_type ?? undefined,
  };
}

export function adaptArticles(docs: Content.ArticleDocument[]): AdaptedArticle[] {
  return docs.map(adaptArticle);
}
