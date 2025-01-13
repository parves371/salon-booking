import { createConnection } from "@/lib/db/dbConnect";

export async function POST(req: Request, res: Response) {
  try {
    const bookings = await req.json();

    // Validate bookings data
    if (!Array.isArray(bookings) || bookings.length === 0) {
      return new Response(
        JSON.stringify({ message: "Invalid bookings data" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    // Connect to the database
    const db = await createConnection();

    // Prepare bulk insert values
    const values = bookings.map(
      ({ serviceId, staffId, userId, startTime, endTime }) => [
        serviceId,
        staffId,
        userId,
        startTime,
        endTime,
      ]
    );

    // SQL query for bulk insert
    const query = `
      INSERT INTO bookings (service_id, staff_id, customer_id, start_time, end_time)
      VALUES ?
    `;

    // Execute bulk insert
    await db.query(query, [values]);

    return new Response(
      JSON.stringify({ message: "Bookings inserted successfully" }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error inserting bookings:", error);

    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET() {
  try {
    const db = await createConnection();

    // SQL query with joins
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
    `;

    // Execute the query
    const [results] = await db.query(query);

    // Return the results
    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);

    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function DELETE(req: Request) {
  try {
    // Get the booking ID from the request body
    const { booking_id } = await req.json();

    // Validate bookingId
    if (!booking_id) {
      return new Response(
        JSON.stringify({ message: "Booking ID is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Connect to the database
    const db = await createConnection();

    // SQL query to delete the booking by ID
    const query = `
      DELETE FROM bookings WHERE id = ?
    `;

    // Execute the query
    const [result] = await db.query(query, [booking_id]);

    // Cast the result to the correct type
    const affectedRows = (result as { affectedRows: number }).affectedRows;

    // Check if any rows were affected
    if (affectedRows === 0) {
      return new Response(JSON.stringify({ message: "Booking not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ message: "Booking deleted successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error deleting booking:", error);

    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
