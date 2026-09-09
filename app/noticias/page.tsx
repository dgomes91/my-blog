import type { Metadata } from "next";
import { adaptArticles } from "../lib/article-adapter";
import {
  getArticlesByFormat,
  getSiteSettings,
  getSiteSettingsData,
  getTrendingTopics,
} from "../lib/queries";
import {
  breadcrumbLd,
  collectionPageLd,
  jsonLdGraph,
  pageMetadata,
} from "../lib/seo";
import { JsonLd } from "../components/json-ld";
import NoticiasClient from "./NoticiasClient";

const TITLE = "Notícias de GTA 6";
const DESCRIPTION =
  "Últimas notícias, rumores confirmados e cobertura de trailers de Grand Theft Auto VI, atualizadas continuamente.";

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/noticias",
});

export default async function NoticiasPage() {
  const [noticiasRes, reviewsRes, siteSettingsDoc] = await Promise.all([
    getArticlesByFormat("noticias", { limit: 60 }),
    getArticlesByFormat("reviews", { limit: 3 }),
    getSiteSettings(),
  ]);
  const siteSettings = getSiteSettingsData(siteSettingsDoc);

  const jsonLd = jsonLdGraph(
    collectionPageLd({ path: "/noticias", name: TITLE, description: DESCRIPTION }),
    breadcrumbLd([
      { name: "Início", path: "/" },
      { name: "Notícias", path: "/noticias" },
    ]),
  );

  return (
    <>
      <JsonLd json={jsonLd} />
      <NoticiasClient
        noticias={adaptArticles(noticiasRes.results)}
        latestReviews={adaptArticles(reviewsRes.results)}
        trending={getTrendingTopics(siteSettings)}
        siteSettings={siteSettings}
      />
    </>
  );
}
