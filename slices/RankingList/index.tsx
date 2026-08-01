import { FC } from "react";
import { Content } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";

export type RankingListProps = SliceComponentProps<Content.RankingListSlice>;

const TIER_COLORS: Record<string, string> = {
  S: "bg-primary text-white",
  A: "bg-orange-500 text-white",
  B: "bg-yellow-500 text-black",
  C: "bg-teal-600 text-white",
  D: "bg-secondary text-muted-foreground",
};

const RankingList: FC<RankingListProps> = ({ slice }) => (
  <section
    data-slice-type={slice.slice_type}
    data-slice-variation={slice.variation}
    className="max-w-3xl mx-auto px-4 py-6"
  >
    {slice.primary.title && (
      <h3
        className="text-xl font-bold mb-2 text-foreground uppercase tracking-wide"
        style={{ fontFamily: "'Oswald', sans-serif" }}
      >
        {slice.primary.title}
      </h3>
    )}
    {slice.primary.intro && (
      <div className="text-sm text-foreground/80 mb-4">
        <PrismicRichText field={slice.primary.intro} />
      </div>
    )}
    <ol className="space-y-3">
      {slice.primary.items.map((item, i) => (
        <li key={i} className="flex gap-3 bg-card border border-border p-3">
          <span
            className="shrink-0 w-8 h-8 flex items-center justify-center bg-secondary text-foreground font-bold"
            style={{ fontFamily: "'Oswald', sans-serif" }}
          >
            {i + 1}
          </span>
          {item.image?.url && (
            <PrismicNextImage field={item.image} className="w-16 h-16 object-cover shrink-0" />
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-foreground" style={{ fontFamily: "'Oswald', sans-serif" }}>
                {item.name}
              </span>
              {item.tier && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 ${TIER_COLORS[item.tier] ?? TIER_COLORS.D}`}
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  TIER {item.tier}
                </span>
              )}
            </div>
            <div className="text-sm text-muted-foreground mt-0.5">
              <PrismicRichText field={item.description} />
            </div>
          </div>
        </li>
      ))}
    </ol>
  </section>
);

export default RankingList;
