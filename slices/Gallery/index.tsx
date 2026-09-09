import { FC } from "react";
import { Content } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { SliceComponentProps } from "@prismicio/react";

export type GalleryProps = SliceComponentProps<Content.GallerySlice>;

const Gallery: FC<GalleryProps> = ({ slice }) => (
  <section
    data-slice-type={slice.slice_type}
    data-slice-variation={slice.variation}
    className="max-w-3xl mx-auto px-4 py-6"
  >
    {slice.primary.title && (
      <h3
        className="text-lg font-bold mb-3 text-foreground uppercase tracking-wide"
        style={{ fontFamily: "var(--font-oswald), sans-serif" }}
      >
        {slice.primary.title}
      </h3>
    )}
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
      {slice.primary.images.map((item, i) => (
        <figure key={i} className="bg-card">
          <PrismicNextImage field={item.image} className="w-full h-40 object-cover" />
          {item.caption && (
            <figcaption className="text-xs text-muted-foreground p-1.5">{item.caption}</figcaption>
          )}
        </figure>
      ))}
    </div>
  </section>
);

export default Gallery;
