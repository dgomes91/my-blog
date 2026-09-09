import { adaptArticles } from "../lib/article-adapter";
import {
  getArticlesByFormat,
  getSiteSettings,
  getSiteSettingsData,
} from "../lib/queries";
import ReviewsClient from "./ReviewsClient";

export default async function ReviewsPage() {
  const [reviewsRes, newsRes, siteSettingsDoc] = await Promise.all([
    getArticlesByFormat("reviews", { limit: 60 }),
    getArticlesByFormat("noticias", { limit: 4 }),
    getSiteSettings(),
  ]);

  return (
    <ReviewsClient
      reviews={adaptArticles(reviewsRes.results)}
      latestNews={adaptArticles(newsRes.results)}
      siteSettings={getSiteSettingsData(siteSettingsDoc)}
    />
  );
}
