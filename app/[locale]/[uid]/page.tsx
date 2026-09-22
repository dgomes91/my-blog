import { notFound } from "next/navigation";
import { SliceZone } from "@prismicio/react";
import { asText } from "@prismicio/client";
import type { Metadata } from "next";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { OswaldText } from "@/app/components";
import { JsonLd } from "@/app/components/json-ld";
import {
  isLocale,
  withLocale,
  t,
  HTML_LANG,
  localeFromDocLang,
  type Locale,
} from "@/app/lib/i18n";
import {
  absoluteUrl,
  breadcrumbLd,
  jsonLdGraph,
  pageMetadata,
  rasterImage,
} from "@/app/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/[uid]">): Promise<Metadata> {
  const { locale, uid } = await params;
  if (!isLocale(locale)) notFound();
  const lang = locale;
  const client = createClient();
  const page = await client.getByUID("page", uid, { lang }).catch(() => null);
  if (!page) return {};

  const title = page.data.seo_title?.trim() || page.data.title?.trim() || uid;
  const firstRichText = page.data.slices?.find(
    (s) => s.slice_type === "rich_text",
  );
  const bodyText = firstRichText
    ? asText((firstRichText.primary as { content?: never }).content)
    : "";
  const description =
    page.data.seo_description?.trim() ||
    page.data.subtitle?.trim() ||
    (bodyText || "").slice(0, 200) ||
    title;

  const path = withLocale(lang, `/${uid}`);
  const translations: Partial<Record<Locale, string>> = { [lang]: path };
  const sibling = page.alternate_languages?.[0];
  if (sibling?.uid) {
    const siblingLang = localeFromDocLang(sibling.lang);
    translations[siblingLang] = withLocale(siblingLang, `/${sibling.uid}`);
  }

  return pageMetadata({
    title,
    description,
    path,
    lang,
    translations,
    images: [rasterImage(page.data.seo_image?.url)],
  });
}

export default async function GenericPage({ params }: PageProps<"/[locale]/[uid]">) {
  const { locale, uid } = await params;
  if (!isLocale(locale)) notFound();
  const lang = locale;
  const ui = t(lang);
  const client = createClient();
  const page = await client.getByUID("page", uid, { lang }).catch(() => null);
  if (!page) notFound();

  const jsonLd = jsonLdGraph(
    {
      "@type": "WebPage",
      "@id": `${absoluteUrl(withLocale(lang, `/${uid}`))}#webpage`,
      url: absoluteUrl(withLocale(lang, `/${uid}`)),
      name: page.data.title?.trim() || uid,
      ...(page.data.subtitle?.trim() ? { description: page.data.subtitle.trim() } : {}),
      inLanguage: HTML_LANG[lang],
      isPartOf: { "@id": `${absoluteUrl("/")}#website` },
      dateModified: page.last_publication_date,
    },
    breadcrumbLd([
      { name: ui.navHome, path: withLocale(lang, "/") },
      { name: page.data.title?.trim() || uid, path: withLocale(lang, `/${uid}`) },
    ]),
  );

  return (
    <main>
      <JsonLd json={jsonLd} />
      <div className="max-w-3xl mx-auto px-4 pt-16 pb-8">
        <OswaldText as="h1" className="text-3xl md:text-5xl font-bold text-foreground leading-tight mb-3">
          {page.data.title}
        </OswaldText>
        {page.data.subtitle && <p className="text-muted-foreground text-lg">{page.data.subtitle}</p>}
      </div>
      <SliceZone slices={page.data.slices} components={components} />
    </main>
  );
}
