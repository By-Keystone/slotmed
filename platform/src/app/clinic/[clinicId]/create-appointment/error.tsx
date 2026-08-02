"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/common/error-state";

/** Boundary del wizard público de reserva. */
export default function CreateAppointmentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorState
      message="No pudimos cargar la reserva. Vuelve a intentarlo."
      onRetry={reset}
    />
  );
}
