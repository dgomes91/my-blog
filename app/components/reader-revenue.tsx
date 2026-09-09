"use client";

import Script from "next/script";

/**
 * Google Reader Revenue Manager (RRM) — prompts de contribuição / newsletter.
 *
 * O RRM é configurado no Publisher Center; no site basta carregar `swg-basic.js`
 * e inicializar. NÃO entrega a mensagem de consentimento (CMP) — essa vem da
 * "Privacy & messaging" do AdSense, carregada por `<PrivacyMessaging>` em
 * `app/components/consent.tsx`.
 *
 * Como o site é de acesso livre, usamos o produto `:openaccess`.
 *
 * Env: NEXT_PUBLIC_RRM_PUBLICATION_ID — ID da publicação no Publisher Center.
 */

const RRM_PUBLICATION_ID = process.env.NEXT_PUBLIC_RRM_PUBLICATION_ID;

export function ReaderRevenue() {
  if (!RRM_PUBLICATION_ID) return null;

  return (
    <>
      <Script id="rrm-init" strategy="afterInteractive">
        {`(self.SWG_BASIC = self.SWG_BASIC || []).push(function (basicSubscriptions) {
  basicSubscriptions.init({
    type: "NewsArticle",
    isPartOfType: ["Product"],
    isPartOfProductId: "${RRM_PUBLICATION_ID}:openaccess",
    autoPromptType: "contribution",
    clientOptions: { theme: "dark", lang: "pt-BR" },
  });
});`}
      </Script>
      <Script
        src="https://news.google.com/swg/js/v1/swg-basic.js"
        strategy="afterInteractive"
        async
      />
    </>
  );
}
