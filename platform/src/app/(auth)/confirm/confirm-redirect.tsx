"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

export function ConfirmRedirect({ message }: { message: string }) {
  const [seconds, setSeconds] = useState(3);
  const router = useRouter();

  useEffect(() => {
    if (seconds === 0) {
      router.replace("/login");
      return;
    }
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds, router]);

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <CheckCircle className="h-12 w-12 text-green-500" />
      <p className="text-gray-800 font-medium">{message}</p>
      <p className="text-sm text-gray-500">
        Redirigiendo al login en {seconds} segundo{seconds !== 1 ? "s" : ""}...
      </p>
    </div>
  );
}
