import { createConnection } from "@/lib/db/dbConnect";
import { StaffSchema } from "@/schemas/staff";
import { ResultSetHeader, RowDataPacket } from "mysql2";

// get Staff by id ---- give you 1 response

export async function GET(req: Request): Promise<Response> {
  const id = req.url.split("/").pop(); // Assuming URL pattern is like /api/staff/{id}

  if (!id || isNaN(Number(id))) {
    return new Response(
      JSON.stringify({ message: "Staff ID is required and must be a number" }),
      { status: 400 }
    );
  }

  try {
    const db = await createConnection();
    const sql = `
      SELECT Staff.id, Staff.position, Staff.available, user.name, user.email, user.role, user.skills
      FROM Staff
      JOIN user ON Staff.user_id = user.id
      WHERE Staff.id = ?;
    `;
    const [rows] = await db.query<RowDataPacket[]>(sql, [id]);

    if (rows.length === 0) {
      return new Response(JSON.stringify({ message: "Staff not found" }), {
        status: 404,
      });
    }

    const staff = rows[0];
    return new Response(
      JSON.stringify({ message: "Staff fetched successfully", data: staff }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching staff:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}

export async function PUT(req: Request): Promise<Response> {
  const id = req.url.split("/").pop();
  if (!id || isNaN(Number(id))) {
    return new Response(
      JSON.stringify({
        message: "Staff ID is required and must be a number",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const body = await req.json();
  const {
    userId,
    position,
    available,
  }: { userId: number; position: string; available: boolean } = body;

  console.log("userId", userId);
  if (!userId) {
    return new Response(JSON.stringify({ message: "User ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const db = await createConnection();
    const sql = `UPDATE Staff SET position = ?, available = ?, user_id = ? WHERE id = ?`;
    const [result] = await db.query<ResultSetHeader>(sql, [
      position,
      available,
      userId,
      id,
    ]);

    if (result.affectedRows === 0) {
      return new Response(
        JSON.stringify({ message: "Staff not found or not updated" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ message: "Staff updated successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error updating staff:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
