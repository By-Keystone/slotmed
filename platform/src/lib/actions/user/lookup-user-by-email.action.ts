"use server";

import { doFetchJson } from "@/lib/api/fetch";

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

  // Búsqueda "suave": cualquier fallo (no encontrado, error) devuelve null.
  try {
    const data = await doFetchJson<{ user?: LookedUpUser | null }>(
      `/user/by-email?email=${encodeURIComponent(email)}`,
      { method: "GET" },
    );

    return data.user ?? null;
  } catch {
    return null;
  }
}
