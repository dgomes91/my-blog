import type { Metadata } from "next";
import "./styles/index.css";
import { Footer, Header } from "./components";
import { getSiteSettings, getSiteSettingsData } from "./lib/queries";
import { repositoryName } from "@/prismicio";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
const GA_ID = process.env.GOOGLE_ANALYTICS_ID;

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
