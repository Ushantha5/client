import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    const { pathname } = request.nextUrl;

    // Define public routes that don't require authentication
    const publicRoutes = [
        "/",
        "/about",
        "/courses",
        "/contact",
        "/auth/login",
        "/auth/signup",
    ];

    // Check if the current path is a public route
    const isPublicRoute = publicRoutes.some((route) =>
        pathname.startsWith(route),
    );

    // Allow access to public routes
    if (isPublicRoute) {
        // If user is already authenticated and trying to access auth pages, redirect to dashboard
        if (token && pathname.startsWith("/auth/")) {
            // We can't decode the token here easily, so redirect to home
            // The user will be redirected to their role-based dashboard by the client
            return NextResponse.redirect(new URL("/", request.url));
        }
        return NextResponse.next();
    }

    // Protected routes - require authentication
    if (!token) {
        // Redirect to login if not authenticated
        const loginUrl = new URL("/auth/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Role-based access control would require decoding the JWT
    // For now, we'll let the client-side handle role-based redirects
    // If you want server-side role checking, you'd need to decode the token here

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
         * - public files (images, etc.)
         */
        "/((?!api|_next/static|_next/image|favicon.ico|images|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg).*)",
    ],
};
