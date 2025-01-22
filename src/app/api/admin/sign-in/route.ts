import { createConnection } from "@/lib/db/dbConnect";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Define the types for the request body and response
interface LoginRequestBody {
  email: string;
  password: string;
}

export async function POST(request: Request) {
  try {
    const reqBody: LoginRequestBody = await request.json();
    const { email, password } = reqBody;

    // 1. Connect to the database
    const db = await createConnection();

    // 2. Query to fetch the user by email
    const sql = "SELECT * FROM user WHERE email = ?";
    const [rows] = await db.query(sql, [email]);

    const user = (
      rows as { id: string; email: string; password: string; name: string }[]
    )[0];

    // 3. Check if user exists
    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    // 4. Compare provided password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return new Response(JSON.stringify({ message: "Invalid password" }), {
        status: 401,
      });
    }

    // 5. Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    // 6. Create response with JWT token
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

    // 7. Set the JWT token in the cookies
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
