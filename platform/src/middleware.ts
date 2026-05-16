import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAMES } from "./lib/auth/cookies";
import { verifyToken } from "./lib/auth/guards";
import { refreshTokens } from "./lib/auth/refresh";

const FIFTEEN_MINUTES = 60 * 15;
const SEVEN_DAYS = 60 * 60 * 24 * 7;

const BASE = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

function toLogin(req: NextRequest, opts: { clearCookies: boolean }) {
  const loginUrl = new URL("/login", req.url);

  loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);

  const res = NextResponse.redirect(loginUrl);

  if (opts?.clearCookies) {
    res.cookies.delete(COOKIE_NAMES.accessToken);
    res.cookies.delete(COOKIE_NAMES.refreshToken);
  }

  return res;
}

const PUBLIC_PATHS = ["/", "/register", "/beta", "/confirm-email"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.includes(pathname)) {
    if (process.env.BETA_ENDED === "false" && pathname == "/")
      return NextResponse.redirect(new URL("/beta", request.nextUrl));
    return NextResponse.next();
  }

  let accessToken = request.cookies.get(COOKIE_NAMES.accessToken)?.value;
  let refreshToken = request.cookies.get(COOKIE_NAMES.refreshToken)?.value;
  const sessionToken = request.cookies.get(COOKIE_NAMES.sessionToken)?.value;

  if (sessionToken && !accessToken) {
    if (pathname === "/onboarding") return NextResponse.next();
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  let payload = accessToken ? await verifyToken(accessToken) : null;

  if (pathname === "/login") {
    if (!payload?.accountId) return NextResponse.next();

    const resourceId = request.cookies.get(COOKIE_NAMES.resourceId)?.value;
    const resourceType = request.cookies.get(COOKIE_NAMES.resourceType)?.value;
    const base = `/account/${payload.accountId}`;
    const url =
      !resourceId || !resourceType
        ? new URL(`${base}/select`, request.url)
        : new URL(
            `${base}/${resourceType.toLowerCase()}/${resourceId}`,
            request.url,
          );
    return NextResponse.redirect(url);
  }

  if (!refreshToken) return toLogin(request, { clearCookies: true });

  let refreshed: { accessToken: string; refreshToken: string } | null = null;

  if (!payload) {
    try {
      const tokens = await refreshTokens(refreshToken);
      if (!tokens) return toLogin(request, { clearCookies: true });

      payload = await verifyToken(tokens.accessToken);
      if (!payload) throw new Error("Token inválido");

      refreshed = tokens;
    } catch (error) {
      console.error("Error occurred:", error);
      return toLogin(request, { clearCookies: true });
    }
  }

  const applyRefreshed = (res: NextResponse) => {
    if (!refreshed) return res;
    res.cookies.set(COOKIE_NAMES.accessToken, refreshed.accessToken, {
      ...BASE,
      maxAge: FIFTEEN_MINUTES,
    });
    res.cookies.set(COOKIE_NAMES.refreshToken, refreshed.refreshToken, {
      ...BASE,
      maxAge: SEVEN_DAYS,
    });
    return res;
  };

  return applyRefreshed(NextResponse.next());
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
