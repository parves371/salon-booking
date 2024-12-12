import { QueryResult } from "mysql2";
import { createConnection } from "@/lib/db/dbConnect";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

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
    } catch (error) {
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
    const newUserQuery = "SELECT * FROM user WHERE email = ?";
    const [existingUserRows] = await db.query(newUserQuery, [email]);
    const existingUser = (
      existingUserRows as { id: string; email: string; role: string }[]
    )[0];

    if (existingUser) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User with this email already exist",
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
    const id = uuidv4();
    console.log(id);

    // Insert the new user into the database
    const insertQuery =
      "INSERT INTO user (id,name, email, password, role) VALUES (?, ?, ?, ?, ?)";
    const [insertResult] = await db.query(insertQuery, [
      id,
      name,
      email,
      hashedPassword,
      role,
    ]);

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
export async function GET() {
  try {
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
    const userQuery = "SELECT id, email, name, role FROM user WHERE email = ?";
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

    // Fetch all users in the database (excluding the password field)
    const fetchAllUsersQuery =
      "SELECT id, email, name, role, created_at FROM user";
    const [allUsersRows] = await db.query(fetchAllUsersQuery);

    const allUsers = allUsersRows as {
      id: string;
      email: string;
      name: string;
      role: string;
      created_at: string;
    }[];

    // Return all users in the response
    return new Response(
      JSON.stringify({
        success: true,
        message: "All users retrieved successfully",
        authenticatedUser,
        allUsers,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error retrieving users:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Error retrieving users" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

import { RowDataPacket } from 'mysql2';  // For correct typing

export async function PUTE(request: Request) {
  try {
    // 1. Check for authentication token in cookies
    const userToken = cookies().get("salon-admin");
    if (!userToken) {
      return new Response(
        JSON.stringify({ success: false, message: "Unauthorized user" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const tokenValue = userToken.value;

    // 2. Verify and decode the JWT token
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(tokenValue, process.env.JWT_SECRET!) as JwtPayload;
    } catch (error) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid token" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // 3. Connect to the database and fetch authenticated user
    const db = await createConnection();
    const userQuery = "SELECT id, email, role FROM user WHERE email = ?";
    const [authenticatedUserRows] = await db.query(userQuery, [decoded.email]);
    const authenticatedUser = (authenticatedUserRows as RowDataPacket[])[0];

    if (!authenticatedUser) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // 4. Parse the request body
    const reqBody = await request.json();
    const { id, name, email, password } = reqBody;

    if (!id) {
      return new Response(
        JSON.stringify({ success: false, message: "User ID is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 5. Fetch the user by ID and exclude the current user from this check
    const findUserQuery = "SELECT * FROM user WHERE id = ?";
    const [userRows] = await db.query(findUserQuery, [id]);
    const user = (userRows as RowDataPacket[])[0];

    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // 6. Fetch all users except the current user to avoid duplicate email check
    const excludeCurrentUserQuery = "SELECT * FROM user WHERE email = ? AND id != ?";
    const [existingUserRows] = await db.query(excludeCurrentUserQuery, [email, id]);
    const existingUser = (existingUserRows as RowDataPacket[])[0];

    if (existingUser) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User with this email already exists",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 7. Identify if the data from the database doesn't match the user's given email
    const fieldsToUpdate: string[] = [];
    const values: any[] = [];

    if (email && email !== user.email) {
      fieldsToUpdate.push("email = ?");
      values.push(email);
    }
    if (name && name !== user.name) {
      fieldsToUpdate.push("name = ?");
      values.push(name);
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      fieldsToUpdate.push("password = ?");
      values.push(hashedPassword);
    }

    // If no fields to update, return an error
    if (fieldsToUpdate.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "No fields to update" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 8. Execute the update query
    const updateQuery = `UPDATE user SET ${fieldsToUpdate.join(", ")} WHERE id = ?`;
    values.push(id); // Add ID as the last parameter
    const [updateResult] = await db.query(updateQuery, values);

    return new Response(
      JSON.stringify({
        success: true,
        message: "User updated successfully",
        updatedFields: { name, email, password: !!password },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Error updating user" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

