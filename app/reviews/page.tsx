import { adaptArticles } from "../lib/article-adapter";
import { getArticlesByFormat } from "../lib/queries";
import ReviewsClient from "./ReviewsClient";

export default async function ReviewsPage() {
  const [reviewsRes, newsRes] = await Promise.all([
    getArticlesByFormat("reviews", { limit: 60 }),
    getArticlesByFormat("noticias", { limit: 4 }),
  ]);

  return (
    <ReviewsClient
      reviews={adaptArticles(reviewsRes.results)}
      latestNews={adaptArticles(newsRes.results)}
    />
  );
}
