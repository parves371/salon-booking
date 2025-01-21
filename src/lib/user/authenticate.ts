// pages/api/user/authenticate.ts
import jwt, { JwtPayload } from "jsonwebtoken";
import { createConnection } from "../db/dbConnect";

interface DecodedToken extends JwtPayload {
  email: string;
}

export async function verifyToken(token: string): Promise<JwtPayload | null> {
  return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
}

export async function authenticateUserByTokenEmail(email: string) {
  const db = await createConnection();
  const query = "SELECT * FROM user WHERE email = ?";
  const [rows] = await db.query(query, [email]);
  const authenticatedUser = (
    rows as { id: string; name: string; email: string; role: string }[]
  )[0];

  return authenticatedUser; // Adjust according to actual DB response type
}

export async function existingUserByEmail(email: string) {
  const db = await createConnection();
  const newUserQuery = "SELECT * FROM user WHERE email = ?";
  const [existingUserRows] = await db.query(newUserQuery, [email]);
  const existingUser = (
    existingUserRows as { id: string; email: string; role: string }[]
  )[0];

  return existingUser; // Adjust according to actual DB response type
}