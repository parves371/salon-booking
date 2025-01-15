import { createConnection } from "@/lib/db/dbConnect";
import { Registerchema } from "@/schemas";
import bcrypt from "bcryptjs";
import { RowDataPacket } from "mysql2"; // Import RowDataPacket for typing query results
interface RegisterRequestBody {
  email: string;
  password: string;
  name: string;
  number?: string | null;
}

interface RegisterResponse {
  success: boolean;
  message: string;
  token?: string;
}

interface CustomerRow {
  email: string;
}

export async function POST(request: Request): Promise<Response> {
  try {
    const reqBody: RegisterRequestBody = await request.json();
    const db = await createConnection();

    const validatedData = Registerchema.parse(reqBody);
    const { email, password, name, number, date } = validatedData;
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

    console.log();

    // Insert the new user with the generated UUID
    const sql = `INSERT INTO customers (profile, email, name, number, password,date_of_birth) VALUES (?, ?, ?, ?, ?, ?)`;
    const values = ["", email, name, number, hashedPassword, date];
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
