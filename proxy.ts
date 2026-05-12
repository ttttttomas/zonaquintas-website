import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = [
  "/my-account",
  "/reservations",
  "/publications",
  "/dashboard",
  "/favorites",
  "/wallet",
  "/publicar-quinta/paso-1",
  "/publicar-quinta/paso-2",
  "/publicar-quinta/paso-3",
  "/publicar-quinta/paso-4",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isProtected) {
    const token = request.cookies.get("access_token");

    if (!token || !token.value) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/my-account/:path*",
    "/reservations/:path*",
    "/publications/:path*",
    "/dashboard/:path*",
    "/favorites/:path*",
    "/wallet/:path*",
    "/publicar-quinta/:path*",
  ],
};
