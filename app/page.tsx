import { Clock, Eye, MessageSquare, Star, ChevronRight } from "lucide-react";
import Link from "next/link";
import { ARTICLES, TRENDING } from "./data";
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
} from "./components";

const featured = ARTICLES.find((a) => a.reviewScore !== undefined && a.reviewScore >= 9) ?? ARTICLES[0];
const latestNews = ARTICLES.filter((a) => a.category === "noticias").slice(0, 3);
const latestReviews = ARTICLES.filter((a) => a.category === "reviews").slice(0, 3);
const latestListas = ARTICLES.filter((a) => a.category === "listas-top").slice(0, 2);
const moreNews = ARTICLES.filter((a) => a.slug !== featured.slug).slice(0, 4);
const featuredReview = ARTICLES.filter((a) => a.category === "reviews" && a.reviewScore && a.reviewScore >= 9)[1];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative w-full h-[520px] md:h-[600px] overflow-hidden group cursor-pointer">
        <img
          src={featured.coverImageUrl}
          alt={featured.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 max-w-3xl">
          <div className="flex items-center gap-3 mb-3">
            <TagBadge tag={featured.category === "reviews" ? "ANÁLISE" : "NOTÍCIA"} />
            {featured.reviewScore !== undefined && (
              <div className="flex items-center gap-1.5 bg-primary px-2 py-0.5">
                <Star className="w-3 h-3 text-white fill-white" />
                <OswaldText as="span" className="text-white font-bold text-sm">{featured.reviewScore}</OswaldText>
              </div>
            )}
            <span className="text-muted-foreground text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {featured.tags[0]?.toUpperCase()}
            </span>
          </div>

          <OswaldText as="h1" className="text-3xl md:text-5xl font-bold text-white leading-tight mb-3 tracking-tight">
            {featured.title}
          </OswaldText>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-5 max-w-xl">{featured.excerpt}</p>

          <div className="flex items-center gap-4 text-xs text-gray-400" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            <span className="text-primary font-semibold">{featured.author}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{featured.readingMinutes} min</span>
            <span className="flex items-center gap-1"><Eye className="w-3 h-3" />—</span>
            <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />—</span>
            <span className="ml-auto text-gray-500">{featured.publishedAt}</span>
          </div>
        </div>
      </section>

      {/* Breaking strip */}
      {ARTICLES.find((a) => a.breaking) && (
        <div className="bg-primary px-4 md:px-8 py-2 flex items-center gap-3 overflow-hidden cursor-pointer">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <OswaldText as="span" className="font-bold text-white text-xs tracking-widest">URGENTE</OswaldText>
          </div>
          <div className="w-px h-4 bg-white/30" />
          <p className="text-white text-xs font-medium truncate">
            {ARTICLES.find((a) => a.breaking)?.title}
          </p>
          <ChevronRight className="w-4 h-4 text-white shrink-0 ml-auto" />
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
          {/* Main column */}
          <div>
            {/* Latest news */}
            <section className="mb-12">
              <SectionTitle href="/noticias">Últimas Notícias</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {latestNews.map((a) => (
                  <NewsCard key={a.slug} article={a} />
                ))}
              </div>
            </section>

            {/* Reviews */}
            <section className="mb-12">
              <SectionTitle href="/reviews">Análises Recentes</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {latestReviews.map((r) => (
                  <ReviewCard key={r.slug} article={r} />
                ))}
              </div>
            </section>

            {/* Featured review banner */}
            {featuredReview && featuredReview.reviewScore !== undefined && (
              <section className="mb-12">
                <div className="relative overflow-hidden bg-card border border-border group cursor-pointer">
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_280px]">
                    <div className="p-6 md:p-8 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-[10px] font-bold tracking-widest bg-primary text-white px-2 py-0.5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                          ANÁLISE EM DESTAQUE
                        </span>
                        <span className="text-xs text-muted-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Simulação</span>
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
                          <p className="text-xs text-muted-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Nota do Editor</p>
                          <OswaldText as="p" className="font-bold text-sm text-foreground">ACLAMADO UNIVERSALMENTE</OswaldText>
                        </div>
                      </div>
                    </div>
                    <div className="relative h-48 md:h-auto overflow-hidden bg-secondary">
                      <img
                        src={featuredReview.coverImageUrl}
                        alt={featuredReview.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-card via-transparent to-transparent md:block hidden" />
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Listas TOP */}
            <section className="mb-12">
              <SectionTitle href="/listas-top">Listas TOP</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {latestListas.map((a) => (
                  <article key={a.slug} className="group cursor-pointer bg-card border border-border overflow-hidden hover:border-primary/40 transition-colors">
                    <div className="relative overflow-hidden bg-secondary aspect-video">
                      <img
                        src={a.coverImageUrl}
                        alt={a.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute top-2 left-2"><TagBadge tag="LISTA" /></div>
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <OswaldText as="h3" className="text-lg font-bold text-white leading-snug group-hover:text-primary transition-colors line-clamp-2">
                          {a.title}
                        </OswaldText>
                      </div>
                    </div>
                    <div className="px-4 py-3 flex items-center justify-between text-xs text-muted-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      <span className="text-primary font-semibold">{a.author}</span>
                      <span>{a.readingMinutes} min · {a.publishedAt}</span>
                    </div>
                  </article>
                ))}
              </div>
              <Link
                to="/listas-top"
                className="mt-4 flex items-center justify-center gap-2 border border-border text-muted-foreground hover:text-foreground hover:border-primary py-3 text-sm font-bold tracking-wide transition-colors w-full"
                style={{ fontFamily: "'Oswald', sans-serif" }}
              >
                VER TODAS AS LISTAS <ChevronRight className="w-4 h-4" />
              </Link>
            </section>

            {/* More news */}
            <section>
              <SectionTitle href="/noticias">Mais Notícias</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                {moreNews.map((a) => (
                  <SmallNewsCard key={a.slug} article={a} />
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            <TrendingSection />
            <AdPlaceholder className="h-64" />
            <Newsletter />
            <div>
              <SectionTitle>Para Ler Depois</SectionTitle>
              <div className="space-y-3">
                {ARTICLES.slice(4, 7).map((a) => (
                  <div key={a.slug} className="flex items-start gap-3 group cursor-pointer">
                    <div className="w-1 h-4 bg-border group-hover:bg-primary transition-colors shrink-0 mt-0.5" />
                    <OswaldText
                      as="p"
                      className="text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2"
                    >
                      {a.title}
                    </OswaldText>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
