import {
  createContext,
  useContext,
  useId,
  useLayoutEffect,
  useState,
  type ComponentPropsWithRef,
  type ReactNode,
} from "react";
import "./Card.css";

export type CardSize = "md" | "lg";

type CardContextValue = {
  titleId: string;
  setHasTitle: (hasTitle: boolean) => void;
};

const CardContext = createContext<CardContextValue | null>(null);

function useCardContext(name: string) {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error(`<${name}> は <Card> の中で使ってください`);
  }
  return context;
}

/* ---------- Card ---------- */

export type CardProps = Omit<ComponentPropsWithRef<"article">, "children"> & {
  /** ルート要素。単独で意味をなす内容（商品、記事）は article、ページの一部なら section か div */
  as?: "article" | "section" | "div";
  /** md: 一覧の1項目。lg: 一覧の中で大きく扱う1項目（非対称グリッドの主役など） */
  size?: CardSize;
  children: ReactNode;
};

function CardRoot({
  as = "article",
  size = "md",
  className,
  children,
  ...props
}: CardProps) {
  // article / section / div はどれも HTMLElement なので、型は article にそろえて扱う
  const Element = as as "article";
  const titleId = useId();
  const [hasTitle, setHasTitle] = useState(false);
  const classes = ["ds-card", className].filter(Boolean).join(" ");

  return (
    <CardContext.Provider value={{ titleId, setHasTitle }}>
      <Element
        // 見出しがあれば、カードの名前として読み上げる（aria-label が渡されたらそちらを優先）
        aria-labelledby={hasTitle && !props["aria-label"] ? titleId : undefined}
        {...props}
        className={classes}
        data-size={size}
      >
        {children}
      </Element>
    </CardContext.Provider>
  );
}

/* ---------- Card.Title ---------- */

export type CardTitleProps = Omit<ComponentPropsWithRef<"h3">, "id"> & {
  /** 見出しのレベル。ページの見出し構造に合わせて選ぶ */
  as?: "h2" | "h3" | "h4" | "h5" | "h6";
  /**
   * 指定すると見出しがリンクになり、カード全体がクリックできる。
   * リンクは1つだけなので、読み上げではカード1枚につき1回だけ案内される
   */
  href?: string;
};

function CardTitle({ as: Heading = "h3", href, className, children, ...props }: CardTitleProps) {
  const { titleId, setHasTitle } = useCardContext("Card.Title");
  const classes = ["ds-card__title", className].filter(Boolean).join(" ");

  useLayoutEffect(() => {
    setHasTitle(true);
    return () => setHasTitle(false);
  }, [setHasTitle]);

  return (
    <Heading {...props} id={titleId} className={classes}>
      {href ? (
        <a className="ds-card__link" href={href}>
          {children}
        </a>
      ) : (
        children
      )}
    </Heading>
  );
}

/* ---------- Card.Body ---------- */

export type CardBodyProps = ComponentPropsWithRef<"div">;

function CardBody({ className, ...props }: CardBodyProps) {
  const classes = ["ds-card__body", className].filter(Boolean).join(" ");
  return <div {...props} className={classes} />;
}

/* ---------- Card.Actions ---------- */

export type CardActionsProps = ComponentPropsWithRef<"div">;

/** カードの操作（ボタンやリンク）。見出しがリンクのときも、ここの操作は個別に押せる */
function CardActions({ className, ...props }: CardActionsProps) {
  const classes = ["ds-card__actions", className].filter(Boolean).join(" ");
  return <div {...props} className={classes} />;
}

export const Card = Object.assign(CardRoot, {
  Title: CardTitle,
  Body: CardBody,
  Actions: CardActions,
});
