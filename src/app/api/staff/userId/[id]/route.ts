import { createConnection } from "@/lib/db/dbConnect"; // Make sure this is set up to connect to your DB
import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";

// Define the expected structure of the staff data
interface StaffDetails extends RowDataPacket {
  staff_id: number;
  user_id: number;
  position: string;
  available: boolean;
  skills: string | null;
  user_name: string;
  role: string;
  email: string;
  avatar_path: string | null;
  created_at: string;
  user_skills: string | null;
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { message: "User ID is required" },
      { status: 400 }
    );
  }

  try {
    const connection = await createConnection();

    // Query to fetch staff details by user_id
    const [rows] = await connection.execute<StaffDetails[]>(
      `
      SELECT 
        staff.id AS staff_id,
        staff.user_id,
        staff.position,
        staff.available,
        staff.skills,
        user.name AS user_name,
        user.role,
        user.email,
        user.avatar_path,
        user.created_at,
        user.skills AS user_skills
      FROM 
        staff
      INNER JOIN 
        user ON staff.user_id = user.id
      WHERE 
        staff.user_id = ?;
      `,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "No staff found for the given user ID." },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error("Error fetching staff details:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
