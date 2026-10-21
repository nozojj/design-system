import type { ComponentPropsWithRef } from "react";
import "./Card.css";

export type CardProps = ComponentPropsWithRef<"div"> & {
  as?: "div" | "article" | "section";
};

function CardRoot({ as = "div", className, ...props }: CardProps) {
  const classes = ["ds-card", className].filter(Boolean).join(" ");
  const Element = as;
  return <Element {...props} className={classes} />;
}

export type CardTitleProps = ComponentPropsWithRef<"h3"> & {
  as?: "h2" | "h3" | "h4" | "h5" | "h6";
};

function CardTitle({ as = "h3", className, ...props }: CardTitleProps) {
  const classes = ["ds-card__title", className].filter(Boolean).join(" ");
  const Heading = as;
  return <Heading {...props} className={classes} />;
}

export const Card = Object.assign(CardRoot, { Title: CardTitle });
