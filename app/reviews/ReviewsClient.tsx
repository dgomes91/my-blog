"use client";
import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import Link from "next/link";
import {
  ReviewCard,
  SmallNewsCard,
  AdPlaceholder,
  Newsletter,
  SectionTitle,
  OswaldText,
  ScoreBadge,
} from "../components";
import type { AdaptedArticle } from "../lib/article-adapter";
import type { SiteSettingsData } from "../lib/queries";

type SortKey = "recente" | "nota-alta" | "nota-baixa";
const ITEMS_PER_PAGE = 6;

function ScoreDistribution({ reviews }: { reviews: AdaptedArticle[] }) {
  const bands = [
    { label: "9–10", count: reviews.filter((a) => (a.reviewScore ?? 0) >= 9).length, color: "bg-emerald-500" },
    { label: "8–9", count: reviews.filter((a) => (a.reviewScore ?? 0) >= 8 && (a.reviewScore ?? 0) < 9).length, color: "bg-yellow-500" },
    { label: "7–8", count: reviews.filter((a) => (a.reviewScore ?? 0) >= 7 && (a.reviewScore ?? 0) < 8).length, color: "bg-orange-500" },
    { label: "< 7", count: reviews.filter((a) => (a.reviewScore ?? 0) < 7).length, color: "bg-red-600" },
  ];
  const max = Math.max(...bands.map((b) => b.count), 1);
  return (
    <div className="bg-card border border-border p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 bg-primary" />
        <OswaldText as="h3" className="text-sm font-bold uppercase tracking-wide">
          Distribuição de Notas
        </OswaldText>
      </div>
      <div className="space-y-2">
        {bands.map((b) => (
          <div key={b.label} className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground w-8 text-right" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {b.label}
            </span>
            <div className="flex-1 bg-secondary h-4">
              <div className={`${b.color} h-full transition-all duration-500`} style={{ width: `${(b.count / max) * 100}%` }} />
            </div>
            <span className="text-xs text-muted-foreground w-4" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {b.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ReviewsClient({
  reviews,
  latestNews,
  siteSettings,
}: {
  reviews: AdaptedArticle[];
  latestNews: AdaptedArticle[];
  siteSettings?: SiteSettingsData;
}) {
  const [sort, setSort] = useState<SortKey>("recente");
  const [page, setPage] = useState(1);

  const featured = reviews[0];
  const rest = reviews.slice(1);

  const sorted = [...rest].sort((a, b) => {
    if (sort === "nota-alta") return (b.reviewScore ?? 0) - (a.reviewScore ?? 0);
    if (sort === "nota-baixa") return (a.reviewScore ?? 0) - (b.reviewScore ?? 0);
    return 0;
  });

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const pageItems = sorted.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <main>
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1 h-6 bg-primary" />
              <OswaldText as="h1" className="text-3xl md:text-4xl font-bold text-foreground tracking-wide uppercase">
                Reviews
              </OswaldText>
            </div>
            <p className="text-sm text-muted-foreground ml-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {reviews.length} análises publicadas
            </p>
          </div>
          <div className="flex items-center gap-0 border border-border">
            {(["recente", "nota-alta", "nota-baixa"] as SortKey[]).map((s) => {
              const labels: Record<SortKey, string> = { recente: "RECENTES", "nota-alta": "NOTA ↑", "nota-baixa": "NOTA ↓" };
              return (
                <button
                  key={s}
                  onClick={() => { setSort(s); setPage(1); }}
                  className={`px-4 py-2 text-xs font-bold tracking-wide transition-colors ${
                    sort === s ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                  style={{ fontFamily: "'Oswald', sans-serif" }}
                >
                  {labels[s]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {featured && featured.reviewScore !== undefined && (
        <div className="bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-0">
            <Link href={`/article/${featured.slug}`} className="relative overflow-hidden group cursor-pointer block">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_360px]">
                <div className="p-6 md:p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[10px] font-bold tracking-widest bg-primary text-white px-2 py-0.5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      ANÁLISE EM DESTAQUE
                    </span>
                    <span className="text-xs text-muted-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {featured.publishedAt}
                    </span>
                  </div>
                  <OswaldText as="h2" className="text-3xl md:text-5xl font-bold text-foreground leading-tight mb-3 group-hover:text-primary transition-colors">
                    {featured.title}
                  </OswaldText>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-lg">{featured.excerpt}</p>
                  <div className="flex items-center gap-4">
                    <ScoreBadge score={featured.reviewScore} size="lg" />
                    <div>
                      <div className="flex gap-0.5 mb-1">
                        {Array.from({ length: 10 }).map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < Math.round(featured.reviewScore ?? 0) ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`} />
                        ))}
                      </div>
                      <OswaldText as="p" className="text-xs font-bold text-muted-foreground tracking-wide">
                        ACLAMADO PELA CRÍTICA
                      </OswaldText>
                      <p className="text-xs text-muted-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        por {featured.author}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="relative h-56 md:h-auto overflow-hidden bg-secondary">
                  <Image src={featured.coverImageUrl} alt={featured.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-r from-card via-transparent to-transparent md:block hidden" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
          <div>
            <SectionTitle>Todas as Análises</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {pageItems.slice(0, 4).map((a) => <ReviewCard key={a.slug} article={a} />)}
            </div>
            <AdPlaceholder className="h-24 mb-8" />
            {pageItems.length > 4 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {pageItems.slice(4).map((a) => <ReviewCard key={a.slug} article={a} />)}
              </div>
            )}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-2 border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-colors disabled:opacity-30">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button key={n} onClick={() => setPage(n)} className={`w-9 h-9 text-sm font-bold transition-colors border ${n === page ? "bg-primary text-white border-primary" : "border-border text-muted-foreground hover:text-foreground hover:border-primary"}`} style={{ fontFamily: "'Oswald', sans-serif" }}>
                    {n}
                  </button>
                ))}
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-colors disabled:opacity-30">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <aside className="space-y-8">
            <ScoreDistribution reviews={reviews} />
            <AdPlaceholder className="h-64" />
            <Newsletter siteSettings={siteSettings} />
            <div>
              <SectionTitle href="/noticias">Últimas Notícias</SectionTitle>
              <div>
                {latestNews.map((a) => <SmallNewsCard key={a.slug} article={a} />)}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
