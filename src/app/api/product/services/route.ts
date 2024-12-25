import { createConnection } from '@/lib/db/dbConnect';
import { NextResponse } from 'next/server';

// Define the type for the incoming request body
interface AddServiceRequest {
  categoryId: number;
  name: string;
  time: string;
  price: number;
  option?: boolean;
}

export async function POST(req: Request): Promise<Response> {
  const { categoryId, name, time, price, option }: AddServiceRequest = await req.json();
  console.log(option );
  try {

    // Validate required fields
    if (!categoryId || !name || !time || !price) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Establish database connection
    const db = await createConnection();

    // Insert the new service into the database
    await db.query(
      `INSERT INTO services (category_id, name, time, price, option) VALUES (?, ?, ?, ?, ?)`,
      [categoryId, name, time, price, option ? 1 : 0]
    );

    // Respond with success message
    return NextResponse.json({ message: 'Service added successfully' });
  } catch (error) {
    console.error('Error adding service:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function GET(): Promise<Response> {
  try {
    // Establish database connection
    const db = await createConnection();

    // Query to fetch services with category names
    const [rows] = await db.query(`
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
    `);

    // Respond with the data
    return NextResponse.json(
      { data: rows },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
