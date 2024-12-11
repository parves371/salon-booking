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
    // Parse request body
    const reqBody: LoginRequestBody = await request.json();
    const { email, password, name, role } = reqBody;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return new Response(
        JSON.stringify({ success: false, message: "All fields are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Check for authentication token in cookies
    const userToken = cookies().get("salon-admin");
    if (!userToken) {
      return new Response(
        JSON.stringify({ success: false, message: "Unauthorized user" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const tokenValue = userToken.value;

    // Verify and decode the JWT token
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(tokenValue, process.env.JWT_SECRET!) as JwtPayload;
      console.log("Decoded Token:", decoded);
    } catch (error) {
      console.error("Invalid token:", error);
      return new Response(
        JSON.stringify({ success: false, message: "Invalid token" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Connect to the database
    const db = await createConnection();

    // Check if the authenticated user exists
    const userQuery = "SELECT * FROM user WHERE email = ?";
    const [authenticatedUserRows] = await db.query(userQuery, [decoded.email]);
    const authenticatedUser = (
      authenticatedUserRows as { id: string; email: string; role: string }[]
    )[0];

    if (!authenticatedUser) {
      return new Response(
        JSON.stringify({ success: false, message: "Unauthorized user" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if the new user already exists (by email and role)
    const newUserQuery = "SELECT * FROM user WHERE email = ? AND role = ?";
    const [existingUserRows] = await db.query(newUserQuery, [email, role]);
    const existingUser = (
      existingUserRows as { id: string; email: string; role: string }[]
    )[0];

    if (existingUser) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User with this email and role already exists",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const duplicateEmailQuery = "SELECT * FROM user WHERE email = ?";
    const [duplicateEmailRows] = await db.query(duplicateEmailQuery, [email]);
    const duplicateEmailUser = (
      duplicateEmailRows as { id: string; email: string; role: string }[]
    )[0];

    if (duplicateEmailUser) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User with this email already exists",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Hash the password for the new user
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const insertQuery =
      "INSERT INTO user (name, email, password, role) VALUES (?, ?, ?, ?)";
    const [insertResult] = await db.query(insertQuery, [
      name,
      email,
      hashedPassword,
      role,
    ]);

    console.log("New User Insert Result:", insertResult);

    return new Response(
      JSON.stringify({ success: true, message: "User created successfully" }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error during user creation:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Error creating user" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
