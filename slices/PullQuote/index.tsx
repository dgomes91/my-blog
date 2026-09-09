import { FC } from "react";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";

export type PullQuoteProps = SliceComponentProps<Content.PullQuoteSlice>;

const PullQuote: FC<PullQuoteProps> = ({ slice }) => (
  <figure
    data-slice-type={slice.slice_type}
    data-slice-variation={slice.variation}
    className="max-w-2xl mx-auto px-4 py-8 border-l-4 border-primary"
  >
    <blockquote
      className="text-2xl font-bold text-foreground leading-snug"
      style={{ fontFamily: "var(--font-oswald), sans-serif" }}
    >
      <PrismicRichText field={slice.primary.quote} />
    </blockquote>
    {slice.primary.attribution && (
      <figcaption
        className="mt-3 text-sm text-muted-foreground uppercase tracking-wide"
        style={{ fontFamily: "var(--font-jetbrains), monospace" }}
      >
        — {slice.primary.attribution}
      </figcaption>
    )}
  </figure>
);

export default PullQuote;
