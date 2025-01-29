import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const url = request.nextUrl;
  const pathname = url.pathname;

  // Authentication Logic (Only for Admin Routes)
  const isAdminPath = path.startsWith("/admin");
  const token = request.cookies.get("salon-admin")?.value || "";

  if (isAdminPath) {
    const isPublicAdminPath = path === "/admin/login";

    if (isPublicAdminPath && token) {
      return NextResponse.redirect(new URL("/", request.url)); // Redirect logged-in admins away from login
    }
    if (!isPublicAdminPath && !token) {
      return NextResponse.redirect(new URL("/admin/login", request.url)); // Redirect unauthenticated users to login
    }
    return NextResponse.next();
  }

  // Step Navigation Logic (For Public Routes)
  const step = parseInt(request.cookies.get("step")?.value || "1", 10);

  // Define valid steps and their required order
  const stepsMap: Record<string, number> = {
    "/appointment": 1,
    "/professional": 2,
    "/time": 3,
  };

  const requiredStep = stepsMap[pathname];

  // If user tries to access a step they haven't reached, redirect them to their last completed step
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

// Apply middleware only to relevant paths
export const config = {
  matcher: ["/admin/:path*", "/appointment", "/professional", "/time"],
};
