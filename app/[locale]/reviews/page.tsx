import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { adaptArticles } from "@/app/lib/article-adapter";
import {
  getArticlesByFormat,
  getSiteSettings,
  getSiteSettingsData,
} from "@/app/lib/queries";
import {
  breadcrumbLd,
  collectionPageLd,
  jsonLdGraph,
  pageMetadata,
} from "@/app/lib/seo";
import { JsonLd } from "@/app/components/json-ld";
import { CATEGORY_PATH, isLocale, t, type Locale } from "@/app/lib/i18n";
import ReviewsClient from "./ReviewsClient";

function copyFor(lang: Locale) {
  return lang === "en-us"
    ? {
        title: "GTA 6 Reviews",
        description:
          "In-depth reviews of Grand Theft Auto VI and everything Rockstar has shown so far, with editor score and verdict.",
      }
    : {
        title: "Reviews e análises de GTA 6",
        description:
          "Análises aprofundadas de Grand Theft Auto VI e do que a Rockstar mostrou até agora, com nota e veredito do editor.",
      };
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/reviews">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const lang = locale;
  const { title, description } = copyFor(lang);

  return pageMetadata({
    title,
    description,
    path: CATEGORY_PATH[lang].reviews,
    lang,
    translations: {
      "pt-br": CATEGORY_PATH["pt-br"].reviews,
      "en-us": CATEGORY_PATH["en-us"].reviews,
    },
  });
}

export default async function ReviewsPage({
  params,
}: PageProps<"/[locale]/reviews">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const lang = locale;
  const ui = t(lang);
  const { title, description } = copyFor(lang);

  const [reviewsRes, newsRes, siteSettingsDoc] = await Promise.all([
    getArticlesByFormat("reviews", { limit: 60, lang }),
    getArticlesByFormat("noticias", { limit: 4, lang }),
    getSiteSettings(lang),
  ]);

  const jsonLd = jsonLdGraph(
    collectionPageLd({
      path: CATEGORY_PATH[lang].reviews,
      name: title,
      description,
      lang,
    }),
    breadcrumbLd([
      { name: ui.navHome, path: "/" },
      { name: "Reviews", path: CATEGORY_PATH[lang].reviews },
    ]),
  );

  return (
    <>
      <JsonLd json={jsonLd} />
      <ReviewsClient
        reviews={adaptArticles(reviewsRes.results, lang)}
        latestNews={adaptArticles(newsRes.results, lang)}
        siteSettings={getSiteSettingsData(siteSettingsDoc)}
      />
    </>
  );
}
