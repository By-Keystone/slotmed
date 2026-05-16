import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_NAMES } from "./cookies";
import { getMe, type Me } from "./me";
import { jwtVerify } from "jose";
import { UserClaims } from "./session";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export type ActiveResource = {
  resourceId: string | undefined;
  resourceType: string | undefined;
};

export async function getActiveResource(): Promise<ActiveResource> {
  const cookieStore = await cookies();
  return {
    resourceId: cookieStore.get(COOKIE_NAMES.resourceId)?.value,
    resourceType: cookieStore.get(COOKIE_NAMES.resourceType)?.value,
  };
}

export async function verifyToken(accessToken: string) {
  try {
    const { payload } = await jwtVerify<UserClaims>(accessToken, secret);

    return payload;
  } catch {
    return;
  }
}
