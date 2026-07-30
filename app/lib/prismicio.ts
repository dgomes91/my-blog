import * as prismic from "@prismicio/client";
import * as prismicNext from "@prismicio/next";

export const repositoryName = "56a5a6cc";

export const client = prismic.createClient(repositoryName, {
  fetchOptions: {
    next: { tags: ["prismic"] },
  },
});

export function linkResolver(doc: prismic.PrismicDocument) {
  switch (doc.type) {
    case "homepage":
      return "/";
    case "about":
      return "/sobre-nos";
    case "article":
      return `/artigo/${doc.uid}`; // ajustar se decidir por rota prefixada por seção
    case "page":
      return `/${doc.uid}`;
    default:
      return "/";
  }
}

export const { enableAutoPreviews } = prismicNext;