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

// Rutas públicas con segmentos dinámicos, que no calzan con match exacto.
const PUBLIC_PATH_PATTERNS = [
  /^\/clinic\/[^/]+\/create-appointment$/,
  // Fetch client-side del wizard (disponibilidad del doctor). El middleware
  // corre antes de que Next resuelva next.config.ts `rewrites()`, así que
  // sin este bypass el fetch anónimo queda redirigido a /login.
  /^\/api\/doctor-profile\//,
  // Confirmar reserva (POST anónimo al crear la cita).
  /^\/api\/appointment$/,
];

function isPublicPath(pathname: string) {
  return (
    PUBLIC_PATHS.includes(pathname) ||
    PUBLIC_PATH_PATTERNS.some((pattern) => pattern.test(pathname))
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
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
