"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/common/error-state";

/**
 * Boundary raíz: captura errores del root layout. Debe renderizar su propio
 * <html>/<body> porque reemplaza al layout global.
 */
export default function GlobalError({
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
    <html lang="es">
      <body>
        <ErrorState
          message="Ocurrió un error inesperado. Vuelve a intentarlo."
          onRetry={reset}
        />
      </body>
    </html>
  );
}
