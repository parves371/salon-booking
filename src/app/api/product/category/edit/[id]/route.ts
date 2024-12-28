import { createConnection } from "@/lib/db/dbConnect";
import { ResultSetHeader, RowDataPacket } from "mysql2";



// get Category by id ---- give you 1 response
export async function GET(req: Request): Promise<Response> {
  const id = req.url.split("/").pop(); // Assuming URL pattern is like /api/product/catgory/{id}

  if (!id || isNaN(Number(id))) {
    return Response.json(
      { message: "Category ID is required and must be a number" },
      { status: 400 }
    );
  }

  try {
    const db = await createConnection();

    // Query to fetch the category by ID
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT id, name FROM categories WHERE id = ?`,
      [id]
    );

    // If no category is found with the given ID
    if (rows.length === 0) {
      return Response.json({ message: "Category not found" }, { status: 400 });
    }

    // If a category is found, respond with the category data
    const category = rows[0];

    return Response.json(
      { message: "Category fetched successfully", data: category },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching category:", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request): Promise<Response> {
  const id = req.url.split("/").pop(); // Extract ID from URL
  if (!id || isNaN(Number(id))) {
    return new Response(
      JSON.stringify({
        message: "Category ID is required and must be a number",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const body = await req.json();
  const { name } = body;

  if (!name) {
    return new Response(
      JSON.stringify({ message: "New category name is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const db = await createConnection();

    // Update the category in the database
    const [result] = await db.query<ResultSetHeader>(
      `UPDATE categories SET name = ? WHERE id = ?`,
      [name, id]
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
