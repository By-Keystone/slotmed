import { InputHTMLAttributes } from "react";

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "defaultValue"> {
  name: string;
  value?: string;
}

export const Input = ({ name, value, className, ...rest }: Props) => (
  <input
    type="text"
    id={name}
    name={name}
    defaultValue={value}
    className={`rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${className ?? ""}`}
    {...rest}
  />
);
