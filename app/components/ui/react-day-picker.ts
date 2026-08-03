import * as React from "react";

type DayPickerComponentProps = {
  className?: string;
  [key: string]: unknown;
};

export type DayPickerProps = {
  mode?: "single" | "multiple" | "range";
  className?: string;
  classNames?: Record<string, string>;
  showOutsideDays?: boolean;
  components?: Record<string, React.ComponentType<DayPickerComponentProps>>;
  [key: string]: unknown;
};

export function DayPicker(props: DayPickerProps) {
  return React.createElement("div", {
    ...props,
    "data-day-picker": "fallback",
    className: props.className,
  });
}
