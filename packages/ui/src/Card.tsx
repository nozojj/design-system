import {
  createContext,
  useContext,
  useId,
  type ComponentPropsWithRef,
} from "react";
import "./Card.css";

const CardContext = createContext<string | undefined>(undefined);

export type CardProps = ComponentPropsWithRef<"div"> & {
  as?: "div" | "article" | "section";
};

function CardRoot({ as = "div", className, ...props }: CardProps) {
  const titleId = useId();
  const classes = ["ds-card", className].filter(Boolean).join(" ");
  const Element = as;
  return (
    <CardContext value={titleId}>
      <Element
        aria-labelledby={as === "div" ? undefined : titleId}
        {...props}
        className={classes}
      />
    </CardContext>
  );
}

export type CardTitleProps = ComponentPropsWithRef<"h3"> & {
  as?: "h2" | "h3" | "h4" | "h5" | "h6";
};

function CardTitle({ as = "h3", className, ...props }: CardTitleProps) {
  const titleId = useContext(CardContext);
  const classes = ["ds-card__title", className].filter(Boolean).join(" ");
  const Heading = as;
  return <Heading id={titleId} {...props} className={classes} />;
}

export const Card = Object.assign(CardRoot, { Title: CardTitle });
