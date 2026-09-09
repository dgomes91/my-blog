"use client";

import { useEffect, useRef } from "react";

/**
 * Google AdSense. O loader (`adsbygoogle.js`) é injetado uma vez no
 * `app/layout.tsx` quando `NEXT_PUBLIC_ADSENSE_CLIENT` está definido.
 *
 * `<AdUnit>` renderiza um bloco de anúncio real quando há `NEXT_PUBLIC_ADSENSE_CLIENT`
 * + um `slot`; caso contrário cai no retângulo "PUBLICIDADE" de antes, para o
 * layout não quebrar em dev / preview sem AdSense configurado.
 *
 * Env: NEXT_PUBLIC_ADSENSE_CLIENT (ex.: "ca-pub-1234567890123456")
 * Os IDs de `slot` são criados no painel do AdSense por posição.
 */

export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export function AdUnit({
  slot,
  className = "",
  format = "auto",
  responsive = true,
}: {
  slot?: string;
  className?: string;
  format?: string;
  responsive?: boolean;
}) {
  const pushed = useRef(false);

  useEffect(() => {
    if (!ADSENSE_CLIENT || !slot || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      /* AdSense ainda carregando — o loader reprocessa <ins> pendentes */
    }
  }, [slot]);

  if (!ADSENSE_CLIENT || !slot) {
    return (
      <div
        className={`bg-secondary border border-dashed border-border flex items-center justify-center ${className}`}
      >
        <span
          className="text-xs text-muted-foreground tracking-widest"
          style={{ fontFamily: "var(--font-jetbrains), monospace" }}
        >
          PUBLICIDADE
        </span>
      </div>
    );
  }

  return (
    <ins
      className={`adsbygoogle block ${className}`}
      style={{ display: "block" }}
      data-ad-client={ADSENSE_CLIENT}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive ? "true" : "false"}
    />
  );
}
