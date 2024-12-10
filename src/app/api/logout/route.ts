import { NextResponse } from "next/server";

// Define the GET request handler
export async function GET(request: Request): Promise<NextResponse> {
  const response = NextResponse.json(
    { success: true, message: "Logged out successfully" },
    { status: 200 }
  );
  // Clear the token cookie by setting its expiration to the past
  response.cookies.set("salon", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Only send cookie over HTTPS in production
    sameSite: "strict",
    path: "/",
    expires: new Date(0),
  });

  return response; // Return the response indicating successful logout
}
