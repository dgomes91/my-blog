import { FC } from "react";
import { Content } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { SliceComponentProps } from "@prismicio/react";

export type ImageBlockProps = SliceComponentProps<Content.ImageBlockSlice>;

const ImageBlock: FC<ImageBlockProps> = ({ slice }) => (
  <figure
    data-slice-type={slice.slice_type}
    data-slice-variation={slice.variation}
    className="max-w-3xl mx-auto px-4 py-6"
  >
    <PrismicNextImage field={slice.primary.image} className="w-full h-auto" />
    {(slice.primary.caption || slice.primary.credit) && (
      <figcaption
        className="mt-2 text-xs text-muted-foreground flex justify-between gap-4"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        <span>{slice.primary.caption}</span>
        {slice.primary.credit && <span className="italic">{slice.primary.credit}</span>}
      </figcaption>
    )}
  </figure>
);

export default ImageBlock;
