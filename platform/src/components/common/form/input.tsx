interface Props {
  name: string;
  value?: string;
}

export const Input = ({ name, value }: Props) => (
  <input
    type="text"
    id={name}
    name={name}
    value={value}
    className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
  />
);
