import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = [
  "/my-account",
  "/reservations",
  "/publications",
  // "/publicar-quinta/paso-1",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isProtected) {
    const token = request.cookies.get("access_token");

    if (!token) {
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
    "/publicar-quinta/paso-1/:path*",
    "/publicar-quinta/paso-2/:path*",
    "/publicar-quinta/paso-3/:path*",
    "/publicar-quinta/paso-4/:path*",
  ],
};
