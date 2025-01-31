import { createConnection } from "@/lib/db/dbConnect"; // Ensure this points to your DB helper
import { StaffSchema } from "@/schemas/staff";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { position, available } = await StaffSchema.parseAsync(body);
    const { userId, skills }: { userId: number; skills: string[] } = body;
    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const db = await createConnection();

    const [result]: any = await db.query(
      "INSERT INTO staff (position,available,user_id,skills) VALUES (?,?,?,?)",
      [position, available, userId, skills.toString()]
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
    // Parse the query parameters
    const url = new URL(req.url);
    const filterSkills = url.searchParams.get("skills"); // E.g., "style 1,style 2"

    const db = await createConnection();
    let sql = `
      SELECT Staff.id, Staff.position, Staff.available, Staff.skills, user.name, user.role, user.avatar_path	
      FROM Staff
      JOIN user ON Staff.user_id = user.id
    `;

    let values: string[] = [];

    // Add filtering conditions if `skills` is provided
    if (filterSkills) {
      const filters = filterSkills.split(",").map((skill) => skill.trim());
      // WHERE Staff.skills LIKE ? AND Staff.skills LIKE ? AND Staff.skills LIKE ?
      const conditions = filters.map(() => "Staff.skills LIKE ?").join(" AND ");
      sql += ` WHERE ${conditions}`;

      // if the skill is "Python", the value becomes "%Python%", allowing partial matches in the database.
      values = filters.map((skill) => `%${skill}%`);
    }

    // Execute the query with or without filters
    const [result]: any = await db.query(sql, values);

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("Error fetching staff:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
