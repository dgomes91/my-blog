import type { Metadata } from "next";
import { Mulish, JetBrains_Mono, Oswald } from 'next/font/google';
import { Theme } from "@radix-ui/themes";
import "./globals.css";

// 1. Configure Mulish (General Sans-Serif Text)
const mulish = Mulish({
  subsets: ["latin"],
  variable: "--font-mulish",
  display: "swap",
});

// 2. Configure Oswald (Display/Headings)
const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
});

// 3. Configure JetBrains Mono (Code blocks)
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});


export const metadata: Metadata = {
  title: "My Blog",
  description: "Página do blog Danilo gomes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-br"
       className={`${mulish.variable} ${oswald.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground font-sans antialiased">
        <Theme>{children}</Theme>
        </body>
    </html>
  );
}
