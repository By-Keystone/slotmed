import "server-only";

import { cache } from "react";
import { AuthExpiredError } from "@/lib/api/errors";
import { cookies } from "next/headers";
import { COOKIE_NAMES } from "./cookies";

export interface Me {
  id: string;
  email: string;
  name: string;
  lastName: string;
  role: string;
  confirmed: boolean;
  isDoctor: boolean;
  onboardingCompleted: boolean;
  accountId: string | null;
}

const API_URL = process.env.API_URL;

/**
 * Fetches the authenticated user's mutable profile (onboarding flag, role,
 * isDoctor, etc.) from the backend.
 *
 * Cached per request via React `cache()`, so multiple components in the same
 * render share a single round trip.
 *
 * Returns `null` when there's no session or the backend rejected the call.
 */
export const getMe = cache(async (): Promise<Me | null> => {
  const accessToken = (await cookies()).get(COOKIE_NAMES.accessToken)?.value;

  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) return null;
    return (await response.json()) as Me;
  } catch (error) {
    if (error instanceof AuthExpiredError) return null;
    throw error;
  }
});
