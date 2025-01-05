// File: pages/api/slots/[staffId].ts
import { createConnection } from "@/lib/db/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { staffId } = req.query;
  const { date } = req.body;

  if (!staffId || !date) {
    return res.status(400).json({ error: "Staff ID and date are required" });
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
      (slot) => !bookedSlots.map((b: any) => b.slot).includes(slot)
    );

    res.status(200).json({ availableSlots });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}
