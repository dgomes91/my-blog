import { FC } from "react";
import { Content, isFilled } from "@prismicio/client";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { SliceComponentProps } from "@prismicio/react";
import { TagBadge } from "@/app/components";

export type RelatedArticlesProps = SliceComponentProps<Content.RelatedArticlesSlice>;

const FORMAT_TAG: Record<string, string> = {
  "Notícia": "NOTÍCIA",
  "Review": "ANÁLISE",
  "Lista TOP": "LISTA",
};

const RelatedArticles: FC<RelatedArticlesProps> = ({ slice }) => (
  <section
    data-slice-type={slice.slice_type}
    data-slice-variation={slice.variation}
    className="max-w-3xl mx-auto px-4 py-6 border-t border-border"
  >
    <h3
      className="text-sm font-bold mb-4 text-foreground uppercase tracking-widest border-l-4 border-primary pl-3"
      style={{ fontFamily: "'Oswald', sans-serif" }}
    >
      {slice.primary.heading || "Leia também"}
    </h3>
    <div className="grid sm:grid-cols-2 gap-4">
      {slice.primary.articles.map((item, i) => {
        const article = item.article;
        if (!isFilled.contentRelationship(article) || !article.data) return null;
        const data = article.data;
        return (
          <PrismicNextLink field={article} key={i} className="group flex gap-3 items-start">
            <PrismicNextImage
              field={data.cover_image as never}
              className="w-20 h-20 object-cover shrink-0"
            />
            <div className="min-w-0">
              {data.format && <TagBadge tag={FORMAT_TAG[data.format] ?? "NOTÍCIA"} className="mb-1" />}
              <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                {data.title}
              </p>
            </div>
          </PrismicNextLink>
        );
      })}
    </div>
  </section>
);

export default RelatedArticles;
