import * as React from "react";

export type DayPickerProps = {
  mode?: "single" | "multiple" | "range";
  className?: string;
  classNames?: Record<string, string>;
  showOutsideDays?: boolean;
  components?: Record<string, React.ComponentType<any>>;
  [key: string]: unknown;
};

export function DayPicker(props: DayPickerProps) {
  return React.createElement("div", {
    ...props,
    "data-day-picker": "fallback",
    className: props.className,
  });
}
