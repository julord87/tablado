import { auth } from "./auth/auth"; // tu función auth
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const session = await auth();

  const isProtectedRoute = request.nextUrl.pathname.startsWith("/admin");

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

// Definimos para qué rutas aplica el middleware
export const config = {
  matcher: [
    "/admin/:path*", // protegemos todo /admin y subrutas
  ],
};
