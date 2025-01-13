import { createConnection } from "@/lib/db/dbConnect";
import { ResultSetHeader } from "mysql2";

export async function PUT(req: Request): Promise<Response> {
  const id = req.url.split("/").pop(); // Extract ID from URL
  if (!id || isNaN(Number(id))) {
    return new Response(
      JSON.stringify({
        message: "Bookings ID is required and must be a number",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const body = await req.json();
  const { status } = body;

  if (!status) {
    return new Response(JSON.stringify({ message: "status is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const db = await createConnection();

    // Update the category in the database
    const [result] = await db.query<ResultSetHeader>(
      `UPDATE bookings SET status = ? WHERE id = ?`,
      [status, id]
    );

    // Check if any rows were affected
    if (result.affectedRows === 0) {
      return new Response(
        JSON.stringify({ message: "Category not found or not updated" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ message: "Category updated successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error updating category:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
