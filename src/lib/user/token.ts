import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
};

export const getTokenFromCookies = (token: string) => {
  const userToken = cookies().get(token);
  if (!userToken) {
    return new Response(
      JSON.stringify({ success: false, message: "Unauthorized user" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  return userToken;
};
