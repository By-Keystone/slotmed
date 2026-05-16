import { cookies } from "next/headers";
import { cache } from "react";
import { decodeJwt, JWTPayload } from "jose";
import { COOKIE_NAMES } from "./cookies";

/**
 * Identity claims encoded in the access token. Anything mutable lives in `Me`
 * (see `lib/auth/me.ts`) and is fetched from the backend.
 */
export interface UserClaims extends JWTPayload {
  userId: string;
  email: string;
  accountId?: string;
}

export const getSession = cache(async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(COOKIE_NAMES.accessToken)?.value;

  if (!accessToken) return null;

  try {
    const payload: UserClaims = decodeJwt(accessToken);

    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
});
