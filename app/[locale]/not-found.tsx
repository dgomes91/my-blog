import Link from "next/link";
import { headers } from "next/headers";
import { ChevronRight, Compass } from "lucide-react";
import { Header, Footer, OswaldText, TagBadge } from "@/app/components";
import { CATEGORY_PATH, localeFromPathname, t, withLocale } from "@/app/lib/i18n";

/**
 * `not-found.tsx` não recebe `params` (nem o `locale` do segmento). Usar
 * `usePathname()` (client) pra deduzir o locale força esse boundary inteiro a
 * ficar sem HTML server-renderizado (vira um shell vazio até o JS hidratar —
 * ruim pra SEO/crawlers e pro primeiro paint). Em vez disso, lemos o
 * `x-pathname` que `proxy.ts` já propaga em todo request (mesma técnica do
 * root layout pro `<html lang>`) — assim isto continua um Server Component
 * normal, totalmente renderizado no HTML inicial. `Header`/`Footer` (client)
 * seguem funcionando normalmente aninhados aqui, como em qualquer página.
 */
export default async function NotFound() {
  const pathname = (await headers()).get("x-pathname");
  const lang = localeFromPathname(pathname);
  const ui = t(lang);

  const links = [
    { label: ui.navNews, path: CATEGORY_PATH[lang].news },
    { label: "Reviews", path: CATEGORY_PATH[lang].reviews },
    { label: ui.topListsHeading, path: CATEGORY_PATH[lang].topLists },
    { label: ui.navAbout, path: withLocale(lang, "/about") },
  ];

  return (
    <>
      <Header />
      <main className="min-h-[70vh] flex items-center">
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-20 text-center">
          <TagBadge tag={ui.notFoundEyebrow} className="mb-6 inline-block" />

          <OswaldText
            as="p"
            className="text-[7rem] md:text-[10rem] font-bold leading-none text-primary tracking-tight mb-2"
          >
            404
          </OswaldText>

          <OswaldText as="h1" className="text-2xl md:text-4xl font-bold text-foreground leading-tight mb-4">
            {ui.notFoundHeading}
          </OswaldText>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-xl mx-auto mb-10">
            {ui.notFoundBody}
          </p>

          <Link
            href={withLocale(lang, "/")}
            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-red-700 text-white font-bold text-sm tracking-wider py-3 px-6 transition-colors"
            style={{ fontFamily: "var(--font-oswald), sans-serif" }}
          >
            {ui.notFoundCta} <ChevronRight className="w-4 h-4" />
          </Link>

          <div className="mt-14 pt-10 border-t border-border">
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-5 tracking-widest uppercase" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>
              <Compass className="w-3.5 h-3.5" />
              {ui.notFoundBrowseHeading}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {links.map((l) => (
                <Link
                  key={l.path}
                  href={l.path}
                  className="text-sm font-bold px-4 py-2 border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
                  style={{ fontFamily: "var(--font-oswald), sans-serif" }}
                >
                  {l.label.toUpperCase()}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
