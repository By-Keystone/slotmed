"use server";

import { cookies } from "next/headers";
import {
  COOKIE_NAMES,
  COOKIE_OPTIONS,
  REFRESH_TOKEN_OPTIONS,
} from "@/lib/cognito/cookies";

export type ActionResult = { ok: boolean; message: string; code?: string };

export async function register(
  _: any,
  formData: FormData,
): Promise<ActionResult> {
  const name = formData.get("name") as string;
  const lastName = formData.get("lastname") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const phone = formData.get("phone") as string;

  if (!name || !email || !password || !phone) {
    return { ok: false, message: "Todos los campos son obligatorios" };
  }
  if (password.length < 8) {
    return {
      ok: false,
      message: "La contraseña debe tener al menos 8 caracteres",
    };
  }

  const response = await fetch(`${process.env.API_URL}/auth/register`, {
    method: "POST",
    body: JSON.stringify({
      name,
      lastName,
      email,
      phone,
      password,
    }),
  });

  const json: { message: string } = await response.json();

  const result = { ok: true };

  if (!response.ok) result.ok = false;

  return { ...result, message: json.message };
}

export async function login(
  _: unknown,
  formData: FormData,
): Promise<{ error: string } | { redirectTo: string }> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email y contraseña son obligatorios" };
  }

  let accessToken: string;
  let idToken: string;
  let refreshToken: string;

  try {
    const response = await fetch(`${process.env.API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const json: { message?: string } = await response.json();
      if (response.status === 401)
        return { error: "Email o contraseña incorrectos" };
      if (response.status === 403)
        return { error: "El correo no está confirmado" };
      return { error: json.message ?? "Ha ocurrido un error" };
    }

    const json: {
      accessToken: string;
      idToken: string;
      refreshToken: string;
    } = await response.json();

    accessToken = json.accessToken;
    idToken = json.idToken;
    refreshToken = json.refreshToken;
  } catch {
    return { error: "Ha ocurrido un error" };
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAMES.accessToken, accessToken, COOKIE_OPTIONS);
  cookieStore.set(COOKIE_NAMES.idToken, idToken, COOKIE_OPTIONS);
  cookieStore.set(
    COOKIE_NAMES.refreshToken,
    refreshToken,
    REFRESH_TOKEN_OPTIONS,
  );

  return { redirectTo: "/dashboard" };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAMES.accessToken);
  cookieStore.delete(COOKIE_NAMES.idToken);
  cookieStore.delete(COOKIE_NAMES.refreshToken);
}

export async function confirmAccount(token: string): Promise<ActionResult> {
  try {
    const result = await fetch(
      `${process.env.API_URL}/auth/confirm?token=${token}`,
      { method: "GET" },
    );

    const json = await result.json();

    if (!result.ok) {
      if (result.status === 409)
        return { ok: false, message: "already_confirmed" };
      return {
        ok: false,
        message: "Token inválido o expirado",
        code: "already_confirmed",
      };
    }

    return { ok: true, message: "Usuario confirmado!" };
  } catch (error) {
    console.error(error);
    return { ok: false, message: "Token inválido o expirado" };
  }
}
