"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import "./styles/index.css";

/**
 * Só entra em ação se o ROOT layout (app/layout.tsx) falhar ao renderizar —
 * substitui a árvore inteira, então precisa dos próprios <html>/<body> e não
 * pode depender de Header/Footer, fontes carregadas via next/font, ou
 * qualquer dado do Prismic. Mantido deliberadamente simples/autocontido.
 */
export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const pathname = usePathname();
  const isEnUs = pathname === "/en-us" || !!pathname?.startsWith("/en-us/");

  useEffect(() => {
    console.error(error);
  }, [error]);

  const copy = isEnUs
    ? {
        lang: "en-US",
        eyebrow: "CRITICAL ERROR",
        heading: "The site hit a wall",
        body: "Something broke while loading the page shell itself. Try reloading — if it keeps happening, come back later.",
        retry: "Reload",
        digestLabel: "Reference code",
      }
    : {
        lang: "pt-BR",
        eyebrow: "ERRO CRÍTICO",
        heading: "O site bateu numa parede",
        body: "Algo quebrou ao carregar a estrutura da página. Tente recarregar — se continuar acontecendo, volte mais tarde.",
        retry: "Recarregar",
        digestLabel: "Código de referência",
      };

  return (
    <html lang={copy.lang}>
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0e0e11",
          color: "#f0f0f2",
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        <div style={{ maxWidth: 480, padding: "3rem 1.5rem", textAlign: "center" }}>
          <span
            style={{
              display: "inline-block",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.2em",
              color: "#8888a0",
              background: "#18181d",
              border: "1px solid rgba(255,255,255,0.09)",
              padding: "4px 10px",
              marginBottom: 24,
            }}
          >
            {copy.eyebrow}
          </span>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, lineHeight: 1.2, margin: "0 0 1rem" }}>
            {copy.heading}
          </h1>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: "#8888a0", margin: "0 0 2rem" }}>
            {copy.body}
          </p>
          <button
            onClick={() => unstable_retry()}
            style={{
              background: "#e8192c",
              color: "#ffffff",
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: "0.05em",
              border: "none",
              padding: "12px 28px",
              cursor: "pointer",
            }}
          >
            {copy.retry}
          </button>
          {error.digest && (
            <p style={{ marginTop: 32, fontSize: 11, color: "rgba(136,136,160,0.7)", fontFamily: "monospace" }}>
              {copy.digestLabel}: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
