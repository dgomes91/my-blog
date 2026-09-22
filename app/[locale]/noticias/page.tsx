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
import NoticiasClient from "./NoticiasClient";

function copyFor(lang: Locale) {
  return lang === "en-us"
    ? {
        title: "GTA 6 News",
        description:
          "The latest news, confirmed rumors, and trailer coverage of Grand Theft Auto VI, updated continuously.",
      }
    : {
        title: "Notícias de GTA 6",
        description:
          "Últimas notícias, rumores confirmados e cobertura de trailers de Grand Theft Auto VI, atualizadas continuamente.",
      };
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/noticias">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const lang = locale;
  const { title, description } = copyFor(lang);

  return pageMetadata({
    title,
    description,
    path: CATEGORY_PATH[lang].news,
    lang,
    translations: {
      "pt-br": CATEGORY_PATH["pt-br"].news,
      "en-us": CATEGORY_PATH["en-us"].news,
    },
  });
}

export default async function NoticiasPage({
  params,
}: PageProps<"/[locale]/noticias">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  if (locale !== "pt-br") notFound();
  const lang = locale;
  const ui = t(lang);
  const { title, description } = copyFor(lang);

  const [noticiasRes, reviewsRes, siteSettingsDoc] = await Promise.all([
    getArticlesByFormat("noticias", { limit: 60, lang }),
    getArticlesByFormat("reviews", { limit: 3, lang }),
    getSiteSettings(lang),
  ]);
  const siteSettings = getSiteSettingsData(siteSettingsDoc);

  const jsonLd = jsonLdGraph(
    collectionPageLd({
      path: CATEGORY_PATH[lang].news,
      name: title,
      description,
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
