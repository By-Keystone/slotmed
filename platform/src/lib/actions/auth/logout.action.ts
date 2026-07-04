"use server";

import { COOKIE_NAMES } from "@/lib/auth/cookies";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  const cookieStore = await cookies();

  cookieStore.delete(COOKIE_NAMES.accessToken);
  cookieStore.delete(COOKIE_NAMES.refreshToken);
  cookieStore.delete(COOKIE_NAMES.resourceId);
  cookieStore.delete(COOKIE_NAMES.resourceType);

  redirect("/login");
}
