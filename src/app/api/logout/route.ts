import { NextResponse } from "next/server";

export async function GET(request: Request): Promise<NextResponse> {
  const response = NextResponse.json(
    { success: true, message: "Logged out successfully" },
    { status: 200 }
  );

  response.cookies.set("salon", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/", // Clear the cookie for the entire domain
  });

  return response;
}
