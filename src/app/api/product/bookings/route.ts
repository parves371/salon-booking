import { createConnection } from "@/lib/db/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { staffId, userId, startTime, endTime } = req.body;

  if (!staffId || !userId || !startTime || !endTime) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const dbConnection = await createConnection();

    // Check for overlapping bookings
    const [rows] = await dbConnection.query(
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

    // Cast rows to expected type
    const overlapping = rows as { id: number }[];

    if (overlapping.length > 0) {
      return res.status(409).json({ error: "Slot already booked" });
    }

    // Insert booking
    await dbConnection.query(
      `
        INSERT INTO bookings (staff_id, user_id, start_time, end_time)
        VALUES (?, ?, ?, ?)
      `,
      [staffId, userId, startTime, endTime]
    );

    res.status(201).json({ success: "Slot booked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}
