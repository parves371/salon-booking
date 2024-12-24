import { NextResponse } from "next/server";
import { createConnection } from "@/lib/db/dbConnect";
import { RowDataPacket, ResultSetHeader } from "mysql2";

interface Service {
  id: number;
  service_name: string;
  time: string | null;
  price: number | null;
  option: boolean;
  category_name: string;
}

export async function GET(req: Request): Promise<Response> {
  // Extracting service ID from URL
  const id = req.url.split("/").pop(); // Assuming URL pattern is like /api/product/services/{id}

  if (!id || isNaN(Number(id))) {
    return NextResponse.json(
      { message: "Service ID is required and must be a number" },
      { status: 400 }
    );
  }

  try {
    // Establish database connection
    const db = await createConnection();

    // Query to fetch the service details by ID with category name
    const [rows] = await db.query<RowDataPacket[]>(
      `
      SELECT 
        services.id,
        services.name AS service_name,
        services.time,
        services.price,
        services.option,
        categories.name AS category_name
      FROM 
        services
      JOIN 
        categories
      ON 
        services.category_id = categories.id
      WHERE 
        services.id = ?
      `,
      [id]
    );

    // If no rows found for the service ID
    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Service not found" },
        { status: 404 }
      );
    }

    // Map the database result to your Service interface
    const service: Service = {
      id: rows[0].id,
      service_name: rows[0].service_name,
      time: rows[0].time,
      price: rows[0].price,
      option: rows[0].option === 1, // Ensure the `option` field is correctly parsed as a boolean
      category_name: rows[0].category_name,
    };

    // Respond with the data
    return NextResponse.json({ data: service }, { status: 200 });
  } catch (error) {
    console.error("Error fetching service:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request): Promise<Response> {
  const id = req.url.split("/").pop(); // Extract ID from URL
  if (!id || isNaN(Number(id))) {
    return NextResponse.json(
      { message: "Service ID is required and must be a number" },
      { status: 400 }
    );
  }

  const { service_name, price, time, option, category_id } = await req.json();

  // Validate the input fields
  if (!service_name || typeof service_name !== "string") {
    return NextResponse.json(
      { message: "Valid service_name is required" },
      { status: 400 }
    );
  }
  if (!price || isNaN(Number(price))) {
    return NextResponse.json(
      { message: "Valid price is required" },
      { status: 400 }
    );
  }
  if (!time || typeof time !== "string") {
    return NextResponse.json(
      { message: "Valid time is required" },
      { status: 400 }
    );
  }
  if (typeof option !== "boolean") {
    return NextResponse.json(
      { message: "Valid option (boolean) is required" },
      { status: 400 }
    );
  }
  if (!category_id || isNaN(Number(category_id))) {
    return NextResponse.json(
      { message: "Valid category_id is required" },
      { status: 400 }
    );
  }

  try {
    const db = await createConnection();

    // Update the service in the database
    const [result] = await db.query<ResultSetHeader>(
      `
      UPDATE services
      SET name = ?, price = ?, time = ?, option = ?, category_id = ?
      WHERE id = ?
      `,
      [service_name, price, time, option, category_id, id]
    );

    // Check if any rows were affected
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Service not found or not updated" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Service updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
