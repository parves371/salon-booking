import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const url = request.nextUrl;
  const pathname = url.pathname;

  // Get authentication tokens
  const adminToken = request.cookies.get("salon-admin")?.value || "";
  const customerToken = request.cookies.get("salon")?.value || "";

  // 🔹 Admin Authentication (For `/admin/*` routes)
  if (pathname.startsWith("/admin")) {
    const isPublicAdminPath = pathname === "/admin/login";

    if (isPublicAdminPath && adminToken) {
      return NextResponse.redirect(new URL("/", request.url)); // Redirect logged-in admins away from login
    }
    if (!isPublicAdminPath && !adminToken) {
      return NextResponse.redirect(new URL("/admin/login", request.url)); // Redirect unauthenticated admins to login
    }
    return NextResponse.next();
  }

  // 🔹 Customer Authentication (For Protected Customer Routes)
  const protectedCustomerRoutes = ["/profile", "/bookings"]; // Add future routes here
  if (protectedCustomerRoutes.includes(pathname) && !customerToken) {
    return NextResponse.redirect(new URL("/login", request.url)); // Redirect to customer login if not authenticated
  }

  // 🔹 Step Navigation Logic (For Public Routes)
  const step = parseInt(request.cookies.get("step")?.value || "1", 10);
  const stepsMap: Record<string, number> = {
    "/appointment": 1,
    "/professional": 2,
    "/time": 3,
  };

  const requiredStep = stepsMap[pathname];

  // Redirect users if they try to access a step they haven't completed
  if (requiredStep && requiredStep > step) {
    const lastCompletedPath = Object.keys(stepsMap).find(
      (key) => stepsMap[key] === step
    );
    return NextResponse.redirect(
      new URL(lastCompletedPath || "/appointment", request.url)
    );
  }

  return NextResponse.next();
}

// 🔹 Apply middleware only to relevant paths
export const config = {
  matcher: [
    "/admin/:path*", // Admin Routes (Require `salon-admin`)
    "/profile", // Customer Route (Require `salon`)
    "/bookings", // Customer Route (Require `salon`)
    "/appointment", // Public
    "/professional", // Public
    "/time", // Public
  ],
};
