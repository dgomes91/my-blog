import {
  Content,
  asImageSrc,
  isFilled,
  type RTNode,
  type RTParagraphNode,
} from "@prismicio/client";
import { DEFAULT_LOCALE, HTML_LANG, type Locale } from "./i18n";

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

const FALLBACK_COVER_IMAGE = "/placeholder-cover.svg";
const FALLBACKS: Record<Locale, { title: string; excerpt: string; author: string }> = {
  "pt-br": {
    title: "Artigo sem título",
    excerpt: "Confira mais detalhes desta matéria em breve.",
    author: "Redação",
  },
  "en-us": {
    title: "Untitled article",
    excerpt: "More details on this story coming soon.",
    author: "Staff",
  },
};

function formatDate(iso: string | null | undefined, lang: Locale): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat(HTML_LANG[lang], {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
    .format(d)
    .replace(/\.$/, "");
}

const FORMAT_TO_CATEGORY: Record<string, Article["category"]> = {
  "Notícia": "noticias",
  "Review": "reviews",
  "Lista TOP": "listas-top",
};

export function adaptArticle(
  doc: Content.ArticleDocument,
  lang: Locale = DEFAULT_LOCALE,
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

  const fallback = FALLBACKS[lang];
  const publishedAt =
    formatDate(doc.data.publish_date_override, lang) ||
    formatDate(doc.first_publication_date, lang);

  return {
    slug: doc.uid,
    title: doc.data.title?.trim() || fallback.title,
    excerpt: doc.data.excerpt?.trim() || fallback.excerpt,
    coverImageUrl:
      asImageSrc(doc.data.cover_image) ||
      asImageSrc(gameData?.cover_image) ||
      FALLBACK_COVER_IMAGE,
    category: FORMAT_TO_CATEGORY[doc.data.format ?? "Notícia"] ?? "noticias",
    gameSlug: (game && "uid" in game ? game.uid : "") ?? "",
    author: authorData?.name?.trim() || fallback.author,
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

export function adaptArticles(
  docs: Content.ArticleDocument[],
  lang: Locale = DEFAULT_LOCALE,
): AdaptedArticle[] {
  return docs.map((d) => adaptArticle(d, lang));
}

// ─── FAQ extraction (GEO/AEO) ───────────────────────────────────────────────
/**
 * Extrai pares pergunta/resposta de uma seção "Perguntas frequentes" / "FAQ"
 * dentro dos slices `rich_text` de um artigo, SEM depender de um slice de FAQ
 * dedicado no Prismic (não existe hoje — ver nota no plano de GEO/AEO).
 *
 * Regra: procura um heading2/heading3 cujo texto normalizado seja
 * "perguntas frequentes" ou "faq"; a partir daí, cada heading3 (ou parágrafo
 * inteiramente em **bold**) é tratado como pergunta, e os parágrafos normais
 * seguintes (até a próxima pergunta ou heading2) são concatenados como
 * resposta. Para quando acha o próximo heading2 (fim da seção) ou o fim do
 * conteúdo. Se não achar a seção, retorna [] — nunca inventa perguntas.
 *
 * O texto gerado é usado como está (sem reescrita) no JSON-LD FAQPage, para
 * respeitar a exigência do Google de que o schema espelhe o conteúdo visível.
 */
export type FaqPair = { question: string; answer: string };

function normalizeHeadingText(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .trim()
    .toLowerCase();
}

function isFaqSectionHeading(node: RTNode): boolean {
  if (node.type !== "heading2" && node.type !== "heading3") return false;
  const text = normalizeHeadingText(node.text ?? "");
  return text === "perguntas frequentes" || text === "faq";
}

function isFullyBoldParagraph(node: RTParagraphNode): boolean {
  const text = node.text ?? "";
  if (!text.trim()) return false;
  return node.spans.some(
    (span) => span.type === "strong" && span.start === 0 && span.end === text.length,
  );
}

/** Narrowing helper: só os slices `rich_text` de um artigo. */
function richTextSlices(
  slices: Content.ArticleDocument["data"]["slices"],
): Content.RichTextSlice[] {
  return slices.filter(
    (s) => s.slice_type === "rich_text",
  ) as Content.RichTextSlice[];
}

export function extractFaqPairs(
  slices: Content.ArticleDocument["data"]["slices"],
): FaqPair[] {
  const nodes: RTNode[] = richTextSlices(slices).flatMap(
    (s) => s.primary.content as RTNode[],
  );

  const startIdx = nodes.findIndex(isFaqSectionHeading);
  if (startIdx === -1) return [];

  const pairs: FaqPair[] = [];
  let currentQuestion: string | null = null;
  let answerParts: string[] = [];

  const flush = () => {
    const question = currentQuestion?.trim();
    const answer = answerParts.join(" ").trim();
    if (question && answer) pairs.push({ question, answer });
    currentQuestion = null;
    answerParts = [];
  };

  for (let i = startIdx + 1; i < nodes.length; i++) {
    const node = nodes[i];

    if (node.type === "heading2") {
      // próxima seção do artigo: fim do FAQ.
      flush();
      break;
    }

    const isQuestionNode =
      node.type === "heading3" ||
      (node.type === "paragraph" && isFullyBoldParagraph(node));

    if (isQuestionNode) {
      flush();
      currentQuestion = node.text ?? "";
      continue;
    }

    if (node.type === "paragraph" && currentQuestion) {
      const text = (node.text ?? "").trim();
      if (text) answerParts.push(text);
    }
  }
  flush();

  return pairs;
}
