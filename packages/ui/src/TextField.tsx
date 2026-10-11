import { useId, type ComponentPropsWithRef, type ReactNode } from "react";
import "./TextField.css";

export type TextFieldProps = Omit<
  ComponentPropsWithRef<"input">,
  "children"
> & {
  /** 入力欄のラベル（必須） */
  label: ReactNode;
  /** 補足説明 */
  description?: ReactNode;
  /** エラーメッセージ。渡すとエラー状態になる */
  error?: ReactNode;
};

export function TextField({
  label,
  description,
  error,
  id,
  required,
  className,
  "aria-describedby": ariaDescribedBy,
  ...props
}: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const descriptionId = `${inputId}-description`;
  const errorId = `${inputId}-error`;

  const describedBy =
    [
      ariaDescribedBy,
      description ? descriptionId : null,
      error ? errorId : null,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  const inputClasses = ["ds-text-field__input", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="ds-text-field">
      <label htmlFor={inputId} className="ds-text-field__label">
        {label}
        {required && (
          <span className="ds-text-field__required" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {description && (
        <p id={descriptionId} className="ds-text-field__description">
          {description}
        </p>
      )}

      <input
        {...props}
        id={inputId}
        required={required}
        className={inputClasses}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
      />

      {error && (
        <p id={errorId} className="ds-text-field__error">
          {error}
        </p>
      )}
    </div>
  );
}
