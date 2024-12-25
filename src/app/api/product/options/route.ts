import { createConnection } from "@/lib/db/dbConnect";
import { NextResponse } from "next/server";

// Define the structure of the incoming request body
interface AddOptionRequest {
  serviceId: number;
  name: string;
  time: string;
  price: number;
}

export async function POST(req: Request): Promise<Response> {
  try {
    // Parse and validate the incoming request body
    const body: AddOptionRequest = await req.json();

    const { serviceId, name, time, price } = body;

    // Check if all required fields are provided
    if (!serviceId || !name || !time || !price) {
      return NextResponse.json(
        {
          message:
            "All required fields (serviceId, name, time, price) must be provided.",
        },
        { status: 400 }
      );
    }

    // Establish a database connection
    const db = await createConnection();

    // Insert the new option into the options table in the database
    await db.query(
      `INSERT INTO options (service_id, name, time, price) VALUES (?, ?, ?, ?)`,
      [serviceId, name, time, price]
    );

    // Respond with a success message
    return NextResponse.json({ message: "Option added successfully" });
  } catch (error) {
    console.error("Error while adding option:", error);

    // Handle unexpected errors and return a 500 status code
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}

export async function GET(): Promise<Response> {
  try {
    // Establish database connection
    const db = await createConnection();

    // Query to fetch options with service and category names
    const [rows] = await db.query(`
      SELECT 
        options.id,
        options.name AS option_name,
        options.time AS option_time,
        options.price AS option_price,
        services.name AS service_name,
        categories.name AS category_name
      FROM 
        options
      JOIN 
        services 
      ON 
        options.service_id = services.id
      JOIN 
        categories 
      ON 
        services.category_id = categories.id
    `);

    // Respond with the data
    return NextResponse.json({ data: rows }, { status: 200 });
  } catch (error) {
    console.error("Error fetching options:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
