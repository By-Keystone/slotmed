"use server";

import { doFetch } from "@/lib/api/fetch";

export type LookedUpUser = {
  id: string;
  name: string;
  lastName: string;
  phone: string;
  email: string;
};

export async function lookupUserByEmailAction(
  email: string,
): Promise<LookedUpUser | null> {
  if (!email) return null;

  try {
    const response = await doFetch(
      `/user/by-email?email=${encodeURIComponent(email)}`,
      { method: "GET" },
    );

    if (!response.ok) return null;

    const data = await response.json();

    return data.user ?? null;
  } catch {
    return null;
  }
}
