import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refresca la sesión — no eliminar esta llamada
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/register");
  const isProtected =
    pathname.startsWith("/dashboard") || pathname.startsWith("/onboarding");

  const isDoctor = user?.user_metadata?.role === "DOCTOR";

  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && isAuthRoute) {
    const onboardingDone =
      isDoctor || user.user_metadata?.onboarding_completed === true;
    const url = request.nextUrl.clone();
    url.pathname = onboardingDone ? "/dashboard" : "/onboarding";
    return NextResponse.redirect(url);
  }

  // Usuario autenticado en /dashboard pero sin onboarding → redirigir
  if (user && !isDoctor && pathname.startsWith("/dashboard")) {
    const onboardingDone = user.user_metadata?.onboarding_completed === true;
    if (!onboardingDone) {
      const url = request.nextUrl.clone();
      url.pathname = "/onboarding";
      return NextResponse.redirect(url);
    }
  }

  // Usuario autenticado en /onboarding pero ya completó el onboarding → redirigir
  if (user && pathname.startsWith("/onboarding")) {
    const onboardingDone =
      isDoctor || user.user_metadata?.onboarding_completed === true;
    if (onboardingDone) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
