import type { ComponentPropsWithRef, MouseEvent } from "react";
import "./Button.css";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = ComponentPropsWithRef<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** 処理中の状態。スピナーを表示し、クリックを無効にする */
  loading?: boolean;
};

export function Button({
  variant = "primary",
  size = "md",
  type = "button",
  loading = false,
  className,
  children,
  onClick,
  "aria-disabled": ariaDisabled,
  ...props
}: ButtonProps) {
  const classes = ["ds-button", className].filter(Boolean).join(" ");

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    // 処理中はクリックを無視する（フォーム送信も止める）
    if (loading) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  return (
    <button
      {...props}
      type={type}
      className={classes}
      data-variant={variant}
      data-size={size}
      aria-busy={loading || undefined}
      aria-disabled={loading || ariaDisabled || undefined}
      onClick={handleClick}
    >
      {loading && <span className="ds-button__spinner" aria-hidden="true" />}
      <span className="ds-button__label">{children}</span>
    </button>
  );
}