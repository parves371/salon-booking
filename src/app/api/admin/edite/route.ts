import { createConnection } from "@/lib/db/dbConnect";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
export async function POST(request: Request) {
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
        return new Response(
          JSON.stringify({ success: false, message: "Invalid token" }),
          { status: 401, headers: { "Content-Type": "application/json" } }
        );
      }
  
      // Parse the request body to get the user ID
      const reqBody = await request.json();
      const { id } = reqBody;
  
      if (!id) {
        return new Response(
          JSON.stringify({ success: false, message: "User ID is required" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
  
      // Connect to the database
      const db = await createConnection();
  
      // Fetch user information by ID
      const userQuery = "SELECT id, email, name, role, created_at FROM user WHERE id = ?";
      const [userRows] = await db.query(userQuery, [id]);
  
      const user = (
        userRows as {
          id: string;
          email: string;
          name: string;
          role: string;
          created_at: string;
        }[]
      )[0];
  
      if (!user) {
        return new Response(
          JSON.stringify({ success: false, message: "User not found" }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }
  
      // Return user information in the response
      return new Response(
        JSON.stringify({
          success: true,
          message: "User retrieved successfully",
          user,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      console.error("Error retrieving user information:", error);
      return new Response(
        JSON.stringify({ success: false, message: "Error retrieving user" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
  