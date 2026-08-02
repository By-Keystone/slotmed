"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/common/error-state";

/** Se renderiza dentro del layout de organización → conserva el sidebar. */
export default function OrganizationError({
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
