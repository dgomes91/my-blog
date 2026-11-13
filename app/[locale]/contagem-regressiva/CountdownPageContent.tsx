import Link from "next/link";
import { BigCountdown, OswaldText, SectionTitle, SmallNewsCard } from "@/app/components";
import { adaptArticles } from "@/app/lib/article-adapter";
import { getAllArticles } from "@/app/lib/queries";
import {
  absoluteUrl,
  breadcrumbLd,
  jsonLdGraph,
  organizationLd,
  pageMetadata,
} from "@/app/lib/seo";
import { JsonLd } from "@/app/components/json-ld";
import { CATEGORY_PATH, HTML_LANG, t, withLocale, type Locale } from "@/app/lib/i18n";

/**
 * Conteúdo (server) compartilhado pela página fixa de contagem regressiva do
 * lançamento de GTA 6, nas duas rotas por locale:
 * `/contagem-regressiva` (pt-br) e `/en-us/countdown`.
 *
 * NÃO é um artigo do blog (não vem do Prismic) — é uma página fixa do app,
 * com fundo nas cores da marca de GTA 6, o contador bem grande centralizado,
 * e a lista dos 10 artigos mais recentes do blog abaixo.
 */
export function countdownPageMetadata(path: string, lang: Locale) {
  const ui = t(lang);
  return pageMetadata({
    title: `${ui.countdownPageEyebrow} — GTA 6`,
    description: ui.countdownPageSubtitle,
    path,
    lang,
    translations: { "pt-br": "/contagem-regressiva", "en-us": "/en-us/countdown" },
  });
}

export default async function CountdownPageContent({
  lang,
  path,
}: {
  lang: Locale;
  path: string;
}) {
  const ui = t(lang);
  const allArticles = await getAllArticles({ limit: 10, lang });
  const latest = adaptArticles(allArticles.slice(0, 10), lang);

  const jsonLd = jsonLdGraph(
    organizationLd,
    {
      "@type": "WebPage",
      "@id": `${absoluteUrl(path)}#webpage`,
      url: absoluteUrl(path),
      name: `${ui.countdownPageEyebrow} — GTA 6`,
      description: ui.countdownPageSubtitle,
      inLanguage: HTML_LANG[lang],
      isPartOf: { "@id": `${absoluteUrl("/")}#website` },
    },
    breadcrumbLd([
      { name: ui.navHome, path: withLocale(lang, "/") },
      { name: ui.countdownPageEyebrow, path },
    ]),
  );

  return (
    <main>
      <JsonLd json={jsonLd} />

      {/* Hero com fundo nas cores de GTA 6 (rosa/laranja de pôr-do-sol de Vice City
          sobre preto) + o contador bem grande, centralizado horizontalmente. */}
      <section
        className="relative overflow-hidden flex flex-col items-center justify-center text-center px-4 py-20 md:py-28"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 0%, rgba(232,25,44,0.35), transparent 60%), linear-gradient(135deg, #1a0a12 0%, #1a0022 35%, #06060a 70%, #000000 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-20 mix-blend-screen pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(120deg, #ff3cac 0%, #e8192c 35%, #784ba0 65%, #2b86c5 100%)",
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span
              className="text-xs font-bold tracking-[0.25em] text-white/80 uppercase"
              style={{ fontFamily: "var(--font-jetbrains), monospace" }}
            >
              {ui.countdownPageEyebrow}
            </span>
          </div>

          <OswaldText as="h1" className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
            {ui.countdownPageTitle} <span className="text-primary">GTA 6</span>
          </OswaldText>

          <p className="text-sm md:text-base text-gray-300 leading-relaxed max-w-2xl mx-auto mb-10">
            {ui.countdownPageSubtitle}
          </p>

          <BigCountdown className="mx-auto max-w-2xl" />
        </div>
      </section>

      {/* Últimos artigos do blog */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <SectionTitle href={CATEGORY_PATH[lang].news}>{ui.countdownPageLatestHeading}</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          {latest.map((a) => (
            <SmallNewsCard key={a.slug} article={a} />
          ))}
        </div>
        {latest.length === 0 && (
          <p className="text-sm text-muted-foreground">{ui.noArticlesBody}</p>
        )}
        <div className="mt-8 text-center">
          <Link
            href={withLocale(lang, "/")}
            className="inline-flex items-center gap-2 border border-border text-muted-foreground hover:text-foreground hover:border-primary py-2.5 px-5 text-sm font-bold tracking-wide transition-colors"
            style={{ fontFamily: "var(--font-oswald), sans-serif" }}
          >
            {ui.navHome}
          </Link>
        </div>
      </div>
    </main>
  );
}
