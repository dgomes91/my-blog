import { adaptArticles } from "../lib/article-adapter";
import {
  getArticlesByFormat,
  getSiteSettings,
  getSiteSettingsData,
  getTrendingTopics,
} from "../lib/queries";
import TopListaClient from "./TopListaClient";

export default async function TopListaPage() {
  const [listasRes, reviewsRes, siteSettingsDoc] = await Promise.all([
    getArticlesByFormat("listas-top", { limit: 60 }),
    getArticlesByFormat("reviews", { limit: 3 }),
    getSiteSettings(),
  ]);
  const siteSettings = getSiteSettingsData(siteSettingsDoc);

  return (
    <TopListaClient
      listas={adaptArticles(listasRes.results)}
      latestReviews={adaptArticles(reviewsRes.results)}
      trending={getTrendingTopics(siteSettings)}
      siteSettings={siteSettings}
    />
  );
}
