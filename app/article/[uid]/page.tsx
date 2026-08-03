import { notFound } from "next/navigation";
import { SliceZone, PrismicRichText } from "@prismicio/react";
import { Clock, Eye, MessageSquare } from "lucide-react";
import type { Metadata } from "next";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { asImageSrc, isFilled } from "@prismicio/client";
import { OswaldText, TagBadge, ScoreBadge } from "@/app/components";
import { adaptArticle } from "@/app/lib/article-adapter";

const FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&h=200&fit=crop&auto=format";

const FORMAT_TAG: Record<string, string> = {
  "Notícia": "NOTÍCIA",
  "Review": "ANÁLISE",
  "Lista TOP": "LISTA",
};

export async function generateMetadata({ params }: PageProps<"/article/[uid]">): Promise<Metadata> {
  const { uid } = await params;
  const client = createClient();
  const page = await client.getByUID("article", uid).catch(() => null);
  if (!page) return {};
  return {
    title: page.data.seo_title || page.data.title || undefined,
    description: page.data.seo_description || page.data.excerpt || undefined,
    openGraph: {
      images: page.data.seo_image?.url ? [page.data.seo_image.url] : page.data.cover_image?.url ? [page.data.cover_image.url] : [],
    },
  };
}

export default async function ArticlePage({ params }: PageProps<"/article/[uid]">) {
  const { uid } = await params;
  const client = createClient();
  const page = await client.getByUID("article", uid).catch(() => null);
  if (!page) notFound();

  const article = adaptArticle(page);
  const authorData = isFilled.contentRelationship(page.data.author)
    ? (page.data.author.data as { name?: string | null; avatar?: { url?: string | null } | null; role?: string | null } | undefined)
    : undefined;

  return (
    <main>
      {/* Header */}
      <div className="relative w-full h-[380px] md:h-[480px] overflow-hidden">
        <img src={article.coverImageUrl} alt={article.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      </div>

      <div className="max-w-3xl mx-auto px-4 -mt-24 md:-mt-32 relative">
        <div className="bg-card border border-border p-6 md:p-10">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <TagBadge tag={FORMAT_TAG[page.data.format ?? "Notícia"] ?? "NOTÍCIA"} />
            {article.breaking && (
              <span className="text-[10px] font-bold tracking-widest bg-primary text-white px-2 py-0.5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                URGENTE
              </span>
            )}
            {page.data.early_access && (
              <span className="text-[10px] font-bold tracking-widest bg-yellow-500 text-black px-2 py-0.5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                EARLY ACCESS
              </span>
            )}
          </div>

          <OswaldText as="h1" className="text-3xl md:text-5xl font-bold text-foreground leading-tight mb-4">
            {article.title}
          </OswaldText>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-6">{article.excerpt}</p>

          <div className="flex flex-wrap items-center gap-4 pb-6 border-b border-border text-xs text-muted-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            <img
              src={authorData?.avatar?.url || FALLBACK_AVATAR}
              alt={authorData?.name || article.author}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <span className="text-primary font-semibold block">{article.author}</span>
              {authorData?.role && <span className="text-[10px]">{authorData.role}</span>}
            </div>
            <span className="flex items-center gap-1 ml-auto"><Clock className="w-3 h-3" />{article.readingMinutes} min</span>
            <span className="flex items-center gap-1"><Eye className="w-3 h-3" />—</span>
            <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />—</span>
            <span>{article.publishedAt}</span>
          </div>

          {article.reviewScore !== undefined && (
            <div className="flex items-center gap-4 pt-6">
              <ScoreBadge score={article.reviewScore} size="lg" />
              <div>
                <p className="text-xs text-muted-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Nota do Editor</p>
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
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </main>
  );
}
