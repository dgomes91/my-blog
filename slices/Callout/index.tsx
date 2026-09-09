import { FC } from "react";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { Info, AlertTriangle, ShieldAlert } from "lucide-react";

export type CalloutProps = SliceComponentProps<Content.CalloutSlice>;

const STYLES: Record<string, { icon: typeof Info; classes: string; label: string }> = {
  Dica: { icon: Info, classes: "border-teal-500/60 bg-teal-500/10", label: "Intel Estratégica" },
  Aviso: { icon: AlertTriangle, classes: "border-yellow-500/60 bg-yellow-500/10", label: "Aviso" },
  Importante: { icon: ShieldAlert, classes: "border-primary/60 bg-primary/10", label: "Importante" },
};

const Callout: FC<CalloutProps> = ({ slice }) => {
  const style = STYLES[slice.primary.type ?? "Dica"] ?? STYLES.Dica;
  const Icon = style.icon;

  return (
    <aside
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={`max-w-2xl mx-auto my-6 mx-4 md:mx-auto px-4 py-4 border-l-4 ${style.classes}`}
    >
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-4 h-4 text-foreground" />
        <span
          className="text-xs font-bold uppercase tracking-widest text-foreground"
          style={{ fontFamily: "var(--font-jetbrains), monospace" }}
        >
          {slice.primary.title || style.label}
        </span>
      </div>
      <div className="text-sm text-foreground/90 leading-relaxed">
        <PrismicRichText field={slice.primary.content} />
      </div>
    </aside>
  );
};

export default Callout;
