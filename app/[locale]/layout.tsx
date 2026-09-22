import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer, Header } from "@/app/components";
import { getSiteSettings, getSiteSettingsData } from "@/app/lib/queries";
import { baseMetadata } from "@/app/lib/seo";
import { LOCALES, isLocale, type Locale } from "@/app/lib/i18n";

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const settings = getSiteSettingsData(await getSiteSettings(locale));
  const base = baseMetadata(locale);

  const title = settings?.seo_default_title?.trim();
  const description = settings?.seo_default_description?.trim();
  const ogImage = settings?.seo_default_image?.url ?? undefined;

  return {
    ...base,
    ...(title
      ? { title: { default: title, template: `%s · ${base.applicationName}` } }
      : {}),
    ...(description ? { description } : {}),
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

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const lang: Locale = locale;

  const siteSettings = getSiteSettingsData(await getSiteSettings(lang));

  return (
    <>
      <Header siteSettings={siteSettings} />
      {children}
      <Footer siteSettings={siteSettings} />
    </>
  );
}
