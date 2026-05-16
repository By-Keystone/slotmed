"use server";

import { COOKIE_NAMES } from "@/lib/auth/cookies";
import type { UserClaims } from "@/lib/auth/session";
import { decodeJwt } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export type LoginState =
  | { status: "idle" }
  | {
      status: "error";
      message: string;
      fieldErrors?: Record<string, string[]>;
    };

const SESSION_TOKEN_MAX_AGE = 60 * 10;
const ACCESS_TOKEN_MAX_AGE = 60 * 30;
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 30;

export async function loginAction(
  _prevState: LoginState,
  data: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: data.get("email"),
    password: data.get("password"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Datos inválidos",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const response = await fetch(`${process.env.API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed.data),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    return {
      status: "error",
      message: payload?.message ?? "Datos inválidos",
    };
  }

  const body = await response.json();
  const cookieStore = await cookies();
  const isProd = process.env.NODE_ENV === "production";

  if (body.status === "needs_account") {
    cookieStore.set(COOKIE_NAMES.sessionToken, body.sessionToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_TOKEN_MAX_AGE,
    });
    redirect("/onboarding");
  }

  if (body.status !== "authenticated") {
    return {
      status: "error",
      message: "Respuesta inesperada del servidor",
    };
  }

  cookieStore.set(COOKIE_NAMES.accessToken, body.accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });

  const refreshToken = extractRefreshToken(response);
  if (refreshToken) {
    cookieStore.set(COOKIE_NAMES.refreshToken, refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });
  }

  const { accountId } = decodeJwt<UserClaims>(body.accessToken);
  if (!accountId) {
    return {
      status: "error",
      message: "No se pudo obtener la cuenta del usuario",
    };
  }

  const resourceId = cookieStore.get(COOKIE_NAMES.resourceId)?.value;
  const resourceType = cookieStore.get(COOKIE_NAMES.resourceType)?.value;

  if (!resourceId || !resourceType) {
    redirect(`/account/${accountId}/select`);
  }

  redirect(`/account/${accountId}/${resourceType.toLowerCase()}/${resourceId}`);
}

function extractRefreshToken(response: Response): string | null {
  const cookies = response.headers.getSetCookie();
  for (const cookie of cookies) {
    const match = cookie.match(/^refresh_token=([^;]+)/);
    if (match) return match[1];
  }
  return null;
}
