import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { Mail } from "lucide-react";

export type NewsletterCtaProps = SliceComponentProps<Content.NewsletterCtaSlice>;

const NewsletterCta: FC<NewsletterCtaProps> = ({ slice }) => (
  <aside
    data-slice-type={slice.slice_type}
    data-slice-variation={slice.variation}
    className="max-w-2xl mx-auto px-6 py-6 my-6 bg-secondary border border-border flex flex-col sm:flex-row items-center gap-4"
  >
    <Mail className="w-8 h-8 text-primary shrink-0" />
    <div className="flex-1 text-center sm:text-left">
      <p className="font-bold text-foreground" style={{ fontFamily: "var(--font-oswald), sans-serif" }}>
        {slice.primary.heading}
      </p>
      {slice.primary.subtext && <p className="text-sm text-muted-foreground mt-0.5">{slice.primary.subtext}</p>}
    </div>
    <button
      className="shrink-0 bg-primary text-white px-5 py-2 text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
      style={{ fontFamily: "var(--font-jetbrains), monospace" }}
    >
      {slice.primary.button_label || "Inscrever-se"}
    </button>
  </aside>
);

export default NewsletterCta;
