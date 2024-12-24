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
  try {
    const { categoryId, name, time, price, option }: AddServiceRequest = await req.json();

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

    // Query to fetch all services
    const [rows] = await db.query(`SELECT * FROM services`);

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

export async function DELETE(req: Request): Promise<Response> {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    // Validate the ID parameter
    if (!id) {
      return NextResponse.json(
        { message: 'Service ID is required' },
        { status: 400 }
      );
    }

    // Establish database connection
    const db = await createConnection();

    // Execute delete query
    const [result]: any = await db.query(
      `DELETE FROM services WHERE id = ?`,
      [id]
    );

    // Check if a row was deleted
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: 'Service not found or already deleted' },
        { status: 404 }
      );
    }

    // Respond with success message
    return NextResponse.json(
      { message: 'Service deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}