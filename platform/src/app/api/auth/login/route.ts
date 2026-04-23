import { NextRequest, NextResponse } from "next/server";
import {
  COOKIE_NAMES,
  COOKIE_OPTIONS,
  REFRESH_TOKEN_OPTIONS,
} from "@/lib/cognito/cookies";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  const response = await fetch(`${process.env.API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const json: { message?: string } = await response.json();
    if (response.status === 401)
      return NextResponse.json(
        { error: "Email o contraseña incorrectos" },
        { status: 401 },
      );
    if (response.status === 403)
      return NextResponse.json(
        { error: "El correo no está confirmado" },
        { status: 403 },
      );
    return NextResponse.json(
      { error: json.message ?? "Ha ocurrido un error" },
      { status: response.status },
    );
  }

  const json: {
    accessToken: string;
    idToken: string;
    refreshToken: string;
  } = await response.json();

  const res = NextResponse.json({
    redirectTo: "/dashboard",
  });

  res.cookies.set(COOKIE_NAMES.accessToken, json.accessToken, COOKIE_OPTIONS);
  res.cookies.set(COOKIE_NAMES.idToken, json.idToken, COOKIE_OPTIONS);
  res.cookies.set(
    COOKIE_NAMES.refreshToken,
    json.refreshToken,
    REFRESH_TOKEN_OPTIONS,
  );

  return res;
}
