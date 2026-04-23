import { cookies } from "next/headers";
import { cache } from "react";
import { decodeJwt } from "jose";
import { COOKIE_NAMES } from "./cookies";

export const getSession = cache(async () => {
  const cookieStore = await cookies();
  const idToken = cookieStore.get(COOKIE_NAMES.idToken)?.value;

  if (!idToken) return null;

  try {
    const payload = decodeJwt(idToken);

    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
});
