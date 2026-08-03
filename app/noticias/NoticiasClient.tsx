"use client";
import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Clock, Eye, MessageSquare } from "lucide-react";
import Link from "next/link";
import {
  NewsCard,
  SmallNewsCard,
  TrendingSection,
  Newsletter,
  AdPlaceholder,
  SectionTitle,
  OswaldText,
  TagBadge,
} from "../components";
import type { AdaptedArticle } from "../lib/article-adapter";

const ITEMS_PER_PAGE = 6;

export default function NoticiasClient({
  noticias,
  latestReviews,
}: {
  noticias: AdaptedArticle[];
  latestReviews: AdaptedArticle[];
}) {
  const [page, setPage] = useState(1);
  const featured = noticias[0];
  const rest = noticias.slice(1);
  const totalPages = Math.ceil(rest.length / ITEMS_PER_PAGE);
  const pageItems = rest.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <main>
      {/* Category hero banner */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1 h-6 bg-primary" />
              <OswaldText as="h1" className="text-3xl md:text-4xl font-bold text-foreground tracking-wide uppercase">
                Notícias
              </OswaldText>
            </div>
            <p className="text-sm text-muted-foreground ml-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {noticias.length} artigos publicados
            </p>
          </div>
          <nav className="hidden md:flex items-center gap-1 border border-border">
            {[
              { label: "Notícias", active: true, path: "/noticias" },
              { label: "Reviews", active: false, path: "/reviews" },
              { label: "Listas TOP", active: false, path: "/top-lista" },
            ].map((tab) => (
              <Link
                href={tab.path}
                key={tab.label}
                className={`px-4 py-2 text-sm font-bold tracking-wide cursor-pointer transition-colors ${
                  tab.active
                    ? "bg-primary text-white"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
                style={{ fontFamily: "'Oswald', sans-serif" }}
              >
                {tab.label.toUpperCase()}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Featured article */}
      {featured && (
        <Link
          href={`/article/${featured.slug}`}
          className="relative w-full h-80 md:h-[440px] overflow-hidden group cursor-pointer block"
        >
          <Image
            src={featured.coverImageUrl}
            alt={featured.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 md:p-10 max-w-2xl">
            {featured.breaking && (
              <div className="inline-flex items-center gap-1.5 bg-primary text-white text-xs font-bold px-3 py-1 mb-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                URGENTE
              </div>
            )}
            <TagBadge tag="NOTÍCIA" className="mb-3 block" />
            <OswaldText as="h2" className="text-2xl md:text-4xl font-bold text-white leading-tight mb-3">
              {featured.title}
            </OswaldText>
            <p className="text-gray-300 text-sm leading-relaxed mb-4 max-w-lg hidden md:block">{featured.excerpt}</p>
            <div className="flex items-center gap-4 text-xs text-gray-400" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              <span className="text-primary font-semibold">{featured.author}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{featured.readingMinutes} min</span>
              <span className="flex items-center gap-1"><Eye className="w-3 h-3" />—</span>
              <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />—</span>
              <span className="ml-auto text-gray-500">{featured.publishedAt}</span>
            </div>
          </div>
        </Link>
      )}

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
          <div>
            <SectionTitle>Todas as Notícias</SectionTitle>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {pageItems.slice(0, 3).map((a) => (
                <NewsCard key={a.slug} article={a} />
              ))}
            </div>

            <AdPlaceholder className="h-24 mb-8" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {pageItems.slice(3).map((a) => (
                <NewsCard key={a.slug} article={a} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`w-9 h-9 text-sm font-bold transition-colors border ${
                      n === page
                        ? "bg-primary text-white border-primary"
                        : "border-border text-muted-foreground hover:text-foreground hover:border-primary"
                    }`}
                    style={{ fontFamily: "'Oswald', sans-serif" }}
                  >
                    {n}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <aside className="space-y-8">
            <TrendingSection />
            <AdPlaceholder className="h-64" />
            <Newsletter />
            <div>
              <SectionTitle href="/reviews">Últimas Reviews</SectionTitle>
              <div className="space-y-0">
                {latestReviews.map((a) => (
                  <SmallNewsCard key={a.slug} article={a} />
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
