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
import TopListaClient from "../top-lista/TopListaClient";

const TITLE = "GTA 6 Top Lists";
const DESCRIPTION =
  "Rankings, tier lists, and curated picks about Grand Theft Auto VI: community requests, theories, the most anticipated features, and more.";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/top-lists">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const lang = locale;

  return pageMetadata({
    title: TITLE,
    description: DESCRIPTION,
    path: CATEGORY_PATH[lang].topLists,
    lang,
    translations: {
      "pt-br": CATEGORY_PATH["pt-br"].topLists,
      "en-us": CATEGORY_PATH["en-us"].topLists,
    },
  });
}

export default async function TopListsPage({
  params,
}: PageProps<"/[locale]/top-lists">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  if (locale !== "en-us") notFound();
  const lang = locale;
  const ui = t(lang);

  const [listasRes, reviewsRes, siteSettingsDoc] = await Promise.all([
    getArticlesByFormat("listas-top", { limit: 60, lang }),
    getArticlesByFormat("reviews", { limit: 3, lang }),
    getSiteSettings(lang),
  ]);
  const siteSettings = getSiteSettingsData(siteSettingsDoc);

  const jsonLd = jsonLdGraph(
    collectionPageLd({
      path: CATEGORY_PATH[lang].topLists,
      name: TITLE,
      description: DESCRIPTION,
      lang,
    }),
    breadcrumbLd([
      { name: ui.navHome, path: "/" },
      { name: ui.topListsHeading, path: CATEGORY_PATH[lang].topLists },
    ]),
  );

  return (
    <>
      <JsonLd json={jsonLd} />
      <TopListaClient
        listas={adaptArticles(listasRes.results, lang)}
        latestReviews={adaptArticles(reviewsRes.results, lang)}
        trending={getTrendingTopics(siteSettings)}
        siteSettings={siteSettings}
      />
    </>
  );
}
