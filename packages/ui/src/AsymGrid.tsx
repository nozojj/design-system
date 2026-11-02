import type { ComponentPropsWithRef } from "react";
import "./AsymGrid.css";

export type AsymGridRatio = "3:2" | "2:1" | "3:1";

export type AsymGridProps = ComponentPropsWithRef<"div"> & {
  ratio?: AsymGridRatio;
  largeSide?: "start" | "end";
  gap?: "sm" | "md" | "lg";
};

function AsymGridRoot({
  ratio = "2:1",
  largeSide = "start",
  gap = "md",
  className,
  children,
  ...rest
}: AsymGridProps) {
  const classes = ["ds-asym-grid", className].filter(Boolean).join(" ");
  return (
    <div className="ds-asym-grid-container">
      <div
        {...rest}
        className={classes}
        data-ratio={ratio}
        data-large-side={largeSide}
        data-gap={gap}
      >
        {children}
      </div>
    </div>
  );
}

export type AsymGridItemProps = ComponentPropsWithRef<"div"> & {
  span?: "large";
};

function AsymGridItem({ span, className, ...props }: AsymGridItemProps) {
  const classes = ["ds-asym-grid__item", className].filter(Boolean).join(" ");
  return <div {...props} className={classes} data-span={span} />;
}
export const AsymGrid = Object.assign(AsymGridRoot, { Item: AsymGridItem });
