import { FC } from "react";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";

export type RichTextProps = SliceComponentProps<Content.RichTextSlice>;

const RichText: FC<RichTextProps> = ({ slice }) => (
  <section
    data-slice-type={slice.slice_type}
    data-slice-variation={slice.variation}
    className="max-w-2xl mx-auto px-4 py-6 prose prose-invert prose-headings:font-bold text-foreground"
  >
    <PrismicRichText
      field={slice.primary.content}
      components={{
        heading2: ({ children }) => (
          <h2 className="text-2xl font-bold mt-8 mb-3 text-foreground" style={{ fontFamily: "'Oswald', sans-serif" }}>
            {children}
          </h2>
        ),
        heading3: ({ children }) => (
          <h3 className="text-xl font-bold mt-6 mb-2 text-foreground" style={{ fontFamily: "'Oswald', sans-serif" }}>
            {children}
          </h3>
        ),
        paragraph: ({ children }) => <p className="text-foreground/90 leading-relaxed mb-4">{children}</p>,
        hyperlink: ({ children, node }) => (
          <a
            href={node.data.url}
            className="text-primary underline hover:text-white"
            target={"target" in node.data ? node.data.target : undefined}
          >
            {children}
          </a>
        ),
      }}
    />
  </section>
);

export default RichText;
