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
      INSERT INTO bookings (service_id, staff_id, user_id, start_time, end_time)
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

    return new Response(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
