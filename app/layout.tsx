import type { Metadata } from "next";
import "./styles/index.css";
import { Footer, Header } from "./components";
import { getSiteSettings, getSiteSettingsData } from "./lib/queries";
import { Analytics } from "@vercel/analytics/next"
import { GoogleAnalytics } from '@next/third-parties/google'
import Script from 'next/script';

export const metadata: Metadata = {
  title: "Danilo Gomes - Blog",
  description: "Página do blog Danilo gomes",
};

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
      <GoogleAnalytics gaId={process.env.GOOGLE_ANALYTICS_ID} />
      <body className="min-h-screen bg-background text-foreground font-sans antialiased">
        <Header siteSettings={siteSettings} />
        {children}
        {/* Script do Prismic otimizado pelo Next.js */}
        <Script
          src="https://static.cdn.prismic.io/prismic.js?new=true&repo=56a5a6cc"
          strategy="afterInteractive"
        />
        <Footer siteSettings={siteSettings} />
        </body>
    </html>
  );
}
