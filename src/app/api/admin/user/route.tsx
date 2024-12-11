import { createConnection } from "@/lib/db/dbConnect";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";

// Define the types for the request body and response
interface LoginRequestBody {
  creator: string;
  email: string;
  password: string;
  name: string;
  role: "admin" | "user" | "superadmin" | "employee";
}

export async function POST(request: Request) {
  try {
    const reqBody: LoginRequestBody = await request.json();
    const { email, password, creator, name, role } = reqBody;
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
    const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET!) as JwtPayload;

    console.log(email, password, creator, name, role, decoded);

    

    const db = await createConnection();

    const sql = "SELECT * FROM user WHERE email = ?";
    const [rows] = await db.query(sql, [decoded?.email]);

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
      JSON.stringify({ success: false, message: "Error during login" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
