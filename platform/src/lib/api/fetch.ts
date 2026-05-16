import "server-only";

import { cookies } from "next/headers";
import { COOKIE_NAMES } from "../auth/cookies";
import { AuthExpiredError } from "./errors";

const API_URL = process.env.API_URL;

export async function doFetch(to: string, init?: RequestInit) {
  const accessToken = (await cookies()).get(COOKIE_NAMES.accessToken)?.value;

  const response = await fetch(`${API_URL}${to}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...init?.headers,
    },
  });

  if (response.status === 401) throw new AuthExpiredError();

  return response;
}
