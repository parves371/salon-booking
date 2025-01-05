import { createConnection } from "@/lib/db/dbConnect";
import { NextResponse } from "next/server";

interface BookSlotRequest {
  staffId: number;
  userId: number;
  startTime: string;
  endTime: string;
}

export async function POST(req: Request): Promise<Response> {
  try {
    // Parse and validate the incoming request body
    const body: BookSlotRequest = await req.json();
    const { staffId, userId, startTime, endTime } = body;

    // Validate required fields
    if (!staffId || !userId || !startTime || !endTime) {
      return NextResponse.json(
        { message: "All required fields (staffId, userId, startTime, endTime) must be provided." },
        { status: 400 }
      );
    }

    // Establish a database connection
    const db = await createConnection();

    // Check for overlapping bookings
    const [rows] = await db.query(
      `
        SELECT id
        FROM bookings
        WHERE staff_id = ?
          AND (
            (start_time < ? AND end_time > ?)
          )
      `,
      [staffId, endTime, startTime]
    );

    // Cast rows to the expected type
    const overlapping = rows as { id: number }[];

    if (overlapping.length > 0) {
      return NextResponse.json(
        { message: "The selected slot is already booked." },
        { status: 409 }
      );
    }

    // Insert the booking into the database
    await db.query(
      `
        INSERT INTO bookings (staff_id, user_id, start_time, end_time)
        VALUES (?, ?, ?, ?)
      `,
      [staffId, userId, startTime, endTime]
    );

    // Respond with a success message
    return NextResponse.json({ message: "Slot booked successfully." }, { status: 201 });
  } catch (error) {
    console.error("Error while booking slot:", error);

    // Handle unexpected errors
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
