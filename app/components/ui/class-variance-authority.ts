type VariantMap = Record<string, string>;
type VariantOptions = {
  variants?: Record<string, VariantMap>;
  defaultVariants?: Record<string, string>;
  compoundVariants?: Array<{
    className?: string;
    [key: string]: string | undefined;
  }>;
};

type VariantPropsInput = Record<string, unknown>;
type VariantResolver = (props?: VariantPropsInput) => string;

export type VariantProps<T extends VariantResolver> = Parameters<T>[0];

export function cva(baseClassName: string, config?: VariantOptions) {
  return function resolveClassName(props: VariantPropsInput = {}): string {
    const classes = [baseClassName];

    if (config?.defaultVariants) {
      for (const [key, value] of Object.entries(config.defaultVariants)) {
        if (value && !props[key]) {
          props[key] = value;
        }
      }
    }

    if (config?.variants) {
      for (const [key, values] of Object.entries(config.variants)) {
        const value = props[key];

        if (typeof value === "string" && values[value]) {
          classes.push(values[value]);
        }
      }
    }

    if (config?.compoundVariants) {
      for (const variant of config.compoundVariants) {
        const matches = Object.entries(variant).every(([candidateKey, candidateValue]) => {
          if (candidateKey === "className") return true;
          return props[candidateKey] === candidateValue;
        });

        if (matches && variant.className) {
          classes.push(variant.className);
        }
      }
    }

    return classes.filter(Boolean).join(" ").trim();
  };
}
