import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(req: NextRequest) {
  const res = NextResponse.next();
  const { pathname } = req.nextUrl;

  // Protect /portal and /admin routes
  if (pathname.startsWith("/portal") || pathname.startsWith("/admin")) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return req.cookies.getAll(); },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              req.cookies.set(name, value);
              res.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      // Preserve the full original URL so login can redirect back to it.
      // This is critical for the post-payment flow:
      //   Stripe → /portal/dashboard?payment=success&project=xxx
      //   → not logged in → /auth/login?next=/portal/dashboard?payment=success&project=xxx
      //   → after login → /portal/dashboard?payment=success&project=xxx  ✓
      const next = req.nextUrl.pathname + req.nextUrl.search;
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("next", next);
      return NextResponse.redirect(loginUrl);
    }
  }

  return res;
}

export const config = {
  matcher: ["/portal/:path*", "/admin/:path*"],
};
