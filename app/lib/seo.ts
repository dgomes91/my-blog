import type { Metadata } from "next";

/**
 * Base de SEO do site. Um único lugar para URL canônica, nome do publisher,
 * defaults de metadata e helpers de JSON-LD (usados por Google, Google Notícias
 * e mecanismos de IA para entender e citar as páginas).
 */

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://danilogomes.com.br"
).replace(/\/$/, "");

export const SITE_NAME = "Danilo Gomes";
export const SITE_TAGLINE = "Central de GTA 6";
export const SITE_LOCALE = "pt_BR";

export const DEFAULT_TITLE = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const DEFAULT_DESCRIPTION =
  "Cobertura dedicada a Grand Theft Auto VI: notícias, análise de trailers, mapa de Leonida, Jason e Lucia, data de lançamento e guias.";

/** Logo do publisher usada em JSON-LD (raster, quadrada, servida de /public). */
export const PUBLISHER_LOGO = `${SITE_URL}/android-icon-192x192.png`;

export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Só considera imagem "boa para OG/JSON-LD" se for raster (evita os placeholders .svg). */
export function rasterImage(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  return /\.svg(\?|$)/i.test(url) ? undefined : url;
}

/**
 * Metadata base do site — aplicada no root layout e estendida por cada rota.
 * `metadataBase` faz o Next resolver canonical/OG/twitter para URLs absolutas.
 */
export function baseMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    applicationName: SITE_NAME,
    title: { default: DEFAULT_TITLE, template: `%s · ${SITE_NAME}` },
    description: DEFAULT_DESCRIPTION,
    alternates: { canonical: "/" },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      url: SITE_URL,
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
    },
    twitter: {
      card: "summary_large_image",
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
    },
  };
}

/** Monta a metadata de uma página comum (canonical + OG/twitter coerentes). */
export function pageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  images?: (string | undefined)[];
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
  tags?: string[];
  noindex?: boolean;
}): Metadata {
  const url = absoluteUrl(opts.path);
  const images = (opts.images ?? []).filter(Boolean) as string[];
  const imgProp = images.length ? { images } : {}; // vazio → usa o opengraph-image padrão
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: opts.path },
    ...(opts.authors && opts.authors.length
      ? { authors: opts.authors.map((name) => ({ name })) }
      : {}),
    ...(opts.noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type: opts.type ?? "website",
      url,
      title: opts.title,
      description: opts.description,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      ...imgProp,
      ...(opts.type === "article"
        ? {
            publishedTime: opts.publishedTime,
            modifiedTime: opts.modifiedTime,
            authors: opts.authors,
            section: opts.section,
            tags: opts.tags,
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      ...imgProp,
    },
    ...(opts.tags && opts.tags.length ? { keywords: opts.tags } : {}),
  };
}

// ─── JSON-LD ───────────────────────────────────────────────────────────────

type Json = Record<string, unknown>;

/** Reader Revenue Manager: marca o artigo como parte do produto de acesso livre. */
const RRM_PUBLICATION_ID = process.env.NEXT_PUBLIC_RRM_PUBLICATION_ID;
const rrmIsPartOf = RRM_PUBLICATION_ID
  ? {
      isPartOf: {
        "@type": ["CreativeWork", "Product"],
        name: SITE_NAME,
        productID: `${RRM_PUBLICATION_ID}:openaccess`,
      },
    }
  : {};

export const organizationLd: Json = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: { "@type": "ImageObject", url: PUBLISHER_LOGO, width: 192, height: 192 },
};

export function websiteLd(sameAs: string[] = []): Json {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: "pt-BR",
    description: DEFAULT_DESCRIPTION,
    publisher: { "@id": `${SITE_URL}/#organization` },
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function collectionPageLd(o: {
  path: string;
  name: string;
  description: string;
}): Json {
  return {
    "@type": "CollectionPage",
    "@id": `${absoluteUrl(o.path)}#webpage`,
    url: absoluteUrl(o.path),
    name: o.name,
    description: o.description,
    inLanguage: "pt-BR",
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };
}

export function breadcrumbLd(
  items: { name: string; path: string }[],
): Json {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

export function newsArticleLd(a: {
  path: string;
  headline: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified: string;
  authorName: string;
  authorUrl?: string;
  section: string;
  keywords?: string[];
  isReview?: boolean;
  reviewScore?: number;
}): Json {
  const url = absoluteUrl(a.path);
  return {
    "@type": a.isReview ? "ReviewNewsArticle" : "NewsArticle",
    "@id": `${url}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: a.headline.slice(0, 110),
    description: a.description,
    ...(a.image ? { image: [a.image] } : {}),
    datePublished: a.datePublished,
    dateModified: a.dateModified,
    inLanguage: "pt-BR",
    articleSection: a.section,
    ...(a.keywords && a.keywords.length ? { keywords: a.keywords.join(", ") } : {}),
    author: {
      "@type": "Person",
      name: a.authorName,
      ...(a.authorUrl ? { url: a.authorUrl } : {}),
    },
    publisher: { "@id": `${SITE_URL}/#organization` },
    isAccessibleForFree: true,
    ...rrmIsPartOf,
    ...(a.isReview && typeof a.reviewScore === "number"
      ? {
          reviewRating: {
            "@type": "Rating",
            ratingValue: a.reviewScore,
            bestRating: 10,
            worstRating: 0,
          },
        }
      : {}),
  };
}

/** Envelope @graph pronto para `<script type="application/ld+json">`. */
export function jsonLdGraph(...nodes: Json[]): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": nodes,
  });
}
