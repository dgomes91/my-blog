import { adaptArticles } from "../lib/article-adapter";
import { getArticlesByFormat } from "../lib/queries";
import TopListaClient from "./TopListaClient";

export default async function TopListaPage() {
  const [listasRes, reviewsRes] = await Promise.all([
    getArticlesByFormat("listas-top", { limit: 60 }),
    getArticlesByFormat("reviews", { limit: 3 }),
  ]);

  return (
    <TopListaClient
      listas={adaptArticles(listasRes.results)}
      latestReviews={adaptArticles(reviewsRes.results)}
    />
  );
}
