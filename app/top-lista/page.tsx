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
import TopListaClient from "./TopListaClient";

const TITLE = "Listas TOP de GTA 6";
const DESCRIPTION =
  "Rankings, tier lists e seleções sobre Grand Theft Auto VI: pedidos da comunidade, teorias, recursos mais aguardados e mais.";

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/top-lista",
});

export default async function TopListaPage() {
  const [listasRes, reviewsRes, siteSettingsDoc] = await Promise.all([
    getArticlesByFormat("listas-top", { limit: 60 }),
    getArticlesByFormat("reviews", { limit: 3 }),
    getSiteSettings(),
  ]);
  const siteSettings = getSiteSettingsData(siteSettingsDoc);

  const jsonLd = jsonLdGraph(
    collectionPageLd({ path: "/top-lista", name: TITLE, description: DESCRIPTION }),
    breadcrumbLd([
      { name: "Início", path: "/" },
      { name: "Listas TOP", path: "/top-lista" },
    ]),
  );

  return (
    <>
      <JsonLd json={jsonLd} />
      <TopListaClient
        listas={adaptArticles(listasRes.results)}
        latestReviews={adaptArticles(reviewsRes.results)}
        trending={getTrendingTopics(siteSettings)}
        siteSettings={siteSettings}
      />
    </>
  );
}
