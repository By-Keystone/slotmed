"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/common/error-state";

/** Se renderiza dentro del layout de clínica → conserva el sidebar. */
export default function ClinicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <ErrorState onRetry={reset} />;
}
