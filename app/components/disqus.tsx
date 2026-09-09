"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

/**
 * Comentários via Disqus. Substitui o placeholder "—" que aparecia ao lado do
 * ícone de mensagem nos artigos.
 *
 * Env: NEXT_PUBLIC_DISQUS_SHORTNAME (ver `.env.example`).
 *
 * Observação: o Disqus não expõe contagem de *visualizações* de página — só de
 * comentários. O ícone de "views" (olho) segue sem número por isso; contagem de
 * views real deve vir do Google Analytics, fora do escopo deste componente.
 */

const SHORTNAME = process.env.NEXT_PUBLIC_DISQUS_SHORTNAME;

declare global {
  interface Window {
    DISQUS?: {
      reset: (opts: {
        reload: boolean;
        config: (this: {
          page: { identifier: string; url: string; title?: string };
        }) => void;
      }) => void;
    };
    disqus_config?: () => void;
  }
}

export function DisqusComments({
  identifier,
  title,
  url,
}: {
  identifier: string;
  title?: string;
  url: string;
}) {
  const loaded = useRef(false);

  useEffect(() => {
    if (!SHORTNAME) return;

    const config = function (this: {
      page: { identifier: string; url: string; title?: string };
    }) {
      this.page.identifier = identifier;
      this.page.url = url;
      this.page.title = title;
    };

    if (loaded.current && window.DISQUS) {
      window.DISQUS.reset({ reload: true, config });
      return;
    }

    window.disqus_config = config as unknown as () => void;

    const script = document.createElement("script");
    script.src = `https://${SHORTNAME}.disqus.com/embed.js`;
    script.setAttribute("data-timestamp", String(Date.now()));
    script.async = true;
    document.body.appendChild(script);
    loaded.current = true;
  }, [identifier, title, url]);

  if (!SHORTNAME) return null;

  return (
    <section className="max-w-3xl mx-auto px-4 pb-16">
      <p
        className="text-xs text-muted-foreground mb-4"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        Ao comentar, você concorda com a{" "}
        <Link href="/politica-de-comentarios" className="text-primary hover:text-white underline">
          Política de Comentários
        </Link>
        .
      </p>
      <div id="disqus_thread" />
    </section>
  );
}

/**
 * Contagem de comentários. Renderiza `href="…#disqus_thread"` com a classe
 * `disqus-comment-count`; o count.js do Disqus preenche o texto.
 */
export function DisqusCommentCount({
  identifier,
  url,
  className,
}: {
  identifier: string;
  url: string;
  className?: string;
}) {
  useEffect(() => {
    if (!SHORTNAME) return;
    const existing = document.getElementById("dsq-count-scr");
    if (existing) {
      // Reprocessa contagens após navegação client-side.
      (
        window as unknown as {
          DISQUSWIDGETS?: { getCount?: (o: { reset: boolean }) => void };
        }
      ).DISQUSWIDGETS?.getCount?.({ reset: true });
      return;
    }
    const s = document.createElement("script");
    s.id = "dsq-count-scr";
    s.src = `https://${SHORTNAME}.disqus.com/count.js`;
    s.async = true;
    document.body.appendChild(s);
  }, []);

  if (!SHORTNAME) return null;

  return (
    <a href={`${url}#disqus_thread`} className={`disqus-comment-count ${className ?? ""}`} data-disqus-identifier={identifier}>
      —
    </a>
  );
}
