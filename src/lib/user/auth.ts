import { createConnection } from "@/lib/db/dbConnect";
import { RowDataPacket } from "mysql2"; // Import RowDataPacket for typing
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET!;
const SECRET_KEY_ADMIN = process.env.JWT_ADMIN_SECRET!;

// Define the Customer interface (excluding the password for safety)
interface Customer {
  id: string;
  email: string;
  name: string;
}

// Function to decode JWT token and authenticate user
export const authenticate = async (req: Request) => {
  const cookies = req.headers.get("cookie");
  const token = cookies
    ?.split("; ")
    .find((cookie) => cookie.startsWith("salon="))
    ?.split("=")[1];

  if (!token) {
    return { error: "No token provided" };
  }

  // Decode and verify the token
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const userId = (decoded as { id: string }).id;

    // Fetch the user profile from the database
    const db = await createConnection();

    // Query the database, typing the result as RowDataPacket[]
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT id, email, name, profile, number FROM customers WHERE id = ?",
      [userId]
    );

    const user = rows[0] as Customer; // Cast the first row to a Customer

    if (!user) {
      return { error: "User not found" };
    }

    return { user }; // Return the user data without the password
  } catch (error) {
    console.error("JWT verification error:", error);
    return { error: "Invalid or expired token" };
  }
};
export const AdminAuthenticate = async (req: Request) => {
  const cookies = req.headers.get("cookie");
  const token = cookies
    ?.split("; ")
    .find((cookie) => cookie.startsWith("salon-admin="))
    ?.split("=")[1];

  if (!token) {
    return { error: "No token provided" };
  }

  // Decode and verify the token
  try {
    const decoded = jwt.verify(token, SECRET_KEY_ADMIN);
    const userId = (decoded as { id: string }).id;
    const userEmail = (decoded as { email: string }).email;

    // Fetch the user profile from the database
    const db = await createConnection();

    // Query the database, typing the result as RowDataPacket[]
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT role, id, email FROM user WHERE id = ?",
      [userId]
    );

    const user = rows[0] as Customer; // Cast the first row to a Customer

    if (!user) {
      return { error: "User not found" };
    }

    return { user, userEmail }; // Return the user data without the password
  } catch (error) {
    console.error("JWT verification error:", error);
    return { error: "Invalid or expired token" };
  }
};
