import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Oswald, JetBrains_Mono, Mulish } from "next/font/google";
import "./styles/index.css";
import { ReaderRevenue } from "./components/reader-revenue";
import { ConsentModeDefault, PrivacyMessaging } from "./components/consent";
import { getSiteSettings, getSiteSettingsData } from "./lib/queries";
import { JsonLd } from "./components/json-ld";
import {
  baseMetadata,
  jsonLdGraph,
  organizationLd,
  websiteLd,
} from "./lib/seo";
import { HTML_LANG, localeFromPathname } from "./lib/i18n";
import { ADSENSE_CLIENT } from "./components/ads";
import { repositoryName } from "@/prismicio";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";

const GA_ID = process.env.GOOGLE_ANALYTICS_ID;
const GOOGLE_SITE_VERIFICATION = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
const BING_SITE_VERIFICATION = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION;

// Fontes do design, carregadas e auto-hospedadas pelo Next (sem FOUT, sem
// request a fonts.google no cliente). Expostas como variáveis CSS —
// tailwind.css mapeia --font-sans/--font-mono/--font-display para elas.
const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-oswald",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-jetbrains",
});
const mulish = Mulish({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-mulish",
});
const FONT_VARS = `${oswald.variable} ${jetbrainsMono.variable} ${mulish.variable}`;

// Conjunto de favicons gerado pelo design, servido de /public.
const ICONS: Metadata["icons"] = {
  icon: [
    { url: "/favicon.ico", sizes: "any" },
    { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
    { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
    { url: "/android-icon-192x192.png", type: "image/png", sizes: "192x192" },
  ],
  apple: [
    { url: "/apple-icon-57x57.png", sizes: "57x57" },
    { url: "/apple-icon-60x60.png", sizes: "60x60" },
    { url: "/apple-icon-72x72.png", sizes: "72x72" },
    { url: "/apple-icon-76x76.png", sizes: "76x76" },
    { url: "/apple-icon-114x114.png", sizes: "114x114" },
    { url: "/apple-icon-120x120.png", sizes: "120x120" },
    { url: "/apple-icon-144x144.png", sizes: "144x144" },
    { url: "/apple-icon-152x152.png", sizes: "152x152" },
    { url: "/apple-icon-180x180.png", sizes: "180x180" },
  ],
};

export const viewport: Viewport = {
  themeColor: "#0e0e11",
};

export async function generateMetadata(): Promise<Metadata> {
  const base = baseMetadata();

  return {
    ...base,
    ...(GOOGLE_SITE_VERIFICATION || BING_SITE_VERIFICATION
      ? {
          verification: {
            ...(GOOGLE_SITE_VERIFICATION ? { google: GOOGLE_SITE_VERIFICATION } : {}),
            ...(BING_SITE_VERIFICATION
              ? { other: { "msvalidate.01": BING_SITE_VERIFICATION } }
              : {}),
          },
        }
      : {}),
    icons: ICONS,
    manifest: "/manifest.json",
    appleWebApp: {
      capable: true,
      title: "Danilo Gomes",
      statusBarStyle: "black-translucent",
    },
    other: {
      "msapplication-TileColor": "#0e0e11",
      "msapplication-config": "/browserconfig.xml",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // O layout de `[locale]` fica abaixo deste (root) e não repassa `params`
  // pra cá — usamos o pathname propagado pelo proxy (`x-pathname`) só pra
  // decidir o `<html lang>` correto em cada request.
  const pathname = (await headers()).get("x-pathname") ?? "";
  const lang = localeFromPathname(pathname);

  const siteSettingsDoc = await getSiteSettings();
  const siteSettings = getSiteSettingsData(siteSettingsDoc);

  const sameAs = (siteSettings?.social_links ?? [])
    .map((s) => (s.url as { url?: string | null } | null)?.url)
    .filter((u): u is string => !!u && /^https?:\/\//.test(u));

  return (
    <html lang={HTML_LANG[lang]} className={FONT_VARS}>
      {/* Consent Mode v2 default — precisa vir antes de GA/AdSense */}
      <ConsentModeDefault />
      <Analytics />
      {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
      {ADSENSE_CLIENT && (
        <Script
          id="adsbygoogle-init"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      )}
      <body className="min-h-screen bg-background text-foreground font-sans antialiased">
        <JsonLd json={jsonLdGraph(organizationLd, websiteLd(sameAs))} />
        <PrivacyMessaging />
        <ReaderRevenue />
        {children}
        {/* Script do Prismic otimizado pelo Next.js */}
        <Script
          src={`https://static.cdn.prismic.io/prismic.js?new=true&repo=${repositoryName}`}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
