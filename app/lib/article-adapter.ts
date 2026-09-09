import { Content, asImageSrc, isFilled } from "@prismicio/client";

/**
 * Formato plano consumido pelos componentes de card (NewsCard, ReviewCard,
 * SmallNewsCard, TagBadge, ScoreBadge em app/components.tsx). Era o shape do
 * mock antigo (`app/data.ts`, removido); virou o contrato de saída deste
 * adaptador, que converte um `ArticleDocument` real do Prismic para cá — assim
 * a UI de cards continua igual, sem depender do formato bruto da API.
 */
export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  coverImageUrl: string;
  category: "noticias" | "reviews" | "listas-top";
  gameSlug: string;
  author: string;
  breaking: boolean;
  publishedAt: string;
  readingMinutes: number;
  reviewScore?: number;
  tags: string[];
};

/**
 * `platforms` é uma extensão opcional: vem do `game` ligado ao artigo
 * (Content Relationship `article.game`). Fica vazia se o artigo não tiver
 * jogo associado — o ReviewCard cai no comportamento antigo nesse caso.
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

const FALLBACK_COVER_IMAGE = "/placeholder-cover.svg";
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

export function adaptArticle(
  doc: Content.ArticleDocument,
): AdaptedArticle {
  // `article.author` e `article.game` são Content Relationships com campos
  // selecionados no modelo — a Content API já devolve `.data` populado, sem
  // precisar de fetchLinks/graphQuery.
  const authorData = isFilled.contentRelationship(doc.data.author)
    ? (doc.data.author.data as { name?: string | null } | undefined)
    : undefined;
  const game = isFilled.contentRelationship(doc.data.game)
    ? doc.data.game
    : undefined;
  const gameData = game?.data as
    | {
        platforms?: { platform: string | null }[];
        cover_image?: Parameters<typeof asImageSrc>[0];
      }
    | undefined;

  const publishedAt =
    formatDate(doc.data.publish_date_override) ||
    formatDate(doc.first_publication_date);

  return {
    slug: doc.uid,
    title: doc.data.title?.trim() || FALLBACK_TITLE,
    excerpt: doc.data.excerpt?.trim() || FALLBACK_EXCERPT,
    coverImageUrl:
      asImageSrc(doc.data.cover_image) ||
      asImageSrc(gameData?.cover_image) ||
      FALLBACK_COVER_IMAGE,
    category: FORMAT_TO_CATEGORY[doc.data.format ?? "Notícia"] ?? "noticias",
    gameSlug: (game && "uid" in game ? game.uid : "") ?? "",
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
