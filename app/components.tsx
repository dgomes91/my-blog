'use client'
import Image from "next/image";
import { useActionState, useState } from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { Search, Menu, X, ChevronRight, Clock, Eye, MessageSquare, TrendingUp } from "lucide-react";
import type { Article } from "./lib/article-adapter";
import type { SiteSettingsData } from "./lib/queries";
import { subscribeToNewsletter } from "./lib/newsletter";
import { AdUnit } from "./components/ads";

type NewsletterState = { status: "idle" | "success" | "error"; message?: string };

// Fallbacks usados só enquanto `site_settings.primary_nav` / `footer_nav` não
// estão populados no Prismic (ver scripts/prismic-model-setup.sh). São rotas
// reais do app, não dados mockados.
const DEFAULT_NAV = [
  { label: "Notícias", path: "/noticias" },
  { label: "Reviews", path: "/reviews" },
  { label: "Listas TOP", path: "/top-lista" },
];

const DEFAULT_FOOTER_COLUMNS = [
  {
    title: "Conteúdo",
    links: [
      { label: "Notícias", path: "/noticias" },
      { label: "Reviews", path: "/reviews" },
      { label: "Listas TOP", path: "/top-lista" },
    ],
  },
  {
    title: "Institucional",
    links: [
      { label: "Sobre", path: "/about" },
      { label: "Anuncie", path: "/anuncie" },
    ],
  },
];

type NavLink = { label: string; path: string };

function resolveLink(link: unknown): string {
  if (!link || typeof link !== "object") return "#";
  const url = (link as { url?: string | null }).url;
  return url && url.length > 0 ? url : "#";
}

function navFromSettings(
  items: { label?: string | null; link?: unknown }[] | undefined,
): NavLink[] | null {
  if (!items || items.length === 0) return null;
  const mapped = items
    .filter((i) => i.label && i.label.trim())
    .map((i) => ({ label: i.label!.trim(), path: resolveLink(i.link) }));
  return mapped.length > 0 ? mapped : null;
}

// ─── Typography helpers ────────────────────────────────────────────────────

export function OswaldText({
  children,
  className = "",
  as: Tag = "span",
}: {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}) {
  return (
    <Tag className={className} style={{ fontFamily: "var(--font-oswald), sans-serif" }}>
      {children}
    </Tag>
  );
}

// ─── Score badge ───────────────────────────────────────────────────────────

export function ScoreBadge({ score, size = "md" }: { score: number; size?: "sm" | "md" | "lg" }) {
  const color =
    score >= 9
      ? "bg-emerald-500"
      : score >= 8
      ? "bg-yellow-500"
      : score >= 7
      ? "bg-orange-500"
      : "bg-red-600";
  const dim =
    size === "lg" ? "w-16 h-16 text-2xl" : size === "sm" ? "w-10 h-10 text-sm" : "w-12 h-12 text-lg";
  return (
    <div
      className={`${color} text-white font-bold flex items-center justify-center shrink-0 ${dim}`}
      style={{ fontFamily: "var(--font-oswald), sans-serif" }}
    >
      {score.toFixed(1)}
    </div>
  );
}

// ─── Tag badge ─────────────────────────────────────────────────────────────

export function TagBadge({ tag, className = "" }: { tag: string; className?: string }) {
  const isReview = tag === "ANÁLISE" || tag === "REVIEW";
  const isPreview = tag === "PRÉVIA";
  const isTop = tag.startsWith("TOP") || tag === "LISTA";
  return (
    <span
      className={`inline-block text-[10px] tracking-widest font-bold px-2 py-0.5 ${
        isReview
          ? "bg-primary text-white"
          : isPreview
          ? "bg-yellow-500 text-black"
          : isTop
          ? "bg-violet-600 text-white"
          : "bg-secondary text-muted-foreground"
      } ${className}`}
      style={{ fontFamily: "var(--font-jetbrains), monospace" }}
    >
      {tag}
    </span>
  );
}

// ─── Section title ─────────────────────────────────────────────────────────

export function SectionTitle({
  children,
  href,
}: {
  children: React.ReactNode;
  href?: string;
}) {
  return (
    <div className="flex items-center justify-between mb-5">
      <OswaldText
        as="h2"
        className="text-xl font-bold text-foreground tracking-wide uppercase border-l-4 border-primary pl-3"
      >
        {children}
      </OswaldText>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-1 text-xs text-primary hover:text-white transition-colors font-semibold tracking-wide"
        >
          Ver Tudo <ChevronRight className="w-3 h-3" />
        </Link>
      )}
    </div>
  );
}

// ─── News card ─────────────────────────────────────────────────────────────

