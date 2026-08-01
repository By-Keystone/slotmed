import { InputHTMLAttributes } from "react";

interface Props
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "defaultValue"> {
  name: string;
  value?: string;
  /** Mensaje de error de validación para este campo (se pinta debajo del input). */
  error?: string;
}

export const Input = ({ name, value, error, className, ...rest }: Props) => (
  <>
    <input
      type="text"
      id={name}
      name={name}
      defaultValue={value}
      aria-invalid={error ? true : undefined}
      className={`rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-2 ${
        error
          ? "border-red-400 focus:border-red-500 focus:ring-red-100"
          : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
      } ${className ?? ""}`}
      {...rest}
    />
    {error && (
      <p className="text-xs text-red-500" role="alert">
        {error}
      </p>
    )}
  </>
);
