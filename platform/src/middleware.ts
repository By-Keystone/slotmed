import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const PUBLIC_PATHS = [
  "/",
  "/register",
  "/login",
  "/beta",
  "/confirm-email",
  "/invite/accept",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.includes(pathname)) {
    if (process.env.BETA_ENDED === "false" && pathname === "/")
      return NextResponse.redirect(new URL("/beta", request.nextUrl));
    return NextResponse.next();
  }

  // Chequeo optimista: solo verifica la presencia de la cookie de sesión de
  // Better Auth (sin llamar a la BD). La validación real —sesión válida,
  // onboarding, recurso activo— ocurre en los layouts/páginas.
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
