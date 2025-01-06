import { createConnection } from "@/lib/db/dbConnect";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { staffIds, date }: { staffIds: number[]; date: string } =
    await req.json(); // Parse the request body

  console.log(staffIds);
  console.log("aslkjdaskljd", date);

  if (!staffIds || staffIds.length === 0 || !date) {
    return NextResponse.json(
      { error: "Staff IDs and date are required!" },
      { status: 400 }
    );
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

    // Fetch booked slots for all provided staff IDs
    const [rows] = await dbConnection.query(
      `
        SELECT TIME(start_time) AS slot
        FROM bookings
        WHERE staff_id IN (?) AND DATE(start_time) = ?
      `,
      [staffIds, date]
    );

    // Safely cast rows to the expected type
    const bookedSlots = rows as { slot: string }[];

    // Get unique booked slots across all staff IDs
    const uniqueBookedSlots = Array.from(
      new Set(bookedSlots.map((b) => b.slot))
    );

    // Filter out booked slots
    const availableSlots = allSlots.filter(
      (slot) => !uniqueBookedSlots.includes(slot)
    );

    return NextResponse.json({ availableSlots });
  } catch (error) {
    console.error("Error fetching available slots:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
