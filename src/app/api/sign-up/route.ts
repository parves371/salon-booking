import { createConnection } from "@/lib/db/dbConnect";
import bcrypt from "bcryptjs";
import { RowDataPacket } from "mysql2"; // Import RowDataPacket for typing query results

interface RegisterResponse {
  success: boolean;
  message: string;
  token?: string;
}

import fs from "fs";
import path from "path";

export async function POST(request: Request): Promise<Response> {
  try {
    // 1) Parse the multi-part form data with the built-in Web API
    const formData = await request.formData();
    const email = formData.get("email");
    const password = formData.get("password");
    const name = formData.get("name");
    const number = formData.get("number");
    const date = formData.get("date");
    const address = formData.get("address");
    const avatar = formData.get("avatar");

    if (
      !email ||
      typeof email !== "string" ||
      !password ||
      typeof password !== "string" ||
      !name ||
      typeof name !== "string" ||
      (number && typeof number !== "string") ||
      (date && typeof date !== "string") ||
      (address && typeof address !== "string") ||
      (avatar && !(avatar instanceof File))
    ) {
      return new Response(
        JSON.stringify({ success: false, message: "All fields are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 5) If an avatar file is provided, save it to `public/uploads`
    let avatarPath: string | null = null;

    if (avatar && avatar instanceof File && avatar.size > 0) {
      // Convert from Web File to Buffer
      const bytes = await avatar.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Pick a unique filename, or keep original name
      // e.g. "someFile.png"
      const originalFilename = avatar.name;
      const ext = path.extname(originalFilename) || "";
      const newFilename = `avatar-${name}-${Date.now()}${ext}`;
      const customersDir = path.join(process.cwd(), "public", "customers");
      if (!fs.existsSync(customersDir)) {
        fs.mkdirSync(customersDir, { recursive: true });
      }

      const filePath = path.join(customersDir, newFilename);

      // Write file to disk
      fs.writeFileSync(filePath, buffer);

      // We'll store the relative path in DB (e.g. "/uploads/avatar-xxxx.png")
      avatarPath = "/customers/" + newFilename;
    }

    const db = await createConnection();

    const hashedPassword = await bcrypt.hash(password, 10);

    const emailCheckQuery = "SELECT email FROM customers WHERE email = ?";
    const [existingUser] = await db.query<RowDataPacket[]>(emailCheckQuery, [
      email,
    ]);

    if (existingUser.length > 0) {
      return new Response(
        JSON.stringify({ success: false, message: "Email already exists" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Insert the new user with the generated UUID
    const sql = `INSERT INTO customers (profile, email, name, number, password,date_of_birth,	address) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      avatarPath,
      email,
      name,
      number,
      hashedPassword,
      date,
      address,
    ];
    await db.query(sql, values);

    const response: RegisterResponse = {
      success: true,
      message: "User created successfully!",
    };

    return new Response(JSON.stringify(response), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    console.error("Error processing request:", error);

    const errorDetails =
      error instanceof Error ? error.message : JSON.stringify(error);

    const errorResponse: RegisterResponse = {
      success: false,
      message: "Error in signup: " + errorDetails,
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
