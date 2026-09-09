import { adaptArticles } from "../lib/article-adapter";
import {
  getArticlesByFormat,
  getSiteSettings,
  getSiteSettingsData,
  getTrendingTopics,
} from "../lib/queries";
import NoticiasClient from "./NoticiasClient";

export default async function NoticiasPage() {
  const [noticiasRes, reviewsRes, siteSettingsDoc] = await Promise.all([
    getArticlesByFormat("noticias", { limit: 60 }),
    getArticlesByFormat("reviews", { limit: 3 }),
    getSiteSettings(),
  ]);
  const siteSettings = getSiteSettingsData(siteSettingsDoc);

  return (
    <NoticiasClient
      noticias={adaptArticles(noticiasRes.results)}
      latestReviews={adaptArticles(reviewsRes.results)}
      trending={getTrendingTopics(siteSettings)}
      siteSettings={siteSettings}
    />
  );
}
