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

      {/* Céu de Vice City (noite violeta + brilho do pôr-do-sol no horizonte) e o
          contador como frase: "Faltam" → dígitos → "para o lançamento…". */}
      <section className="countdown-sky relative overflow-hidden border-b border-white/10 px-4 pt-14 pb-16 md:pt-20 md:pb-24 text-center">
        <h1
          className="mb-10 md:mb-14 text-[11px] sm:text-xs font-bold leading-none tracking-[0.3em] text-white/60 uppercase"
          style={{ fontFamily: "var(--font-jetbrains), monospace" }}
        >
          {ui.countdownPageHeading}
        </h1>

        <OswaldText as="p" className="mb-3 md:mb-4 text-xl md:text-3xl font-medium leading-none tracking-wide text-white uppercase">
          {ui.countdownLead}
        </OswaldText>

        <BigCountdown />

        <OswaldText as="p" className="mt-8 md:mt-10 text-xl md:text-3xl font-medium leading-tight tracking-wide text-white uppercase">
          {ui.countdownTail}
        </OswaldText>

        <p
          className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-x-4 gap-y-2 text-[11px] sm:text-xs tracking-[0.18em] text-white/70 uppercase"
          style={{ fontFamily: "var(--font-jetbrains), monospace" }}
        >
          <span>{ui.countdownMetaDate}</span>
          <span aria-hidden="true" className="hidden sm:block h-3 w-px bg-white/30" />
          <span>{ui.countdownMetaTime}</span>
        </p>
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
