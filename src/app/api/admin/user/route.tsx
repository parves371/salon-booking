import { createConnection } from "@/lib/db/dbConnect";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";

import {
  authenticateUserByTokenEmail,
  existingUserByEmail,
} from "@/lib/user/authenticate";
import { RowDataPacket } from "mysql2"; // For correct typing

// Define the types for the request body and response
interface LoginRequestBody {
  email: string;
  password: string;
  name: string;
  role: "SuperAdmin" | "Admin" | "Manager" | "Employee";
}

import { AdminAuthenticate } from "@/lib/user/auth";
import formidable from "formidable";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";
import Busboy from 'busboy';
export const config = {
  runtime: "nodejs", // Use Node.js runtime
};

export async function POST(request: Request) {
  const uploadDir = path.join(process.cwd(), "public/professionals");

  // Ensure the directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const busboy = new Busboy({ headers: request.headers });

  const fields: Record<string, string> = {};
  let fileUrl = "";

  return new Promise<NextResponse>((resolve, reject) => {
    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
      const uniqueFilename = `${Date.now()}-${filename}`;
      const saveTo = path.join(uploadDir, uniqueFilename);
      const writeStream = fs.createWriteStream(saveTo);

      file.pipe(writeStream);

      writeStream.on("close", () => {
        fileUrl = `/professionals/${uniqueFilename}`;
      });
    });

    busboy.on("field", (fieldname, val) => {
      fields[fieldname] = val;
    });

    busboy.on("finish", async () => {
      const { email, password, name, role } = fields;

      // Validate required fields
      if (!name || !email || !password || !role) {
        return resolve(
          NextResponse.json(
            { success: false, message: "All fields are required" },
            { status: 400 }
          )
        );
      }

      // Validate uploaded file
      if (!fileUrl) {
        return resolve(
          NextResponse.json(
            { success: false, message: "No file uploaded" },
            { status: 400 }
          )
        );
      }

      try {
        // Validate authentication token
        const cookieHeader = request.headers.get("cookie") || "";
        const cookiesObj: Record<string, string> = Object.fromEntries(
          cookieHeader.split("; ").map((c) => c.split("="))
        );

        const userToken = cookiesObj["salon-admin"];
        if (!userToken) {
          return resolve(
            NextResponse.json(
              { success: false, message: "Unauthorized user" },
              { status: 401 }
            )
          );
        }

        // Verify and decode the JWT token
        let decoded: JwtPayload;
        try {
          decoded = jwt.verify(
            userToken,
            process.env.JWT_SECRET!
          ) as JwtPayload;
        } catch (error) {
          return resolve(
            NextResponse.json(
              { success: false, message: "Invalid token" },
              { status: 401 }
            )
          );
        }

        // Connect to the database
        const db = await createConnection();

        // Check if the authenticated user exists
        const authenticatedUser = await authenticateUserByTokenEmail(
          decoded.email
        );
        if (authenticatedUser.role !== "superadmin") {
          return resolve(
            NextResponse.json(
              {
                success: false,
                message: "Unauthorized user or user role has to be SuperAdmin",
              },
              { status: 403 }
            )
          );
        }

        // Check if the new user already exists (by email and role)
        const existingUser = await existingUserByEmail(email);
        if (existingUser) {
          return resolve(
            NextResponse.json(
              {
                success: false,
                message: "User with this email already exists",
              },
              { status: 400 }
            )
          );
        }

        // Hash the password for the new user
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database, including the file URL
        const insertQuery =
          "INSERT INTO user (name, email, password, role, file_url) VALUES (?, ?, ?, ?, ?)";
        await db.query(insertQuery, [
          name,
          email,
          hashedPassword,
          role,
          fileUrl,
        ]);

        return resolve(
          NextResponse.json(
            { success: true, message: "User created successfully", fileUrl },
            { status: 201 }
          )
        );
      } catch (error) {
        console.error("Error during user creation:", error);
        return resolve(
          NextResponse.json(
            { success: false, message: "Error creating user" },
            { status: 500 }
          )
        );
      }
    });

    request.body?.pipe(busboy);
  });
}

export async function GET(request: Request) {
  try {
    // { role: '?', id: ? }
    const { user, error } = await AdminAuthenticate(request);
    if (error) {
      return new Response(JSON.stringify({ error }), { status: 401 });
    }

    // Connect to the database
    const db = await createConnection();

    // Check if the authenticated user exists
    const userQuery = "SELECT id, email, name, role FROM user WHERE id = ?";
    const [authenticatedUserRows] = await db.query(userQuery, [user?.id]);
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
    const excludeCurrentUserQuery =
      "SELECT * FROM user WHERE email = ? AND id != ?";
    const [existingUserRows] = await db.query(excludeCurrentUserQuery, [
      email,
      id,
    ]);
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
    const updateQuery = `UPDATE user SET ${fieldsToUpdate.join(
      ", "
    )} WHERE id = ?`;
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
