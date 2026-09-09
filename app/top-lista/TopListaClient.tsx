"use client";
import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Trophy, List } from "lucide-react";
import Link from "next/link";
import {
  TrendingSection,
  Newsletter,
  AdPlaceholder,
  SectionTitle,
  OswaldText,
  TagBadge,
  SmallNewsCard,
} from "../components";
import type { AdaptedArticle } from "../lib/article-adapter";
import type { SiteSettingsData, TrendingItem } from "../lib/queries";

// Fallback pra conteúdo antigo sem list_item_count preenchido no Prismic.
function extractNumber(title: string): number | null {
  const match = title.match(/\b(\d+)\b/);
  return match ? parseInt(match[1]) : null;
}

type FilterKey = "todos" | "tier-list" | "top-10" | "recomendacao";
const FILTER_LABELS: Record<FilterKey, string> = {
  todos: "TODOS",
  "tier-list": "TIER LISTS",
  "top-10": "TOP N",
  recomendacao: "RECOMENDAÇÕES",
};
const FILTER_TO_LIST_TYPE: Record<Exclude<FilterKey, "todos">, string> = {
  "tier-list": "Tier List",
  "top-10": "Top N",
  recomendacao: "Recomendação",
};

function ListaCard({ article, index }: { article: AdaptedArticle; index: number }) {
  const itemCount = article.listItemCount ?? extractNumber(article.title);
  const isFirst = index === 0;

  return (
    <Link
      href={`/article/${article.slug}`}
      className={`group cursor-pointer bg-card border overflow-hidden hover:border-primary/40 transition-all duration-200 block ${
        isFirst ? "border-primary/30 md:col-span-2" : "border-border"
      }`}
    >
      <div className={`relative overflow-hidden bg-secondary ${isFirst ? "aspect-[21/9] md:aspect-[16/5]" : "aspect-video"}`}>
        <Image src={article.coverImageUrl} alt={article.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        {itemCount && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <div className="bg-primary text-white px-3 py-1 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5" />
              <OswaldText as="span" className={`font-bold ${isFirst ? "text-xl" : "text-lg"}`}>
                TOP {itemCount}
              </OswaldText>
            </div>
          </div>
        )}
        {isFirst && (
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <TagBadge tag="LISTA" className="mb-2 block" />
            <OswaldText as="h2" className="text-2xl md:text-4xl font-bold text-white leading-tight mb-2 group-hover:text-primary transition-colors">
              {article.title}
            </OswaldText>
            <p className="text-sm text-gray-300 max-w-xl hidden md:block">{article.excerpt}</p>
            <div className="flex items-center gap-3 mt-3 text-xs text-gray-400" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>
              <span className="text-primary font-semibold">{article.author}</span>
              <span>·</span>
              <span>{article.readingMinutes} min de leitura</span>
              <span>·</span>
              <span>{article.publishedAt}</span>
            </div>
          </div>
        )}
      </div>
      {!isFirst && (
        <div className="p-4">
          <TagBadge tag="LISTA" className="mb-2 block" />
          <OswaldText as="h3" className="text-base font-bold text-foreground leading-snug group-hover:text-primary transition-colors mb-2">
            {article.title}
          </OswaldText>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3">{article.excerpt}</p>
          <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-3" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>
            <span className="text-primary font-semibold">{article.author}</span>
            <span>{article.readingMinutes} min · {article.publishedAt}</span>
          </div>
        </div>
      )}
    </Link>
  );
}

function ListaRowCard({ article }: { article: AdaptedArticle }) {
  const itemCount = article.listItemCount ?? extractNumber(article.title);
  return (
    <Link href={`/article/${article.slug}`} className="group cursor-pointer flex gap-0 bg-card border border-border hover:border-primary/40 transition-colors overflow-hidden">
      <div className="relative w-32 md:w-40 shrink-0 overflow-hidden bg-secondary">
        <Image src={article.coverImageUrl} alt={article.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
        {itemCount && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-center">
              <List className="w-5 h-5 text-primary mx-auto mb-0.5" />
              <OswaldText as="span" className="text-2xl font-bold text-white">{itemCount}</OswaldText>
              <OswaldText as="p" className="text-[9px] font-bold text-primary tracking-widest">ITENS</OswaldText>
            </div>
          </div>
        )}
      </div>
      <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
        <div>
          <TagBadge tag="LISTA" className="mb-2 block" />
          <OswaldText as="h3" className="text-base font-bold text-foreground leading-snug group-hover:text-primary transition-colors mb-1">
            {article.title}
          </OswaldText>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 hidden md:block">{article.excerpt}</p>
        </div>
        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>
          <span className="text-primary font-semibold">{article.author}</span>
          <span>·</span>
          <span>{article.publishedAt}</span>
        </div>
      </div>
    </Link>
  );
}

