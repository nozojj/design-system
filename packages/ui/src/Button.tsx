import type { ComponentPropsWithRef } from "react";
import "./Button.css";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = ComponentPropsWithRef<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  variant = "primary",
  size = "md",
  type = "button",
  className,
  ...props
}: ButtonProps) {
  const classes = ["ds-button", className].filter(Boolean).join(" ");

  return (
    <button
      type={type}
      className={classes}
      data-variant={variant}
      data-size={size}
      {...props}
    />
  );
}
