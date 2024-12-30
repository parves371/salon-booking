/**
 * Fetch user data by email
 * @param {string} email - The email of the user to find
 * @returns {Promise<Object|null>} - Returns the user object or null if not found
 */

import { RowDataPacket } from "mysql2";
import { createConnection } from "../db/dbConnect";

// Define the User type for better type safety
// Define the User type for better type safety
type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "superadmin" | "admin" | "manager" | "employee";
};

export async function getAdminUserByEmail(email: string): Promise<User | null> {
  try {
    const db = await createConnection();

    // Query to check if the email exists but with a different ID
    const checkEmailQuery = "SELECT * FROM user WHERE email = ?";
    const [existingUserRows] = await db.query(checkEmailQuery, [email]);

    // Ensure existingUserRows is an array and safely access the first result
    const existingUser =
      existingUserRows &&
      Array.isArray(existingUserRows) &&
      existingUserRows.length > 0
        ? (existingUserRows[0] as User) // Cast the first result as User
        : null;

    // Close the connection
    await db.end();

    return existingUser;
  } catch (error) {
    console.error("Error fetching user by email and id:", error);
    throw new Error("Database query failed");
  }
}

/**
 * Fetch user data by ID
 * @param {string} id - The ID of the user to find
 * @returns {Promise<Object|null>} - Returns the user object or null if not found
 */
export async function getAdminUserByID(id: string): Promise<User | null> {
  try {
    const db = await createConnection();

    // Query to check if the email exists but with a different ID
    const checkEmailQuery = "SELECT * FROM user WHERE id = ?";
    const [existingUserRows] = await db.query(checkEmailQuery, [id]);

    // Ensure existingUserRows is an array and safely access the first result
    const existingUser =
      existingUserRows &&
      Array.isArray(existingUserRows) &&
      existingUserRows.length > 0
        ? (existingUserRows[0] as User) // Cast the first result as User
        : null;

    // Close the connection
    await db.end();

    return existingUser;
  } catch (error) {
    console.error("Error fetching user by email and id:", error);
    throw new Error("Database query failed");
  }
}
