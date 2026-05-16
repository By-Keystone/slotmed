import "server-only";
import { COOKIE_NAMES } from "./cookies";

const API_URL = process.env.API_URL;

export async function refreshTokens(refreshToken: string) {
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      Cookie: `${COOKIE_NAMES.refreshToken}=${refreshToken}`,
    },
  });

  const json = await res.json();

  if (!res.ok) {
    if (json.code === "INVALID_TOKEN") return;

    throw new Error("Refresh falló");
  }

  return json as Promise<{ accessToken: string; refreshToken: string }>;
}