export function NewsCard({ article }: { article: Article }) {
  const tag =
    article.category === "reviews"
      ? "ANÁLISE"
      : article.category === "listas-top"
      ? "LISTA"
      : "NOTÍCIA";
  return (
    <article className="group cursor-pointer">
      <div className="relative overflow-hidden bg-secondary aspect-video mb-3">
        <Image
          src={article.coverImageUrl}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-2 left-2">
          <TagBadge tag={tag} />
        </div>
        {article.reviewScore !== undefined && (
          <div className="absolute top-2 right-2">
            <ScoreBadge score={article.reviewScore} size="sm" />
          </div>
        )}
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-1.5 tracking-wide" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>
          {article.tags[0]?.toUpperCase()}
        </p>
        <OswaldText
          as="h3"
          className="text-lg font-bold text-foreground leading-snug group-hover:text-primary transition-colors mb-2"
        >
          {article.title}
        </OswaldText>
        <div className="flex items-center gap-3 text-xs text-muted-foreground" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>
          <span className="text-primary font-semibold">{article.author}</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> {article.readingMinutes} min
          </span>
          <span className="flex items-center gap-1 ml-auto">
            <Eye className="w-3 h-3" /> —
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3" /> —
          </span>
        </div>
      </div>
    </article>
  );
}

// ─── Review card ───────────────────────────────────────────────────────────

export function ReviewCard({ article }: { article: Article & { platforms?: string[] } }) {
  const score = article.reviewScore ?? 0;
  const verdict =
    score >= 9.5
      ? "OBRA-PRIMA"
      : score >= 9
      ? "ACLAMADO"
      : score >= 8
      ? "EXCELENTE"
      : score >= 7
      ? "BOM"
      : "MEDIANO";
  return (
    <article className="group cursor-pointer bg-card border border-border overflow-hidden hover:border-primary/40 transition-colors">
      <div className="relative overflow-hidden bg-secondary aspect-[5/3]">
        <Image
          src={article.coverImageUrl}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <ScoreBadge score={score} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-card to-transparent" />
      </div>
      <div className="p-4">
        <p className="text-xs text-muted-foreground mb-1" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>
          {article.platforms && article.platforms.length > 0
            ? article.platforms.join(" / ")
            : `PC ${article.tags.includes("xbox") ? "/ Xbox" : ""}`}
        </p>
        <OswaldText
          as="h3"
          className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors"
        >
          {article.title}
        </OswaldText>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-2">{article.excerpt}</p>
        <div className="flex items-center justify-between border-t border-border pt-3">
          <div className="flex items-center gap-2">
            <ScoreBadge score={score} size="sm" />
            <OswaldText as="span" className="text-xs font-bold text-foreground">{verdict}</OswaldText>
          </div>
          <div className="text-xs text-muted-foreground" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>
            {article.author} · {article.publishedAt}
          </div>
        </div>
      </div>
    </article>
  );
}

// ─── Small news card ───────────────────────────────────────────────────────

export function SmallNewsCard({ article }: { article: Article }) {
  const tag =
    article.category === "reviews"
      ? "ANÁLISE"
      : article.category === "listas-top"
      ? "LISTA"
      : "NOTÍCIA";
  return (
    <article className="flex gap-3 group cursor-pointer py-3 border-b border-border last:border-0">
      <div className="relative w-24 h-16 shrink-0 overflow-hidden bg-secondary">
        <Image
          src={article.coverImageUrl}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <TagBadge tag={tag} />
        </div>
        <OswaldText
          as="h3"
          className="text-sm font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2"
        >
          {article.title}
        </OswaldText>
        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>
          <span className="text-primary font-semibold">{article.author}</span>
          <span>·</span>
          <span>{article.publishedAt}</span>
        </div>
      </div>
    </article>
  );
}

// ─── Trending section ──────────────────────────────────────────────────────

