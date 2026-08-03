import type { Metadata } from "next";
import "./styles/index.css";
import { Footer, Header } from "./components";
import { getSiteSettings, getSiteSettingsData } from "./lib/queries";
import { Analytics } from "@vercel/analytics/next"
import { GoogleAnalytics } from '@next/third-parties/google'

export const metadata: Metadata = {
  title: "My Blog",
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
        <Footer siteSettings={siteSettings} />
        </body>
    </html>
  );
}
