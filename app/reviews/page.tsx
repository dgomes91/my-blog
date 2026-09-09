import type { Metadata } from "next";
import { adaptArticles } from "../lib/article-adapter";
import {
  getArticlesByFormat,
  getSiteSettings,
  getSiteSettingsData,
} from "../lib/queries";
import {
  breadcrumbLd,
  collectionPageLd,
  jsonLdGraph,
  pageMetadata,
} from "../lib/seo";
import { JsonLd } from "../components/json-ld";
import ReviewsClient from "./ReviewsClient";

const TITLE = "Reviews e análises de GTA 6";
const DESCRIPTION =
  "Análises aprofundadas de Grand Theft Auto VI e do que a Rockstar mostrou até agora, com nota e veredito do editor.";

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/reviews",
});

export default async function ReviewsPage() {
  const [reviewsRes, newsRes, siteSettingsDoc] = await Promise.all([
    getArticlesByFormat("reviews", { limit: 60 }),
    getArticlesByFormat("noticias", { limit: 4 }),
    getSiteSettings(),
  ]);

  const jsonLd = jsonLdGraph(
    collectionPageLd({ path: "/reviews", name: TITLE, description: DESCRIPTION }),
    breadcrumbLd([
      { name: "Início", path: "/" },
      { name: "Reviews", path: "/reviews" },
    ]),
  );

  return (
    <>
      <JsonLd json={jsonLd} />
      <ReviewsClient
        reviews={adaptArticles(reviewsRes.results)}
        latestNews={adaptArticles(newsRes.results)}
        siteSettings={getSiteSettingsData(siteSettingsDoc)}
      />
    </>
  );
}
