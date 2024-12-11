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
    const fetchAllUsersQuery = "SELECT id, email, name, role, created_at FROM user";
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

export async function PUTE(request: Request) {
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

    // Check if the authenticated user is a SuperAdmin
    const userQuery = "SELECT id, email, role FROM user WHERE email = ?";
    const [authenticatedUserRows] = await db.query(userQuery, [decoded.email]);
    const authenticatedUser = (
      authenticatedUserRows as { id: string; email: string; role: string }[]
    )[0];

    if (!authenticatedUser || authenticatedUser.role !== "SuperAdmin") {
      return new Response(
        JSON.stringify({ success: false, message: "Access denied. SuperAdmin only." }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    // Parse the request body
    const reqBody = await request.json();
    const { id, name, email, role, password } = reqBody;

    // Ensure an ID is provided
    if (!id) {
      return new Response(
        JSON.stringify({ success: false, message: "User ID is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Fetch the user to update
    const findUserQuery = "SELECT * FROM user WHERE id = ?";
    const [userRows] = await db.query(findUserQuery, [id]);
    const user = (
      userRows as { id: string; email: string; name: string; role: string }[]
    )[0];

    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Build the update query dynamically based on provided fields
    const fieldsToUpdate: string[] = [];
    const values: any[] = [];

    if (name) {
      fieldsToUpdate.push("name = ?");
      values.push(name);
    }
    if (email) {
      fieldsToUpdate.push("email = ?");
      values.push(email);
    }
    if (role) {
      fieldsToUpdate.push("role = ?");
      values.push(role);
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

    // Execute the update query
    const updateQuery = `UPDATE user SET ${fieldsToUpdate.join(
      ", "
    )} WHERE id = ?`;
    values.push(id); // Add ID as the last parameter
    const [updateResult] = await db.query(updateQuery, values);

    console.log("Update Result:", updateResult);

    return new Response(
      JSON.stringify({
        success: true,
        message: "User updated successfully",
        updatedFields: { name, email, role, password: !!password },
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

