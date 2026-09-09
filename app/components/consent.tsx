import Script from "next/script";

/**
 * Consentimento (CMP do Google) + Consent Mode v2.
 *
 * A CMP certificada IAB TCF v2.2 é a "Privacy & messaging" do AdSense / Ad
 * Manager (o RRM NÃO entrega isso — só os prompts de contribuição). A mensagem
 * de consentimento é criada no painel do AdSense e servida no site pela tag
 * Funding Choices (funciona mesmo antes da conta de anúncios ser aprovada).
 *
 * Envs (ver `.env.example`):
 *   NEXT_PUBLIC_GOOGLE_FUNDING_CHOICES_ID  — ex.: "pub-6647135959345144"
 *   NEXT_PUBLIC_ADSENSE_CLIENT             — a própria tag do AdSense também
 *                                            serve a mensagem depois de publicada
 */

const FUNDING_CHOICES_ID = process.env.NEXT_PUBLIC_GOOGLE_FUNDING_CHOICES_ID;
const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

// Há CMP se a tag do Funding Choices OU a do AdSense estiver presente para
// entregar a mensagem — só então faz sentido negar por padrão no EEE.
const HAS_CMP = Boolean(FUNDING_CHOICES_ID || ADSENSE_CLIENT);

// EEE (UE-27) + IS/LI/NO + Reino Unido + Suíça.
const RESTRICTED_REGIONS = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR",
  "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK",
  "SI", "ES", "SE", "IS", "LI", "NO", "GB", "CH",
];

/**
 * Consent Mode v2 — estado padrão, ANTES de GA/AdSense. Nega armazenamento de
 * anúncios/analytics para EEE + Reino Unido + Suíça até a CMP registrar a
 * escolha; "granted" no resto (tráfego do Brasil não perde medição).
 */
export function ConsentModeDefault() {
  if (!HAS_CMP) return null;

  return (
    <Script id="consent-mode-default" strategy="beforeInteractive">
      {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'granted',
  ad_user_data: 'granted',
  ad_personalization: 'granted',
  analytics_storage: 'granted'
});
gtag('consent', 'default', {
  region: ${JSON.stringify(RESTRICTED_REGIONS)},
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  wait_for_update: 500
});
gtag('set', 'ads_data_redaction', true);
gtag('set', 'url_passthrough', true);`}
    </Script>
  );
}

/**
 * Tag do Funding Choices — entrega a mensagem de consentimento configurada no
 * AdSense (Privacidade e mensagens). Independe do RRM.
 */
export function PrivacyMessaging() {
  if (!FUNDING_CHOICES_ID) return null;

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
