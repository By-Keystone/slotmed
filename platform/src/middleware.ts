import { NextResponse, type NextRequest } from "next/server";
import { decodeJwt } from "jose";
import { COOKIE_NAMES } from "@/lib/cognito/cookies";

function isTokenExpired(token: string): boolean {
  try {
    const payload = decodeJwt(token);
    return !!payload.exp && payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

function clearCookies(response: NextResponse) {
  response.cookies.delete(COOKIE_NAMES.accessToken);
  response.cookies.delete(COOKIE_NAMES.idToken);
  response.cookies.delete(COOKIE_NAMES.refreshToken);
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (process.env.BETA_ENDED !== "true" && pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/beta";
    return NextResponse.redirect(url);
  }

  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/register");
  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/appointments") ||
    pathname.startsWith("/doctors") ||
    pathname.startsWith("/clinics") ||
    pathname.startsWith("/profile");

  const accessToken = request.cookies.get(COOKIE_NAMES.accessToken)?.value;
  const hasValidSession = accessToken && !isTokenExpired(accessToken);

  if (!hasValidSession && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    const response = NextResponse.redirect(url);
    clearCookies(response);
    return response;
  }

  if (hasValidSession && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next({ request });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
