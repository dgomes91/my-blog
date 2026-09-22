import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { adaptArticles } from "@/app/lib/article-adapter";
import {
  getArticlesByFormat,
  getSiteSettings,
  getSiteSettingsData,
  getTrendingTopics,
} from "@/app/lib/queries";
import {
  breadcrumbLd,
  collectionPageLd,
  jsonLdGraph,
  pageMetadata,
} from "@/app/lib/seo";
import { JsonLd } from "@/app/components/json-ld";
import { CATEGORY_PATH, isLocale, t } from "@/app/lib/i18n";
import NoticiasClient from "../noticias/NoticiasClient";

const TITLE = "GTA 6 News";
const DESCRIPTION =
  "The latest news, confirmed rumors, and trailer coverage of Grand Theft Auto VI, updated continuously.";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/news">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const lang = locale;

  return pageMetadata({
    title: TITLE,
    description: DESCRIPTION,
    path: CATEGORY_PATH[lang].news,
    lang,
    translations: {
      "pt-br": CATEGORY_PATH["pt-br"].news,
      "en-us": CATEGORY_PATH["en-us"].news,
    },
  });
}

export default async function NewsPage({
  params,
}: PageProps<"/[locale]/news">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  if (locale !== "en-us") notFound();
  const lang = locale;
  const ui = t(lang);

  const [noticiasRes, reviewsRes, siteSettingsDoc] = await Promise.all([
    getArticlesByFormat("noticias", { limit: 60, lang }),
    getArticlesByFormat("reviews", { limit: 3, lang }),
    getSiteSettings(lang),
  ]);
  const siteSettings = getSiteSettingsData(siteSettingsDoc);

  const jsonLd = jsonLdGraph(
    collectionPageLd({
      path: CATEGORY_PATH[lang].news,
      name: TITLE,
      description: DESCRIPTION,
      lang,
    }),
    breadcrumbLd([
      { name: ui.navHome, path: "/" },
      { name: ui.navNews, path: CATEGORY_PATH[lang].news },
    ]),
  );

  return (
    <>
      <JsonLd json={jsonLd} />
      <NoticiasClient
        noticias={adaptArticles(noticiasRes.results, lang)}
        latestReviews={adaptArticles(reviewsRes.results, lang)}
        trending={getTrendingTopics(siteSettings)}
        siteSettings={siteSettings}
      />
    </>
  );
}
