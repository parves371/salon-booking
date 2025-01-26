import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublicPath = path === "/admin/login";
  const token = request.cookies.get("salon-admin")?.value || "";

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  

}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/admin/:path*"],
};
