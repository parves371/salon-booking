import { createConnection } from "@/lib/db/dbConnect";
import { Registerchema } from "@/schemas";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Define the types for the request body and response
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


export async function POST(request: Request): Promise<Response> {
  try {
    const reqBody: RegisterRequestBody = await request.json();
    
    const validatedData = Registerchema.parse(reqBody);

    const { email, password, name, number } = validatedData;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const db = await createConnection();
    
    const emailCheckQuery = "SELECT * FROM customers WHERE email = ?";
    const [existingUser] = await db.query<any[]>(emailCheckQuery, [email]);
    
    if (existingUser && existingUser.length > 0) {
      return new Response(
        JSON.stringify({ success: false, message: "Email already exists" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    
    const sql = `INSERT INTO customers (id, profile, email, name, number, password) VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [uuidv4(), "", email, name, number, hashedPassword || null];
    await db.query(sql, values);
    


    const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
    const token = jwt.sign(
      { email, name, id: uuidv4() }, // Payload of the token
      JWT_SECRET, // Secret key
      { expiresIn: "1h" } // Token expiration time
    );
    const cookieHeader = `salon=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`; // 1-hour expiration
    
    const response: RegisterResponse = {
      success: true,
      message: "User created successfully!",
    };
    
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json","Set-Cookie": cookieHeader},
      
    });
  } catch (error) {
    console.error("Error processing request:", error);
    
    const errorResponse: RegisterResponse = {
      success: false,
      message: "Error in signup",
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
