/**
 * Infraestrutura de i18n do site. pt-br é o idioma padrão (URLs sem prefixo,
 * ex: `/article/uid`); en-us vive sob `/en-us/...`. `proxy.ts` reescreve
 * internamente as URLs sem prefixo para a árvore de rotas `app/[locale]`,
 * então toda página do app vive sob `[locale]` mesmo quando a URL visível
 * não mostra o prefixo.
 */

export const LOCALES = ["pt-br", "en-us"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "pt-br";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** Converte o `lang` de um documento Prismic (`"pt-br"`/`"en-us"`) em `Locale`. */
export function localeFromDocLang(lang: string | undefined | null): Locale {
  return lang === "en-us" ? "en-us" : "pt-br";
}

/** Prefixa um path interno (começando com `/`) com o locale, quando necessário. */
export function withLocale(lang: Locale, path: string): string {
  if (lang === DEFAULT_LOCALE) return path;
  return path === "/" ? "/en-us" : `/en-us${path}`;
}

/** Dado um pathname (`request.nextUrl.pathname` ou `usePathname()`), deduz o locale. */
export function localeFromPathname(pathname: string): Locale {
  return pathname === "/en-us" || pathname.startsWith("/en-us/") ? "en-us" : "pt-br";
}

/** Remove o prefixo `/en-us` de um pathname, devolvendo o path "canônico" pt-br. */
export function stripLocale(pathname: string): string {
  if (pathname === "/en-us") return "/";
  if (pathname.startsWith("/en-us/")) return pathname.slice("/en-us".length);
  return pathname;
}

export const HTML_LANG: Record<Locale, string> = { "pt-br": "pt-BR", "en-us": "en-US" };
export const OG_LOCALE: Record<Locale, string> = { "pt-br": "pt_BR", "en-us": "en_US" };
/** `news:language` do sitemap do Google Notícias (ISO 639-1, sem região). */
export const NEWS_LANG: Record<Locale, string> = { "pt-br": "pt", "en-us": "en" };

/** Slugs de categoria (`noticias`/`news`, `top-lista`/`top-lists`) por locale. */
export const CATEGORY_PATH: Record<Locale, { news: string; reviews: string; topLists: string }> = {
  "pt-br": { news: "/noticias", reviews: "/reviews", topLists: "/top-lista" },
  "en-us": { news: "/en-us/news", reviews: "/en-us/reviews", topLists: "/en-us/top-lists" },
};

/**
 * Textos de UI que não vêm do Prismic (chrome fixo dos componentes/páginas).
 * Conteúdo editorial real mora sempre no CMS — isto é só o "esqueleto" da UI.
 */
export const UI = {
  "pt-br": {
    navHome: "Início",
    navNews: "Notícias",
    navAbout: "Sobre",
    navAdvertise: "Anuncie",
    contentColumn: "Conteúdo",
    institutionalColumn: "Institucional",
    tagNews: "NOTÍCIA",
    tagReview: "ANÁLISE",
    tagList: "LISTA",
    breaking: "URGENTE",
    seeAll: "Ver Tudo",
    trending: "Em Alta",
    searchPlaceholder: "Pesquisar jogos, análises, guias...",
    editorScore: "Nota do Editor",
    rightsReserved: "Todos os direitos reservados.",
    subscribe: "INSCREVER-SE",
    sending: "ENVIANDO…",
    emailPlaceholder: "seu@email.com",
    subscribedDefault: "Inscrito com sucesso!",
    newsletterHeadingDefault: "Newsletter GTA 6",
    newsletterSubtextDefault:
      "Toda semana, o que há de novo sobre GTA 6 no seu e-mail: trailers, rumores confirmados e contagem regressiva.",
    footerTaglineDefault:
      "Cobertura dedicada a Grand Theft Auto VI — notícias, trailers, teorias e guias.",
    noArticlesTitle: "Nenhum artigo publicado ainda",
    noArticlesBody: "Publique um artigo no Prismic e ele aparece aqui automaticamente.",
    latestNews: "Últimas Notícias",
    recentReviews: "Análises Recentes",
    featuredReviewLabel: "ANÁLISE EM DESTAQUE",
    universallyAcclaimed: "ACLAMADO UNIVERSALMENTE",
    topListsHeading: "Listas TOP",
    viewAllLists: "VER TODAS AS LISTAS",
    moreNews: "Mais Notícias",
    readLater: "Para Ler Depois",
    articlesPublishedSuffix: "artigos publicados",
    allNews: "Todas as Notícias",
    reviewsPublishedSuffix: "análises publicadas",
    allReviews: "Todas as Análises",
    latestReviewsSideTitle: "Últimas Reviews",
    recentReviewsSideTitle: "Reviews Recentes",
    scoreDistribution: "Distribuição de Notas",
    sortRecent: "RECENTES",
    sortScoreUp: "NOTA ↑",
    sortScoreDown: "NOTA ↓",
    criticallyAcclaimed: "ACLAMADO PELA CRÍTICA",
    byAuthorPrefix: "por",
    listsPublishedSuffix: "listas publicadas",
    filterAll: "TODOS",
    filterTierList: "TIER LISTS",
    filterTopN: "TOP N",
    filterRecommendation: "RECOMENDAÇÕES",
    gridViewTitle: "Grade",
    listViewTitle: "Lista",
    featuredListHeading: "Lista em Destaque",
    allListsHeading: "Todas as Listas",
    noListsFound: "Nenhuma lista encontrada",
    tryAnotherFilter: "Tente outro filtro.",
    itemsLabel: "ITENS",
    minReadSuffix: "min de leitura",
    aboutFallbackTitle: "Sobre",
    aboutFallbackDescription: "Quem faz o {site} e como cobrimos GTA 6.",
    aboutPrinciples: "Nossos Princípios",
    aboutTeam: "A Equipe",
    aboutHistory: "Nossa História",
    aboutEditorialPolicyDefault: "Política Editorial & Financiamento",
    advertiseCtaDefault: "ANUNCIE CONOSCO",
    contactCtaDefault: "ENTRAR EM CONTATO",
    teamMemberFallback: "Membro da equipe",
    teamRoleFallback: "Equipe editorial",
    heroLabelFallback: "Sobre o projeto",
    readingPickFallback: "Matéria em destaque",
    trendingTopicFallback: "Tema em destaque",
  },
  "en-us": {
    navHome: "Home",
    navNews: "News",
    navAbout: "About",
    navAdvertise: "Advertise",
    contentColumn: "Content",
    institutionalColumn: "Institutional",
    tagNews: "NEWS",
    tagReview: "REVIEW",
    tagList: "LIST",
    breaking: "BREAKING",
    seeAll: "View All",
    trending: "Trending",
    searchPlaceholder: "Search games, reviews, guides...",
    editorScore: "Editor's Score",
    rightsReserved: "All rights reserved.",
    subscribe: "SUBSCRIBE",
    sending: "SENDING…",
    emailPlaceholder: "you@email.com",
    subscribedDefault: "Subscribed successfully!",
    newsletterHeadingDefault: "GTA 6 Newsletter",
    newsletterSubtextDefault:
      "Every week, the latest on GTA 6 straight to your inbox: trailers, confirmed rumors, and the countdown to launch.",
    footerTaglineDefault:
      "Dedicated coverage of Grand Theft Auto VI — news, trailers, theories, and guides.",
    noArticlesTitle: "No articles published yet",
    noArticlesBody: "Publish an article on Prismic and it shows up here automatically.",
    latestNews: "Latest News",
    recentReviews: "Recent Reviews",
    featuredReviewLabel: "FEATURED REVIEW",
    universallyAcclaimed: "UNIVERSALLY ACCLAIMED",
    topListsHeading: "Top Lists",
    viewAllLists: "VIEW ALL LISTS",
    moreNews: "More News",
    readLater: "Read Later",
    articlesPublishedSuffix: "articles published",
    allNews: "All News",
    reviewsPublishedSuffix: "reviews published",
    allReviews: "All Reviews",
    latestReviewsSideTitle: "Latest Reviews",
    recentReviewsSideTitle: "Recent Reviews",
    scoreDistribution: "Score Distribution",
    sortRecent: "RECENT",
    sortScoreUp: "SCORE ↑",
    sortScoreDown: "SCORE ↓",
    criticallyAcclaimed: "CRITICALLY ACCLAIMED",
    byAuthorPrefix: "by",
    listsPublishedSuffix: "lists published",
    filterAll: "ALL",
    filterTierList: "TIER LISTS",
    filterTopN: "TOP N",
    filterRecommendation: "RECOMMENDATIONS",
    gridViewTitle: "Grid",
    listViewTitle: "List",
    featuredListHeading: "Featured List",
    allListsHeading: "All Lists",
    noListsFound: "No lists found",
    tryAnotherFilter: "Try another filter.",
    itemsLabel: "ITEMS",
    minReadSuffix: "min read",
    aboutFallbackTitle: "About",
    aboutFallbackDescription: "Who makes {site} and how we cover GTA 6.",
    aboutPrinciples: "Our Principles",
    aboutTeam: "The Team",
    aboutHistory: "Our Story",
    aboutEditorialPolicyDefault: "Editorial Policy & Funding",
    advertiseCtaDefault: "ADVERTISE WITH US",
    contactCtaDefault: "GET IN TOUCH",
    teamMemberFallback: "Team member",
    teamRoleFallback: "Editorial team",
    heroLabelFallback: "About the project",
    readingPickFallback: "Featured story",
    trendingTopicFallback: "Trending topic",
  },
} as const satisfies Record<Locale, Record<string, string>>;

export function t(lang: Locale): (typeof UI)[Locale] {
  return UI[lang];
}
