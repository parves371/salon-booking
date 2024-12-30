import { createConnection } from "@/lib/db/dbConnect"; // Ensure this points to your DB helper
import { StaffSchema } from "@/schemas/staff";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { position, available } = await StaffSchema.parseAsync(body);
    const { userId }: { userId: number } = body;
    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const db = await createConnection();

    const [result]: any = await db.query(
      "INSERT INTO staff (position,available,user_id) VALUES (?,?,?)",
      [position, available, userId]
    );

    return NextResponse.json(
      {
        message: "Staff created successfully",
        id: result.insertId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding category:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const db = await createConnection();
    const sql = `
    SELECT Staff.id, Staff.position, Staff.available, user.name, user.role, user.skills
    FROM Staff
    JOIN user ON Staff.user_id = user.id;
  `;
    const [result]: any = await db.query(sql);
    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("Error fetching staff:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
