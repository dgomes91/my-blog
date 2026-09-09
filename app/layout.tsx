import type { Metadata, Viewport } from "next";
import "./styles/index.css";
import { Footer, Header } from "./components";
import { getSiteSettings, getSiteSettingsData } from "./lib/queries";
import { repositoryName } from "@/prismicio";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
const GA_ID = process.env.GOOGLE_ANALYTICS_ID;

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
  const siteName = settings?.site_name?.trim() || "Danilo Gomes";
  const title = settings?.seo_default_title?.trim() || `${siteName} — Central de GTA 6`;
  const description =
    settings?.seo_default_description?.trim() ||
    "Cobertura dedicada a Grand Theft Auto VI: notícias, trailers, mapa de Leonida, Jason e Lucia, data de lançamento e guias.";
  const ogImage = settings?.seo_default_image?.url ?? undefined;

  return {
    title: { default: title, template: `%s · ${siteName}` },
    description,
    icons: ICONS,
    manifest: "/manifest.json",
    appleWebApp: { capable: true, title: siteName, statusBarStyle: "black-translucent" },
    other: {
      "msapplication-TileColor": "#0e0e11",
      "msapplication-config": "/browserconfig.xml",
    },
    openGraph: {
      title,
      description,
      siteName,
      type: "website",
      images: ogImage ? [ogImage] : [],
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

  return (
    <html lang="pt-br">
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
