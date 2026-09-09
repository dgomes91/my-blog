import type { Metadata, Viewport } from "next";
import { Oswald, JetBrains_Mono, Mulish } from "next/font/google";
import "./styles/index.css";
import { Footer, Header } from "./components";
import { ReaderRevenue } from "./components/reader-revenue";
import { getSiteSettings, getSiteSettingsData } from "./lib/queries";
import { JsonLd } from "./components/json-ld";
import {
  baseMetadata,
  jsonLdGraph,
  organizationLd,
  websiteLd,
} from "./lib/seo";
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
  const settings = getSiteSettingsData(await getSiteSettings());
  const base = baseMetadata();

  const title = settings?.seo_default_title?.trim();
  const description = settings?.seo_default_description?.trim();
  const ogImage = settings?.seo_default_image?.url ?? undefined;

  return {
    ...base,
    ...(title
      ? { title: { default: title, template: `%s · ${base.applicationName}` } }
      : {}),
    ...(description ? { description } : {}),
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
      title: settings?.site_name?.trim() || "Danilo Gomes",
      statusBarStyle: "black-translucent",
    },
    other: {
      "msapplication-TileColor": "#0e0e11",
      "msapplication-config": "/browserconfig.xml",
    },
    openGraph: {
      ...base.openGraph,
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    twitter: {
      ...base.twitter,
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteSettingsDoc = await getSiteSettings();
  const siteSettings = getSiteSettingsData(siteSettingsDoc);

  const sameAs = (siteSettings?.social_links ?? [])
    .map((s) => (s.url as { url?: string | null } | null)?.url)
    .filter((u): u is string => !!u && /^https?:\/\//.test(u));

  return (
    <html lang="pt-BR" className={FONT_VARS}>
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
        <ReaderRevenue />
        <Header siteSettings={siteSettings} />
        {children}
        {/* Script do Prismic otimizado pelo Next.js */}
        <Script
          src={`https://static.cdn.prismic.io/prismic.js?new=true&repo=${repositoryName}`}
          strategy="afterInteractive"
        />
        <Footer siteSettings={siteSettings} />
      </body>
    </html>
  );
}
