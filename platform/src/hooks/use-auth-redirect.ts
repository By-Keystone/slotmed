"use client";

import { useEffect } from "react";

export function useAuthRedirect(state: { unauthorized?: boolean } | null) {
  useEffect(() => {
    if (state?.unauthorized) {
      window.location.href = "/login";
    }
  }, [state]);
}
