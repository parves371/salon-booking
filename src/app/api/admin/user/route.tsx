import { createConnection } from "@/lib/db/dbConnect";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";

// Define the types for the request body and response
interface LoginRequestBody {
  email: string;
  password: string;
  name: string;
  role: "SuperAdmin" | "Admin" | "Manager" | "Employee";
}

export async function POST(request: Request) {
  try {
    const reqBody: LoginRequestBody = await request.json();
    const { email, password, name, role } = reqBody;
    if (!name || !email || !password || !role) {
      return new Response(
        JSON.stringify({ success: false, message: "All fields are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    const userToken = cookies().get("salon-admin");
    if (!userToken) {
      return new Response(JSON.stringify({ message: "unauthorized user" }), {
        status: 404,
      });
    }
    const tokenValue = userToken.value;
    const decoded = jwt.verify(
      tokenValue,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    console.log("Decoded Token:", decoded);
    const db = await createConnection();

    const sql = "SELECT * FROM user WHERE email = ?";
    const [rows] = await db.query(sql, [decoded?.email]);
    const [existingUserBYEmail] = await db.query(sql, [email]);


    const existingUser = (
        existingUserBYEmail as { id: string; email: string; password: string; name: string }[]
      )[0];

    if (existingUser) {
      return new Response(
        JSON.stringify({ success: false, message: "User already exists" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const user = (
      rows as { id: string; email: string; password: string; name: string }[]
    )[0];

    if (!user) {
      return new Response(JSON.stringify({ message: "unauthorized user" }), {
        status: 404,
      });
    }
    const hasedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO user (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hasedPassword, role]
    );

    return new Response(
      JSON.stringify({ success: true, message: "User created successfully" }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error during login process:", error);
    return new Response(
      JSON.stringify({ success: false, message: "error in creating user" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
