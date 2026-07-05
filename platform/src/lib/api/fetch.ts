import "server-only";

import { headers } from "next/headers";
import { AuthExpiredError } from "./errors";

const API_URL = process.env.API_URL;

/**
 * Llama al api reenviando la cookie de sesión de Better Auth (el api la valida
 * con `getSession`). Sustituye al antiguo header `Authorization: Bearer`.
 */
export async function doFetch(to: string, init?: RequestInit) {
  const cookie = (await headers()).get("cookie") ?? "";

  const response = await fetch(`${API_URL}${to}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(cookie && { cookie }),
      ...init?.headers,
    },
  });

  if (response.status === 401) throw new AuthExpiredError();

  return response;
}
