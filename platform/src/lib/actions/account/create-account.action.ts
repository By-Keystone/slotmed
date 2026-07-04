"use server";

import { COOKIE_NAMES } from "@/lib/auth/cookies";
import type { UserClaims } from "@/lib/auth/session";
import { decodeJwt } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import z from "zod";

const completeAccountSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
});

export type CreateAccountState =
  | { status: "idle" }
  | {
      status: "error";
      message: string;
      fieldErrors?: Partial<
        Record<keyof z.infer<typeof completeAccountSchema>, string[]>
      >;
    };

const ACCESS_TOKEN_MAX_AGE = 60 * 30;
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 30;

export async function createAccountAction(
  _prevState: CreateAccountState,
  data: FormData,
): Promise<CreateAccountState> {
  const parsed = completeAccountSchema.safeParse({ name: data.get("name") });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Datos inválidos",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(COOKIE_NAMES.sessionToken)?.value;

  if (!sessionToken) {
    redirect("/login");
  }

  const response = await fetch(
    `${process.env.API_URL}/auth/complete-account`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionToken,
        accountName: parsed.data.name,
      }),
    },
  );

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    return {
      status: "error",
      message: payload?.message ?? "No se pudo crear la cuenta",
    };
  }

  const body = await response.json();
  const isProd = process.env.NODE_ENV === "production";

  if (body.status !== "authenticated") {
    return {
      status: "error",
      message: "Respuesta inesperada del servidor",
    };
  }

  cookieStore.delete(COOKIE_NAMES.sessionToken);

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

  redirect(`/account/${accountId}/select`);
}

function extractRefreshToken(response: Response): string | null {
  const cookies = response.headers.getSetCookie();
  for (const cookie of cookies) {
    const match = cookie.match(/^refresh_token=([^;]+)/);
    if (match) return match[1];
  }
  return null;
}
