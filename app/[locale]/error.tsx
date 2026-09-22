"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RotateCcw, TriangleAlert } from "lucide-react";
import { Header, Footer, OswaldText, TagBadge } from "@/app/components";
import { localeFromPathname, t, withLocale } from "@/app/lib/i18n";

/**
 * Error boundary de `app/[locale]/...`. Como `not-found.tsx`, também não
 * recebe `params` — o locale vem do pathname. Nesta versão do Next.js o
 * callback de recuperação do boundary chama-se `unstable_retry` (não
 * `reset`, como em versões anteriores).
 */
export default function LocaleError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const pathname = usePathname();
  const lang = localeFromPathname(pathname);
  const ui = t(lang);

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <Header />
      <main className="min-h-[70vh] flex items-center">
        <div className="max-w-lg mx-auto px-4 md:px-8 py-20 text-center">
          <TagBadge tag={ui.errorEyebrow} className="mb-6 inline-block" />

          <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-6">
            <TriangleAlert className="w-6 h-6 text-primary" />
          </div>

          <OswaldText as="h1" className="text-2xl md:text-3xl font-bold text-foreground leading-tight mb-4">
            {ui.errorHeading}
          </OswaldText>
          <p className="text-muted-foreground text-sm leading-relaxed mb-8">{ui.errorBody}</p>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={() => unstable_retry()}
              className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-red-700 text-white font-bold text-sm tracking-wider py-3 px-6 transition-colors"
              style={{ fontFamily: "var(--font-oswald), sans-serif" }}
            >
              <RotateCcw className="w-4 h-4" /> {ui.errorRetry}
            </button>
            <Link
              href={withLocale(lang, "/")}
              className="inline-flex items-center justify-center gap-2 border border-border text-muted-foreground hover:text-foreground hover:border-primary font-bold text-sm tracking-wider py-3 px-6 transition-colors"
              style={{ fontFamily: "var(--font-oswald), sans-serif" }}
            >
              {ui.errorHome}
            </Link>
          </div>

          {error.digest && (
            <p className="mt-10 text-xs text-muted-foreground/70" style={{ fontFamily: "var(--font-jetbrains), monospace" }}>
              {ui.errorDigestLabel}: {error.digest}
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
