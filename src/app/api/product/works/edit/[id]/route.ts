import { createConnection } from "@/lib/db/dbConnect";
import { ResultSetHeader, RowDataPacket } from "mysql2";

// get option by id ---- give you 1 response
export async function GET(req: Request): Promise<Response> {
  const id = req.url.split("/").pop(); // Assuming URL pattern is like /api/product/catgory/{id}

  if (!id || isNaN(Number(id))) {
    return Response.json(
      { message: "option ID is required and must be a number" },
      { status: 400 }
    );
  }

  try {
    const db = await createConnection();

    // Query to fetch the category by ID
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT * FROM options WHERE id = ?`,
      [id]
    );

    // If no category is found with the given ID
    if (rows.length === 0) {
      return Response.json({ message: "option not found" }, { status: 400 });
    }

    // If a category is found, respond with the category data
    const category = rows[0];

    return Response.json(
      { message: "option fetched successfully", data: category },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching option:", error);
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

  const { name, price, time, services_id } = await req.json();

  console.log("askdlasldj",{services_id})

  // Validate the input fields
  if (!name || typeof name !== "string") {
    return Response.json(
      { message: "Valid service_name is required" },
      { status: 400 }
    );
  }
  if (!price || isNaN(Number(price))) {
    return Response.json(
      { message: "Valid price is required" },
      { status: 400 }
    );
  }
  if (!time || typeof time !== "string") {
    return Response.json(
      { message: "Valid time is required" },
      { status: 400 }
    );
  }

  if (!services_id || isNaN(Number(services_id))) {
    return Response.json(
      { message: "Valid category_id is required" },
      { status: 400 }
    );
  }

  try {
    const db = await createConnection();

    // Update the category in the database
    const [result] = await db.query<ResultSetHeader>(
      `
      UPDATE options
      SET name = ?, price = ?, time = ?, service_id = ?
      WHERE id = ?
      `,
      [name, price, time, services_id, id]
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
