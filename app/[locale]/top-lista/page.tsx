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
import { CATEGORY_PATH, isLocale, t, type Locale } from "@/app/lib/i18n";
import TopListaClient from "./TopListaClient";

function copyFor(lang: Locale) {
  return lang === "en-us"
    ? {
        title: "GTA 6 Top Lists",
        description:
          "Rankings, tier lists, and curated picks about Grand Theft Auto VI: community requests, theories, the most anticipated features, and more.",
      }
    : {
        title: "Listas TOP de GTA 6",
        description:
          "Rankings, tier lists e seleções sobre Grand Theft Auto VI: pedidos da comunidade, teorias, recursos mais aguardados e mais.",
      };
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/top-lista">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const lang = locale;
  const { title, description } = copyFor(lang);

  return pageMetadata({
    title,
    description,
    path: CATEGORY_PATH[lang].topLists,
    lang,
    translations: {
      "pt-br": CATEGORY_PATH["pt-br"].topLists,
      "en-us": CATEGORY_PATH["en-us"].topLists,
    },
  });
}

export default async function TopListaPage({
  params,
}: PageProps<"/[locale]/top-lista">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  if (locale !== "pt-br") notFound();
  const lang = locale;
  const ui = t(lang);
  const { title, description } = copyFor(lang);

  const [listasRes, reviewsRes, siteSettingsDoc] = await Promise.all([
    getArticlesByFormat("listas-top", { limit: 60, lang }),
    getArticlesByFormat("reviews", { limit: 3, lang }),
    getSiteSettings(lang),
  ]);
  const siteSettings = getSiteSettingsData(siteSettingsDoc);

  const jsonLd = jsonLdGraph(
    collectionPageLd({
      path: CATEGORY_PATH[lang].topLists,
      name: title,
      description,
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
