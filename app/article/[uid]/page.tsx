import Image from "next/image";
import { notFound } from "next/navigation";
import { SliceZone, PrismicRichText } from "@prismicio/react";
import { Clock, MessageSquare } from "lucide-react";
import type { Metadata } from "next";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { isFilled } from "@prismicio/client";
import { OswaldText, TagBadge, ScoreBadge } from "@/app/components";
import { adaptArticle } from "@/app/lib/article-adapter";
import { DisqusComments, DisqusCommentCount } from "@/app/components/disqus";
import { JsonLd } from "@/app/components/json-ld";
import {
  SITE_URL,
  absoluteUrl,
  breadcrumbLd,
  jsonLdGraph,
  newsArticleLd,
  pageMetadata,
  rasterImage,
} from "@/app/lib/seo";

const FALLBACK_AVATAR = "/placeholder-avatar.svg";

const FORMAT_TAG: Record<string, string> = {
  "Notícia": "NOTÍCIA",
  "Review": "ANÁLISE",
  "Lista TOP": "LISTA",
};

const FORMAT_SECTION: Record<string, { label: string; path: string }> = {
  "Notícia": { label: "Notícias", path: "/noticias" },
  "Review": { label: "Reviews", path: "/reviews" },
  "Lista TOP": { label: "Listas TOP", path: "/top-lista" },
};

function articleDates(page: {
  first_publication_date: string;
  last_publication_date: string;
  data: { publish_date_override?: string | null };
}) {
  const override = page.data.publish_date_override
    ? new Date(`${page.data.publish_date_override}T12:00:00Z`).toISOString()
    : null;
  return {
    published: override || page.first_publication_date,
    modified: page.last_publication_date,
  };
}

export async function generateMetadata({ params }: PageProps<"/article/[uid]">): Promise<Metadata> {
  const { uid } = await params;
  const client = createClient();
  const page = await client.getByUID("article", uid).catch(() => null);
  if (!page) return {};

  const article = adaptArticle(page);
  const { published, modified } = articleDates(page);
  const section = FORMAT_SECTION[page.data.format ?? "Notícia"] ?? FORMAT_SECTION["Notícia"];
  const image =
    rasterImage(page.data.seo_image?.url) ||
    rasterImage(page.data.cover_image?.url) ||
    rasterImage(article.coverImageUrl);

  return pageMetadata({
    title: page.data.seo_title?.trim() || article.title,
    description: page.data.seo_description?.trim() || article.excerpt,
    path: `/article/${uid}`,
    type: "article",
    images: [image],
    publishedTime: published,
    modifiedTime: modified,
    authors: [article.author],
    section: section.label,
    tags: article.tags,
  });
}

export default async function ArticlePage({ params }: PageProps<"/article/[uid]">) {
  const { uid } = await params;
  const client = createClient();
  const page = await client.getByUID("article", uid).catch(() => null);
  if (!page) notFound();

  const article = adaptArticle(page);
  const articleUrl = `${SITE_URL}/article/${uid}`;
  const authorData = isFilled.contentRelationship(page.data.author)
    ? (page.data.author.data as { name?: string | null; avatar?: { url?: string | null } | null; role?: string | null } | undefined)
    : undefined;

  const { published, modified } = articleDates(page);
  const section = FORMAT_SECTION[page.data.format ?? "Notícia"] ?? FORMAT_SECTION["Notícia"];
  const ldImage =
    rasterImage(page.data.seo_image?.url) ||
    rasterImage(page.data.cover_image?.url) ||
    rasterImage(article.coverImageUrl);
  const isReview = page.data.format === "Review";

  const jsonLd = jsonLdGraph(
    newsArticleLd({
      path: `/article/${uid}`,
      headline: article.title,
      description:
        page.data.seo_description?.trim() || article.excerpt || article.title,
      image: ldImage,
      datePublished: published,
      dateModified: modified,
      authorName: article.author,
      authorUrl: absoluteUrl("/about"),
      section: section.label,
      keywords: article.tags,
      isReview,
      reviewScore: isReview ? article.reviewScore : undefined,
    }),
    breadcrumbLd([
      { name: "Início", path: "/" },
      { name: section.label, path: section.path },
      { name: article.title, path: `/article/${uid}` },
    ]),
  );

  return (
    <main>
      <JsonLd json={jsonLd} />
      {/* Header */}
      <div className="relative w-full h-[380px] md:h-[480px] overflow-hidden">
        <Image src={article.coverImageUrl} alt={article.title} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      </div>

      <div className="max-w-3xl mx-auto px-4 -mt-24 md:-mt-32 relative">
        <div className="bg-card border border-border p-6 md:p-10">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <TagBadge tag={FORMAT_TAG[page.data.format ?? "Notícia"] ?? "NOTÍCIA"} />
            {article.breaking && (
              <span className="text-[10px] font-bold tracking-widest bg-primary text-white px-2 py-0.5" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>
                URGENTE
              </span>
            )}
            {page.data.early_access && (
              <span className="text-[10px] font-bold tracking-widest bg-yellow-500 text-black px-2 py-0.5" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>
                EARLY ACCESS
              </span>
            )}
          </div>

          <OswaldText as="h1" className="text-3xl md:text-5xl font-bold text-foreground leading-tight mb-4">
            {article.title}
          </OswaldText>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-6">{article.excerpt}</p>

          <div className="flex flex-wrap items-center gap-4 pb-6 border-b border-border text-xs text-muted-foreground" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>
            <Image
              src={authorData?.avatar?.url || FALLBACK_AVATAR}
              alt={authorData?.name || article.author}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <span className="text-primary font-semibold block">{article.author}</span>
              {authorData?.role && <span className="text-[10px]">{authorData.role}</span>}
            </div>
            <span className="flex items-center gap-1 ml-auto"><Clock className="w-3 h-3" />{article.readingMinutes} min</span>
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              <DisqusCommentCount identifier={uid} url={articleUrl} />
            </span>
            <time dateTime={published}>{article.publishedAt}</time>
          </div>

          {article.reviewScore !== undefined && (
            <div className="flex items-center gap-4 pt-6">
              <ScoreBadge score={article.reviewScore} size="lg" />
              <div>
                <p className="text-xs text-muted-foreground" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>Nota do Editor</p>
                {page.data.review_copy_disclosure && (
                  <p className="text-xs text-muted-foreground italic mt-1 max-w-md">{page.data.review_copy_disclosure}</p>
                )}
              </div>
            </div>
          )}

          {page.data.score_revision_note && isFilled.richText(page.data.score_revision_note) && (
            <div className="mt-4 text-xs text-muted-foreground italic border-l-2 border-primary pl-3 py-1">
              <PrismicRichText field={page.data.score_revision_note} />
            </div>
          )}
        </div>
      </div>

      {/* Corpo do artigo */}
      <div className="py-8">
        <SliceZone slices={page.data.slices} components={components} />
      </div>

      {article.tags.length > 0 && (
        <div className="max-w-3xl mx-auto px-4 pb-12 flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-1 bg-secondary text-muted-foreground tracking-wide uppercase"
              style={{ fontFamily: "var(--font-jetbrains), monospace" }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <DisqusComments identifier={uid} title={article.title} url={articleUrl} />
    </main>
  );
}
