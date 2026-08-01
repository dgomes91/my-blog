import { FC } from "react";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { Check, X } from "lucide-react";

export type ProsConsProps = SliceComponentProps<Content.ProsConsSlice>;

const ProsCons: FC<ProsConsProps> = ({ slice }) => (
  <section
    data-slice-type={slice.slice_type}
    data-slice-variation={slice.variation}
    className="max-w-3xl mx-auto px-4 py-6"
  >
    {slice.primary.title && (
      <h3
        className="text-lg font-bold mb-3 text-foreground uppercase tracking-wide"
        style={{ fontFamily: "'Oswald', sans-serif" }}
      >
        {slice.primary.title}
      </h3>
    )}
    <div className="grid md:grid-cols-2 gap-4">
      <div className="border border-emerald-500/40 bg-emerald-500/5 p-4">
        <div className="flex items-center gap-2 mb-2 text-emerald-500 font-bold text-xs uppercase tracking-widest">
          <Check className="w-4 h-4" /> Prós
        </div>
        <div className="text-sm text-foreground/90 [&_li]:mb-1">
          <PrismicRichText field={slice.primary.pros} />
        </div>
      </div>
      <div className="border border-primary/40 bg-primary/5 p-4">
        <div className="flex items-center gap-2 mb-2 text-primary font-bold text-xs uppercase tracking-widest">
          <X className="w-4 h-4" /> Contras
        </div>
        <div className="text-sm text-foreground/90 [&_li]:mb-1">
          <PrismicRichText field={slice.primary.cons} />
        </div>
      </div>
    </div>
  </section>
);

export default ProsCons;
