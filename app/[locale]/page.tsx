import Image from "next/image";
import { Clock, Eye, MessageSquare, Star, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  NewsCard,
  ReviewCard,
  SmallNewsCard,
  TrendingSection,
  Newsletter,
  AdPlaceholder,
  SectionTitle,
  OswaldText,
  TagBadge,
  ScoreBadge,
} from "@/app/components";
import { adaptArticle, adaptArticles } from "@/app/lib/article-adapter";
import {
  getArticlesByFormat,
  getAllArticles,
  getFeaturedArticle,
  getHomepage,
  getSiteSettings,
  getSiteSettingsData,
  getTrendingTopics,
} from "@/app/lib/queries";
import { createClient } from "@/prismicio";
import { Content, isFilled } from "@prismicio/client";
import { CATEGORY_PATH, isLocale, t, withLocale } from "@/app/lib/i18n";
import { pageMetadata } from "@/app/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const lang = locale;
  const ui = t(lang);
  const title =
    lang === "en-us"
      ? "GTA 6 news, reviews and guides"
      : "Notícias, análises e guias de GTA 6";
  const description =
    lang === "en-us"
      ? "The latest GTA 6 news, trailer breakdowns, reviews, and top lists, updated continuously."
      : "As últimas notícias, análise de trailers, reviews e listas TOP de GTA 6, atualizadas continuamente.";
  return pageMetadata({
    title,
    description,
    path: withLocale(lang, "/"),
    lang,
    translations: { "pt-br": "/", "en-us": "/en-us" },
  });
}

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const lang = locale;
  const ui = t(lang);
  const client = createClient();

  const [homepage, siteSettingsDoc, latestNewsRes, latestReviewsRes, latestListasRes, allArticles] =
    await Promise.all([
      getHomepage(lang).catch(() => null),
      getSiteSettings(lang),
      getArticlesByFormat("noticias", { limit: 3, lang }),
      getArticlesByFormat("reviews", { limit: 6, lang }),
      getArticlesByFormat("listas-top", { limit: 2, lang }),
      getAllArticles({ limit: 12, lang }),
    ]);
  const siteSettings = getSiteSettingsData(siteSettingsDoc);

  let heroDoc: Content.ArticleDocument | null = null;
  if (homepage && isFilled.contentRelationship(homepage.data.hero_override)) {
    heroDoc = await client
      .getByID<Content.ArticleDocument>(homepage.data.hero_override.id)
      .catch(() => null);
  }
  if (!heroDoc) heroDoc = await getFeaturedArticle(lang);

  const featured = heroDoc ? adaptArticle(heroDoc, lang) : null;
  const latestNews = adaptArticles(latestNewsRes.results, lang);
  const latestReviewsAll = adaptArticles(latestReviewsRes.results, lang);
  const latestReviews = latestReviewsAll.slice(0, 3);
  const featuredReview = latestReviewsAll.filter((a) => a.reviewScore && a.reviewScore >= 9)[1];
  const latestListas = adaptArticles(latestListasRes.results, lang);
  const moreNews = adaptArticles(
    allArticles.filter((a) => a.uid !== heroDoc?.uid).slice(0, 4),
    lang,
  );
  const breaking = adaptArticles(allArticles, lang).find((a) => a.breaking);

  const trending = getTrendingTopics(siteSettings);

  const readingPicks =
    homepage?.data.reading_picks && homepage.data.reading_picks.length > 0
      ? homepage.data.reading_picks
          .map((p) => p.article)
          .filter(
            (a): a is typeof a & { uid: string; data: { title?: string | null } } =>
              isFilled.contentRelationship(a) && !!a.data,
          )
          .map((a) => ({ slug: a.uid, title: a.data.title?.trim() || ui.readingPickFallback }))
      : moreNews.slice(0, 3).map((a) => ({ slug: a.slug, title: a.title || ui.readingPickFallback }));

  return (
    <>
      {/* Hero */}
      {featured && (
        <section className="relative w-full h-[520px] md:h-[600px] overflow-hidden group cursor-pointer">
          <Link href={withLocale(lang, `/article/${featured.slug}`)} className="contents">
            <Image
              src={featured.coverImageUrl}
              alt={featured.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 max-w-3xl">
              <div className="flex items-center gap-3 mb-3">
                <TagBadge tag={featured.category === "reviews" ? ui.tagReview : ui.tagNews} />
                {featured.reviewScore !== undefined && (
                  <div className="flex items-center gap-1.5 bg-primary px-2 py-0.5">
                    <Star className="w-3 h-3 text-white fill-white" />
                    <OswaldText as="span" className="text-white font-bold text-sm">{featured.reviewScore}</OswaldText>
                  </div>
                )}
                <span className="text-muted-foreground text-xs" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>
                  {featured.tags[0]?.toUpperCase()}
                </span>
              </div>

              <OswaldText as="h1" className="text-3xl md:text-5xl font-bold text-white leading-tight mb-3 tracking-tight">
                {featured.title}
              </OswaldText>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-5 max-w-xl">{featured.excerpt}</p>

              <div className="flex items-center gap-4 text-xs text-gray-400" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>
                <span className="text-primary font-semibold">{featured.author}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{featured.readingMinutes} min</span>
                <span className="flex items-center gap-1"><Eye className="w-3 h-3" />—</span>
                <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />—</span>
                <span className="ml-auto text-gray-500">{featured.publishedAt}</span>
              </div>
            </div>
          </Link>
        </section>
      )}

      {allArticles.length === 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-20 text-center">
          <OswaldText as="h1" className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {ui.noArticlesTitle}
          </OswaldText>
          <p className="text-sm text-muted-foreground">
            {ui.noArticlesBody}
          </p>
        </section>
      )}

      {/* Breaking strip */}
      {breaking && (
        <Link
          href={withLocale(lang, `/article/${breaking.slug}`)}
          className="bg-primary px-4 md:px-8 py-2 flex items-center gap-3 overflow-hidden cursor-pointer"
        >
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <OswaldText as="span" className="font-bold text-white text-xs tracking-widest">{ui.breaking}</OswaldText>
          </div>
          <div className="w-px h-4 bg-white/30" />
          <p className="text-white text-xs font-medium truncate">{breaking.title}</p>
          <ChevronRight className="w-4 h-4 text-white shrink-0 ml-auto" />
        </Link>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
          {/* Main column */}
          <div>
            {/* Latest news */}
            <section className="mb-12">
              <SectionTitle href={CATEGORY_PATH[lang].news}>{ui.latestNews}</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {latestNews.map((a) => (
                  <NewsCard key={a.slug} article={a} />
                ))}
              </div>
            </section>

            {/* Reviews */}
            <section className="mb-12">
              <SectionTitle href={CATEGORY_PATH[lang].reviews}>{ui.recentReviews}</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {latestReviews.map((r) => (
                  <ReviewCard key={r.slug} article={r} />
                ))}
              </div>
            </section>

            {/* Featured review banner */}
            {featuredReview && featuredReview.reviewScore !== undefined && (
              <section className="mb-12">
                <Link
                  href={withLocale(lang, `/article/${featuredReview.slug}`)}
                  className="relative overflow-hidden bg-card border border-border group cursor-pointer block"
                >
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_280px]">
                    <div className="p-6 md:p-8 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-[10px] font-bold tracking-widest bg-primary text-white px-2 py-0.5" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>
                          {ui.featuredReviewLabel}
                        </span>
                      </div>
                      <OswaldText
                        as="h2"
                        className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-3 group-hover:text-primary transition-colors"
                      >
                        {featuredReview.title}
                      </OswaldText>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-5 max-w-md">
                        {featuredReview.excerpt}
                      </p>
                      <div className="flex items-center gap-4">
                        <ScoreBadge score={featuredReview.reviewScore} size="lg" />
                        <div>
                          <p className="text-xs text-muted-foreground" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>{ui.editorScore}</p>
                          <OswaldText as="p" className="font-bold text-sm text-foreground">{ui.universallyAcclaimed}</OswaldText>
                        </div>
                      </div>
                    </div>
                    <div className="relative h-48 md:h-auto overflow-hidden bg-secondary">
                      <Image
                        src={featuredReview.coverImageUrl}
                        alt={featuredReview.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-card via-transparent to-transparent md:block hidden" />
                    </div>
                  </div>
                </Link>
              </section>
            )}

            {/* Listas TOP */}
            <section className="mb-12">
              <SectionTitle href={CATEGORY_PATH[lang].topLists}>{ui.topListsHeading}</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {latestListas.map((a) => (
                  <Link
                    key={a.slug}
                    href={withLocale(lang, `/article/${a.slug}`)}
                    className="group cursor-pointer bg-card border border-border overflow-hidden hover:border-primary/40 transition-colors block"
                  >
                    <div className="relative overflow-hidden bg-secondary aspect-video">
                      <Image
                        src={a.coverImageUrl}
                        alt={a.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute top-2 left-2"><TagBadge tag={ui.tagList} /></div>
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <OswaldText as="h3" className="text-lg font-bold text-white leading-snug group-hover:text-primary transition-colors line-clamp-2">
                          {a.title}
                        </OswaldText>
                      </div>
                    </div>
                    <div className="px-4 py-3 flex items-center justify-between text-xs text-muted-foreground" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>
                      <span className="text-primary font-semibold">{a.author}</span>
                      <span>{a.readingMinutes} min · {a.publishedAt}</span>
                    </div>
                  </Link>
                ))}
              </div>
              <Link
                href={CATEGORY_PATH[lang].topLists}
                className="mt-4 flex items-center justify-center gap-2 border border-border text-muted-foreground hover:text-foreground hover:border-primary py-3 text-sm font-bold tracking-wide transition-colors w-full"
                style={{ fontFamily: "var(--font-oswald), sans-serif" }}
              >
                {ui.viewAllLists} <ChevronRight className="w-4 h-4" />
              </Link>
            </section>

            {/* More news */}
            <section>
              <SectionTitle href={CATEGORY_PATH[lang].news}>{ui.moreNews}</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                {moreNews.map((a) => (
                  <SmallNewsCard key={a.slug} article={a} />
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            <TrendingSection items={trending} />
            <AdPlaceholder className="h-64" />
            <Newsletter siteSettings={siteSettings} />
            <div>
              <SectionTitle>{ui.readLater}</SectionTitle>
              <div className="space-y-3">
                {readingPicks.map((a) => (
                  <Link key={a.slug} href={withLocale(lang, `/article/${a.slug}`)} className="flex items-start gap-3 group cursor-pointer">
                    <div className="w-1 h-4 bg-border group-hover:bg-primary transition-colors shrink-0 mt-0.5" />
                    <OswaldText
                      as="p"
                      className="text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2"
                    >
                      {a.title}
                    </OswaldText>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
