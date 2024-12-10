import { createConnection } from "@/lib/db/dbConnect";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Define the types for the request body and response
interface LoginRequestBody {
  email: string;
  password: string;
}

interface User {
  id: string;
  email: string;
  password: string;
  name: string;
}

export async function POST(request: Request) {
  try {
    const reqBody: LoginRequestBody = await request.json();
    const { email, password } = reqBody;

    console.log(email, password);

    const db = await createConnection();

    const sql = "SELECT * FROM user WHERE email = ?";
    const [rows] = await db.query(sql, [email]);

    const user = (
      rows as { id: string; email: string; password: string; name: string }[]
    )[0];

    console.log(user);

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    // const isPasswordValid = await bcrypt.compare(password, user.password);

    const isPasswordValid = password === user.password;

    if (!isPasswordValid) {
      return new Response(JSON.stringify({ message: "Invalid password" }), {
        status: 401,
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    const response = new Response(
      JSON.stringify({
        message: "Login successful",
        token,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );

    response.headers.set(
      "Set-Cookie",
      `salon-admin=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`
    );

    return response;
  } catch (error) {
    console.error("Error during login process:", error);
    return new Response(JSON.stringify({ message: "Error during login" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
