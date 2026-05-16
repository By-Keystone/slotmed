import { Stethoscope } from "lucide-react";

export const TopNav = () => {
  return (
    <div className="w-full flex items-center gap-x-2 py-4 bg-gray-100 justify-center shadow-lg rounded-b-md">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
        <Stethoscope className="h-6 w-6 text-white" />
      </div>
      <span className="text-2xl font-bold text-gray-900 tracking-tight">
        WizyDoc
      </span>
    </div>
  );
};
