import { createConnection } from "@/lib/db/dbConnect";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id); // Get the booking ID from the params
    console.log("Received ID:", params.id);

    if (isNaN(id)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const db = await createConnection();

    // SQL query to select booking data with JOINs
    const query = `
      SELECT 
        bs.id AS service_id,
        bs.booking_id,
        b.customer_id,
        bs.staff_id,
        bs.services_id,
        services.name AS service_name,
        bs.start_time,
        bs.end_time,
        bs.price AS service_price,
        bs.status AS service_status,
        bs.discount AS service_discount,
        bs.created_at AS service_created_at
      FROM booking_services bs
      JOIN books b ON bs.booking_id = b.id
      LEFT JOIN staff ON bs.staff_id = staff.id
      JOIN services ON bs.services_id = services.id
      WHERE bs.booking_id = ?  -- Filter by booking_id
      ORDER BY bs.created_at DESC;
    `;

    // Execute the query with the booking ID as a parameter
    const result = await db.query(query, [id]);

    const bookings = result[0] as Array<any>;

    if (bookings.length === 0) {
      return NextResponse.json(
        { message: "Booking not found" },
        { status: 404 }
      );
    }

    // Group the services by booking_id
    const booking = bookings.reduce(
      (acc, service) => {
        if (!acc.booking_id) {
          acc.booking_id = service.booking_id;
          acc.customer_id = service.customer_id;
          acc.services = [];
        }

        acc.services.push({
          service_id: service.service_id,
          service_name: service.service_name,
          service_price: service.service_price,
          service_status: service.service_status,
          service_discount: service.service_discount,
          service_created_at: service.service_created_at,
          start_time: service.start_time,
          end_time: service.end_time,
        });

        return acc;
      },
      { services: [] }
    );

    return NextResponse.json(booking, { status: 200 });
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