export function TrendingSection({
  items,
}: {
  items?: { id: number | string; rank: number; title: string; views: string }[];
} = {}) {
  const list = items ?? [];
  if (list.length === 0) return null;
  return (
    <aside>
      <SectionTitle>Em Alta</SectionTitle>
      <ol className="space-y-0 divide-y divide-border">
        {list.map((item) => (
          <li key={item.id} className="flex items-start gap-4 py-3.5 group cursor-pointer">
            <OswaldText as="span" className="text-3xl font-bold text-muted/50 leading-none w-7 shrink-0 mt-0.5">
              {item.rank}
            </OswaldText>
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-bold text-foreground leading-snug group-hover:text-primary transition-colors"
                style={{ fontFamily: "var(--font-oswald), sans-serif" }}
              >
                {item.title}
              </p>
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>
                <TrendingUp className="w-3 h-3" />
                <span>{item.views} views</span>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </aside>
  );
}

// ─── Newsletter ────────────────────────────────────────────────────────────

export function Newsletter({
  siteSettings,
}: {
  siteSettings?: {
    newsletter_heading?: string | null;
    newsletter_subtext?: string | null;
    newsletter_button_label?: string | null;
  } | null;
} = {}) {
  const heading = siteSettings?.newsletter_heading || "Newsletter GTA 6";
  const subtext =
    siteSettings?.newsletter_subtext ||
    "Toda semana, o que há de novo sobre GTA 6 no seu e-mail: trailers, rumores confirmados e contagem regressiva.";
  const buttonLabel = siteSettings?.newsletter_button_label || "INSCREVER-SE";

  const initial: NewsletterState = { status: "idle" };
  const [state, formAction, pending] = useActionState(subscribeToNewsletter, initial);

  return (
    <div className="bg-card border border-border p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1 h-6 bg-primary" />
        <OswaldText as="h3" className="text-base font-bold uppercase tracking-wide">
          {heading}
        </OswaldText>
      </div>
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
        {subtext}
      </p>
      {state.status === "success" ? (
        <p className="text-primary font-semibold text-sm">
          {state.message || "Inscrito com sucesso!"}
        </p>
      ) : (
        <form action={formAction} className="flex flex-col gap-2">
          <input
            type="email"
            name="email"
            required
            placeholder="seu@email.com"
            className="bg-secondary border border-border text-foreground text-sm px-3 py-2 outline-none focus:border-primary transition-colors placeholder:text-muted-foreground w-full"
            style={{ fontFamily: "var(--font-mulish), sans-serif" }}
          />
          <button
            type="submit"
            disabled={pending}
            className="bg-primary hover:bg-red-700 text-white font-bold text-sm tracking-wider py-2 px-4 transition-colors disabled:opacity-60"
            style={{ fontFamily: "var(--font-oswald), sans-serif" }}
          >
            {pending ? "ENVIANDO…" : buttonLabel}
          </button>
          {state.status === "error" && state.message && (
            <p className="text-red-500 text-xs">{state.message}</p>
          )}
        </form>
      )}
    </div>
  );
}

// ─── Ad placeholder ────────────────────────────────────────────────────────

/**
 * Bloco de anúncio. Com `NEXT_PUBLIC_ADSENSE_CLIENT` + `slot` definidos,
 * renderiza uma unidade AdSense real; sem isso, o retângulo "PUBLICIDADE".
 * Os IDs de `slot` saem do painel do AdSense por posição.
 */
export function AdPlaceholder({
  className = "",
  slot,
}: {
  className?: string;
  slot?: string;
}) {
  return <AdUnit slot={slot} className={className} />;
}

// ─── Header ────────────────────────────────────────────────────────────────

export function Header({
  siteSettings,
}: {
  siteSettings?: SiteSettingsData | null;
} = {}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const siteName = siteSettings?.site_name;
  const [brandFirst, ...brandRestArr] = siteName ? siteName.split(" ") : ["DANILO", "GOMES"];
  const brandRest = brandRestArr.join(" ") || (siteName ? "" : "GOMES");

  const nav = navFromSettings(siteSettings?.primary_nav) ?? DEFAULT_NAV;

  const hoje = new Date();
  // Configura o formato com dia da semana longo e data longa
  const opcoes: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
  };
  // Formata a data e isola o resultado
  let dataFormatada = hoje.toLocaleDateString('pt-BR', opcoes);
  // Capitaliza a primeira letra do dia da semana (ex: "terça-feira" vira "Terça-feira")
  dataFormatada = dataFormatada.charAt(0).toUpperCase() + dataFormatada.slice(1);

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="bg-[#0a0a0d] border-b border-border px-4 md:px-8 py-1.5 flex items-center justify-between text-xs text-muted-foreground" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>
        <span id='data-atual'>{dataFormatada}</span>
      </div>

      <div className="px-4 md:px-8 h-14 flex items-center gap-6">
        <Link href="/" className="shrink-0">
          <div className="flex items-center gap-0.5" style={{ fontFamily: "var(--font-oswald), sans-serif" }}>
            <span className="text-2xl font-bold text-white tracking-tight">{brandFirst}</span>
            <span className="text-2xl font-bold text-primary tracking-tight">{brandRest}</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1 flex-1">
          {nav.map((cat) => {
            const active = pathname.startsWith(cat.path);
            return (
              <Link
                key={cat.label}
                href={cat.path}
                className={`text-sm font-bold px-3 py-1.5 tracking-wide transition-colors ${
                  active
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                style={{ fontFamily: "var(--font-oswald), sans-serif" }}
              >
                {cat.label.toUpperCase()}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 ml-auto md:ml-0">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="px-4 md:px-8 pb-3">
          <input
            autoFocus
            type="text"
            placeholder="Pesquisar jogos, análises, guias..."
            className="w-full bg-secondary border border-border text-foreground text-sm px-4 py-2.5 outline-none focus:border-primary transition-colors placeholder:text-muted-foreground"
            style={{ fontFamily: "var(--font-mulish), sans-serif" }}
          />
        </div>
      )}

      {menuOpen && (
        <nav className="md:hidden border-t border-border px-4 py-3 flex flex-col gap-1 bg-card">
          {nav.map((cat) => (
            <Link
              key={cat.label}
              href={cat.path}
              onClick={() => setMenuOpen(false)}
              className={`text-sm font-bold px-2 py-2 tracking-wider transition-colors ${
                pathname.startsWith(cat.path) ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
              style={{ fontFamily: "var(--font-oswald), sans-serif" }}
            >
              {cat.label.toUpperCase()}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────

const FOOTER_COLUMN_ORDER = ["Conteúdo", "Jogos", "Institucional", "Legal"];

function footerColumnsFromSettings(
  items: SiteSettingsData["footer_nav"] | undefined,
): { title: string; links: NavLink[] }[] | null {
  if (!items || items.length === 0) return null;
  const byColumn = new Map<string, NavLink[]>();
  for (const i of items) {
    if (!i.label || !i.label.trim()) continue;
    const col = i.column?.trim() || "Conteúdo";
    const arr = byColumn.get(col) ?? [];
    arr.push({ label: i.label.trim(), path: resolveLink(i.link) });
    byColumn.set(col, arr);
  }
  if (byColumn.size === 0) return null;
  const ordered = [...byColumn.keys()].sort(
    (a, b) =>
      (FOOTER_COLUMN_ORDER.indexOf(a) + 1 || 99) -
      (FOOTER_COLUMN_ORDER.indexOf(b) + 1 || 99),
  );
  return ordered.map((title) => ({ title, links: byColumn.get(title)! }));
}

const DEFAULT_LEGAL_LINKS: NavLink[] = [
  { label: "Privacidade", path: "/politica-de-privacidade" },
  { label: "Termos", path: "/termos-de-uso" },
  { label: "Cookies", path: "/politica-de-cookies" },
  { label: "Comentários", path: "/politica-de-comentarios" },
];

export function Footer({
  siteSettings,
}: {
  siteSettings?: SiteSettingsData | null;
} = {}) {
  const siteName = siteSettings?.site_name;
  const [brandFirst, ...brandRestArr] = siteName ? siteName.split(" ") : ["DANILO", "GOMES"];
  const brandRest = brandRestArr.join(" ") || (siteName ? "" : "GOMES");
  const tagline =
    siteSettings?.tagline?.trim() ||
    "Cobertura dedicada a Grand Theft Auto VI — notícias, trailers, teorias e guias.";

  const allColumns = footerColumnsFromSettings(siteSettings?.footer_nav) ?? DEFAULT_FOOTER_COLUMNS;
  const legal = allColumns.find((c) => c.title === "Legal")?.links ?? DEFAULT_LEGAL_LINKS;
  const columns = allColumns.filter((c) => c.title !== "Legal");

  const social = (siteSettings?.social_links ?? [])
    .map((s) => ({ platform: s.platform?.trim(), url: resolveLink(s.url) }))
    .filter((s): s is { platform: string; url: string } => !!s.platform && s.url !== "#");

  return (
    <footer className="bg-[#0a0a0d] border-t border-border mt-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-0.5 mb-4" style={{ fontFamily: "var(--font-oswald), sans-serif" }}>
              <span className="text-xl font-bold text-white">{brandFirst}</span>
              <span className="text-xl font-bold text-primary">{brandRest}</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{tagline}</p>
            {social.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-4">
                {social.map((s) => (
                  <a
                    key={s.platform}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    style={{ fontFamily: "var(--font-jetbrains), monospace" }}
                  >
                    {s.platform}
                  </a>
                ))}
              </div>
            )}
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <OswaldText as="h4" className="text-sm font-bold tracking-wider text-foreground mb-3 uppercase">
                {col.title}
              </OswaldText>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.path} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>
          <p>© {new Date().getFullYear()} {siteName || "Danilo Gomes"}. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            {legal.map((l) => (
              <Link key={l.label} href={l.path} className="hover:text-foreground transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
