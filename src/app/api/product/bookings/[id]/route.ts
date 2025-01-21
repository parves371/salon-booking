import { createConnection } from "@/lib/db/dbConnect";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id); // Get the booking ID from the params

    if (isNaN(id)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const db = await createConnection();

    // SQL query to select booking data with JOINs
    const query = `
      SELECT 
        bookings.id AS booking_id,
        bookings.start_time,
        bookings.end_time,
        bookings.service_id,
        bookings.customer_id,
        bookings.staff_id,
        bookings.status,
        customers.name AS customer_name,
        services.name AS service_name,
        staff.position AS staff_position,
        users.name AS staff_user_name
      FROM bookings
      LEFT JOIN customers ON bookings.customer_id = customers.id
      LEFT JOIN services ON bookings.service_id = services.id
      LEFT JOIN staff ON bookings.staff_id = staff.id
      LEFT JOIN user AS users ON staff.user_id = users.id
      WHERE bookings.id = ?
    `;

    // Execute the query with the booking ID as a parameter
    const result = await db.query(query, [id]);

    // Type assertion to assume result[0] is an array
    const bookings = result[0] as Array<any>;

    if (bookings.length === 0) {
      return NextResponse.json(
        { message: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(bookings[0], { status: 200 });
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const db = await createConnection();

    const [result]: any = await db.query("DELETE FROM bookings WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "bookings not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "bookings deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting bookings:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
