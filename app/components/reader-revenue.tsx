"use client";

import Script from "next/script";

/**
 * Google Reader Revenue Manager (RRM) + consentimento (CMP do Google).
 *
 * O RRM é configurado no Publisher Center; no site basta carregar `swg-basic.js`
 * e inicializar. Com "Privacy messaging" ativado no Publisher Center, o mesmo
 * tag entrega a mensagem de consentimento (CMP certificada do Google) além dos
 * prompts de contribuição / newsletter.
 *
 * Como o site é de acesso livre, usamos o produto `:openaccess`.
 *
 * Env:
 *   NEXT_PUBLIC_RRM_PUBLICATION_ID   — ID da publicação no Publisher Center
 *                                      (ex.: "danilogomes.com.br" ou o ID gerado)
 *   NEXT_PUBLIC_GOOGLE_FUNDING_CHOICES_ID — opcional: usar a CMP standalone
 *                                      (Funding Choices) em vez da do RRM.
 *                                      Só carrega se o RRM não estiver configurado.
 */

const RRM_PUBLICATION_ID = process.env.NEXT_PUBLIC_RRM_PUBLICATION_ID;
const FUNDING_CHOICES_ID = process.env.NEXT_PUBLIC_GOOGLE_FUNDING_CHOICES_ID;

export function ReaderRevenue() {
  if (RRM_PUBLICATION_ID) {
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

  if (FUNDING_CHOICES_ID) {
    return (
      <>
        <Script
          src={`https://fundingchoicesmessages.google.com/i/${FUNDING_CHOICES_ID}?ers=1`}
          strategy="afterInteractive"
          async
        />
        <Script id="fc-present" strategy="afterInteractive">
          {`(function () {
  function signalGooglefcPresent() {
    if (!window.frames["googlefcPresent"]) {
      if (document.body) {
        var iframe = document.createElement("iframe");
        iframe.style = "width: 0; height: 0; border: none; z-index: -1000; left: -1000px; top: -1000px;";
        iframe.style.display = "none";
        iframe.name = "googlefcPresent";
        document.body.appendChild(iframe);
      } else {
        setTimeout(signalGooglefcPresent, 0);
      }
    }
  }
  signalGooglefcPresent();
})();`}
        </Script>
      </>
    );
  }

  return null;
}
