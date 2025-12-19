import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    // Paths that don't require authentication
    const publicPaths = [
        "/login",
        "/register",
        "/",
        "/api/auth/login",
        "/api/auth/register",
        "/api/auth/refresh",
        "/about",
        "/contact"
    ];

    const isPublicPath = publicPaths.some((path) =>
        request.nextUrl.pathname.startsWith(path) && request.nextUrl.pathname !== "/admin"
    );

    // If resource request (images, etc), skip
    if (request.nextUrl.pathname.startsWith("/_next") ||
        request.nextUrl.pathname.startsWith("/assets") ||
        request.nextUrl.pathname.startsWith("/favicon.ico")) {
        return NextResponse.next();
    }

    const token = request.cookies.get("access_token")?.value || request.cookies.get("refresh_token")?.value;

    if (!token && !isPublicPath) {
        // Redirect to login if accessing protected route without token
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    if (token && (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/register")) {
        // Redirect to dashboard if already logged in
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
