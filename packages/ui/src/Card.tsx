import {
  createContext,
  useContext,
  useEffect,
  useId,
  useState,
  type ComponentPropsWithRef,
} from "react";
import "./Card.css";

type CardContextValue = {
  titleId: string;
  setHasTitle: (hasTitle: boolean) => void;
};

const CardContext = createContext<CardContextValue | undefined>(undefined);

export type CardProps = ComponentPropsWithRef<"div"> & {
  as?: "div" | "article" | "section";
};

function CardRoot({ as = "div", className, ...props }: CardProps) {
  const titleId = useId();
  const [hasTitle, setHasTitle] = useState(false);
  const classes = ["ds-card", className].filter(Boolean).join(" ");
  const Element = as;
  const isLabelled = as !== "div" && hasTitle;
  return (
    <CardContext value={{ titleId, setHasTitle }}>
      <Element
        aria-labelledby={isLabelled ? titleId : undefined}
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
  const card = useContext(CardContext);
  const setHasTitle = card?.setHasTitle;

  useEffect(() => {
    if (!setHasTitle) return;
    setHasTitle(true);
    return () => setHasTitle(false);
  }, [setHasTitle]);

  const classes = ["ds-card__title", className].filter(Boolean).join(" ");
  const Heading = as;
  return <Heading id={card?.titleId} {...props} className={classes} />;
}

export const Card = Object.assign(CardRoot, { Title: CardTitle });
