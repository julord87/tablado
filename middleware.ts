import { auth } from "./auth/auth";

export default auth((req: { auth: any; nextUrl: { pathname: string; }; url: string | URL | undefined; }) => {
  const isLoggedIn = !!req.auth;

  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

  if (isAdminRoute && !isLoggedIn) {
    return Response.redirect(new URL("/admin/login", req.url));
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
