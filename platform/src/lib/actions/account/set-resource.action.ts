"use server";

import { COOKIE_NAMES } from "@/lib/auth/cookies";
import { cookies } from "next/headers";

export async function setResource(resourceId: string, resourceType: string) {
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAMES.resourceId, resourceId, {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
  });

  cookieStore.set(COOKIE_NAMES.resourceType, resourceType, {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
  });
}