const ITEMS_PER_PAGE = 6;

export default function TopListaClient({
  listas,
  latestReviews,
  trending,
  siteSettings,
}: {
  listas: AdaptedArticle[];
  latestReviews: AdaptedArticle[];
  trending: TrendingItem[];
  siteSettings?: SiteSettingsData;
}) {
  const [filter, setFilter] = useState<FilterKey>("todos");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filtered =
    filter === "todos"
      ? listas
      : listas.filter((a) => {
          // Preferência: campo real list_type. Fallback: heurística por palavra no título
          // (só entra em jogo pra artigos migrados antes de list_type existir).
          if (a.listType) return a.listType === FILTER_TO_LIST_TYPE[filter];
          const t = a.title.toLowerCase();
          if (filter === "tier-list") return t.includes("tier") || t.includes("poderosos") || t.includes("melhores");
          if (filter === "top-10") return /\d+/.test(t);
          if (filter === "recomendacao") return t.includes("motivo") || t.includes("começar") || t.includes("iniciante");
          return true;
        });

  const featuredList = filtered[0];
  const restFiltered = filtered.slice(1);
  const totalPages = Math.ceil(restFiltered.length / ITEMS_PER_PAGE);
  const pageItems = restFiltered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <main>
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1 h-6 bg-primary" />
                <OswaldText as="h1" className="text-3xl md:text-4xl font-bold text-foreground tracking-wide uppercase">
                  Listas TOP
                </OswaldText>
              </div>
              <p className="text-sm text-muted-foreground ml-3" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>
                {listas.length} listas publicadas
              </p>
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              {(Object.keys(FILTER_LABELS) as FilterKey[]).map((f) => (
                <button
                  key={f}
                  onClick={() => { setFilter(f); setPage(1); }}
                  className={`px-3 py-1.5 text-xs font-bold tracking-wide transition-colors border ${
                    filter === f ? "bg-primary text-white border-primary" : "border-border text-muted-foreground hover:text-foreground hover:border-primary"
                  }`}
                  style={{ fontFamily: "var(--font-oswald), sans-serif" }}
                >
                  {FILTER_LABELS[f]}
                </button>
              ))}
              <div className="flex items-center gap-0 border border-border ml-2">
                <button onClick={() => setViewMode("grid")} className={`px-3 py-1.5 text-xs transition-colors ${viewMode === "grid" ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`} title="Grade">⊞</button>
                <button onClick={() => setViewMode("list")} className={`px-3 py-1.5 text-xs transition-colors ${viewMode === "list" ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`} title="Lista">≡</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
          <div>
            {featuredList && (
              <div className="mb-10">
                <SectionTitle>Lista em Destaque</SectionTitle>
                <ListaCard article={featuredList} index={0} />
              </div>
            )}

            <AdPlaceholder className="h-24 mb-8" />

            <SectionTitle>Todas as Listas</SectionTitle>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                {pageItems.map((a, i) => <ListaCard key={a.slug} article={a} index={i + 1} />)}
              </div>
            ) : (
              <div className="space-y-3 mb-8">
                {pageItems.map((a) => <ListaRowCard key={a.slug} article={a} />)}
              </div>
            )}

            {filtered.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <OswaldText as="p" className="text-2xl font-bold mb-2">Nenhuma lista encontrada</OswaldText>
                <p className="text-sm">Tente outro filtro.</p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-2 border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-colors disabled:opacity-30">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button key={n} onClick={() => setPage(n)} className={`w-9 h-9 text-sm font-bold transition-colors border ${n === page ? "bg-primary text-white border-primary" : "border-border text-muted-foreground hover:text-foreground hover:border-primary"}`} style={{ fontFamily: "var(--font-oswald), sans-serif" }}>
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
            <TrendingSection items={trending} />
            <AdPlaceholder className="h-64" />
            <Newsletter siteSettings={siteSettings} />
            <div>
              <SectionTitle href="/reviews">Reviews Recentes</SectionTitle>
              <div>
                {latestReviews.map((a) => <SmallNewsCard key={a.slug} article={a} />)}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
