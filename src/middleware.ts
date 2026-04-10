import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnProtectedRoute =
    req.nextUrl.pathname !== "/login" &&
    req.nextUrl.pathname !== "/register" &&
    !req.nextUrl.pathname.startsWith("/api/auth");

  if (isOnProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (
    (req.nextUrl.pathname === "/login" ||
      req.nextUrl.pathname === "/register") &&
    isLoggedIn
  ) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
