import { adaptArticles } from "../lib/article-adapter";
import { getArticlesByFormat } from "../lib/queries";
import NoticiasClient from "./NoticiasClient";

export default async function NoticiasPage() {
  const [noticiasRes, reviewsRes] = await Promise.all([
    getArticlesByFormat("noticias", { limit: 60 }),
    getArticlesByFormat("reviews", { limit: 3 }),
  ]);

  return (
    <NoticiasClient
      noticias={adaptArticles(noticiasRes.results)}
      latestReviews={adaptArticles(reviewsRes.results)}
    />
  );
}
