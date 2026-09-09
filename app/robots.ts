import type { MetadataRoute } from "next";
import { SITE_URL } from "./lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Buscadores + crawlers de IA (o usuário quer ser citado por IA).
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/slice-simulator", "/_next/"],
      },
    ],
    sitemap: [`${SITE_URL}/sitemap.xml`, `${SITE_URL}/news-sitemap.xml`],
    host: SITE_URL,
  };
}
