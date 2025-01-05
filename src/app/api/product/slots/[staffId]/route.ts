import { createConnection } from "@/lib/db/dbConnect";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { staffId: string } }) {
  const { staffId } = params; // Access the dynamic route parameter
  const { date }: { date: string } = await req.json(); // Parse the request body

  if (!staffId || !date) {
    return NextResponse.json({ error: "Staff ID and date are required" }, { status: 400 });
  }

  try {
    // Define all possible slots
    const allSlots = [
      "11:00:00",
      "11:15:00",
      "11:30:00",
      "11:45:00",
      "12:00:00",
      "12:15:00",
      "12:30:00",
      "12:45:00",
    ];

    const dbConnection = await createConnection();

    // Fetch booked slots
    const [rows] = await dbConnection.query(
      `
        SELECT TIME(start_time) AS slot
        FROM bookings
        WHERE staff_id = ? AND DATE(start_time) = ?
      `,
      [staffId, date]
    );

    // Safely cast rows to the expected type
    const bookedSlots = rows as { slot: string }[];

    // Filter out booked slots
    const availableSlots = allSlots.filter(
      (slot) => !bookedSlots.some((b) => b.slot === slot)
    );

    return NextResponse.json({ availableSlots });
  } catch (error) {
    console.error("Error fetching available slots:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
