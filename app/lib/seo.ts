import type { Metadata } from "next";
import { DEFAULT_LOCALE, HTML_LANG, OG_LOCALE, withLocale, type Locale } from "./i18n";

/**
 * Base de SEO do site. Um único lugar para URL canônica, nome do publisher,
 * defaults de metadata e helpers de JSON-LD (usados por Google, Google Notícias
 * e mecanismos de IA para entender e citar as páginas).
 */

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://danilogomes.com.br"
).replace(/\/$/, "");

export const SITE_NAME = "Danilo Gomes";

const SITE_TAGLINE: Record<Locale, string> = {
  "pt-br": "Central de GTA 6",
  "en-us": "GTA 6 Hub",
};
const DEFAULT_DESCRIPTION_BY_LOCALE: Record<Locale, string> = {
  "pt-br":
    "Cobertura dedicada a Grand Theft Auto VI: notícias, análise de trailers, mapa de Leonida, Jason e Lucia, data de lançamento e guias.",
  "en-us":
    "Dedicated coverage of Grand Theft Auto VI: news, trailer breakdowns, the Leonida map, Jason and Lucia, release date updates, and guides.",
};

export function defaultTitle(lang: Locale = DEFAULT_LOCALE): string {
  return `${SITE_NAME} — ${SITE_TAGLINE[lang]}`;
}
export function defaultDescription(lang: Locale = DEFAULT_LOCALE): string {
  return DEFAULT_DESCRIPTION_BY_LOCALE[lang];
}


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
export function baseMetadata(lang: Locale = DEFAULT_LOCALE): Metadata {
  const title = defaultTitle(lang);
  const description = defaultDescription(lang);
  return {
    metadataBase: new URL(SITE_URL),
    applicationName: SITE_NAME,
    title: { default: title, template: `%s · ${SITE_NAME}` },
    description,
    alternates: { canonical: withLocale(lang, "/") },
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
      locale: OG_LOCALE[lang],
      url: absoluteUrl(withLocale(lang, "/")),
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/**
 * `path` das versões traduzidas de uma página (sem prefixo de locale — ex:
 * `{ "pt-br": "/politica-de-privacidade", "en-us": "/privacy-policy" }`).
 * Quando informado, `pageMetadata` gera `alternates.languages` (hreflang) e
 * `x-default` apontando pra versão pt-br.
 */
type LocalizedPaths = Partial<Record<Locale, string>>;

/** Monta a metadata de uma página comum (canonical + OG/twitter coerentes). */
export function pageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  lang?: Locale;
  translations?: LocalizedPaths;
  images?: (string | undefined)[];
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
  tags?: string[];
  noindex?: boolean;
}): Metadata {
  const lang = opts.lang ?? DEFAULT_LOCALE;
  const url = absoluteUrl(opts.path);
  const images = (opts.images ?? []).filter(Boolean) as string[];
  const imgProp = images.length ? { images } : {}; // vazio → usa o opengraph-image padrão

  const languages = opts.translations
    ? Object.fromEntries(
        Object.entries(opts.translations).map(([l, p]) => [
          l === DEFAULT_LOCALE ? "x-default" : HTML_LANG[l as Locale],
          absoluteUrl(p!),
        ]),
      )
    : undefined;

  return {
    title: opts.title,
    description: opts.description,
    alternates: {
      canonical: opts.path,
      ...(languages ? { languages } : {}),
    },
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
      locale: OG_LOCALE[lang],
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

export function websiteLd(sameAs: string[] = [], lang: Locale = DEFAULT_LOCALE): Json {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: HTML_LANG[lang],
    description: defaultDescription(lang),
    publisher: { "@id": `${SITE_URL}/#organization` },
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function collectionPageLd(o: {
  path: string;
  name: string;
  description: string;
  lang?: Locale;
}): Json {
  return {
    "@type": "CollectionPage",
    "@id": `${absoluteUrl(o.path)}#webpage`,
    url: absoluteUrl(o.path),
    name: o.name,
    description: o.description,
    inLanguage: HTML_LANG[o.lang ?? DEFAULT_LOCALE],
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
  lang?: Locale;
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
    inLanguage: HTML_LANG[a.lang ?? DEFAULT_LOCALE],
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
