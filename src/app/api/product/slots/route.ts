import { createConnection } from "@/lib/db/dbConnect";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const {
      staffIds,
      date,
      services,
    }: {
      staffIds: number[];
      date: string;
      services: { id: number; time: string }[];
    } = await req.json();

    if (
      !staffIds ||
      staffIds.length === 0 ||
      !date ||
      !services ||
      services.length === 0
    ) {
      return NextResponse.json(
        { error: "Staff IDs, date, and services are required!" },
        { status: 400 }
      );
    }

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

    const [rows] = await dbConnection.query(
      `
        SELECT TIME(start_time) AS start_time, TIME(end_time) AS end_time
        FROM bookings
        WHERE staff_id IN (?) AND DATE(start_time) = ?
      `,
      [staffIds, date]
    );

    const bookedSlots = rows as { start_time: string; end_time: string }[];
    const bookedSet = new Set<string>();

    bookedSlots.forEach((slot) => {
      let current = new Date(`1970-01-01T${slot.start_time}`);
      const end = new Date(`1970-01-01T${slot.end_time}`);

      while (current < end) {
        bookedSet.add(current.toTimeString().split(" ")[0]); // Use toTimeString for local time
        current.setMinutes(current.getMinutes() + 15);
      }
    });

    const combinedAvailableSlots = new Set<string>();

    console.log("bookedSlots", bookedSlots);
    console.log("bookedSet", bookedSet);
    console.log("combinedAvailableSlots", combinedAvailableSlots);
    console.log("services", services);

    services.forEach((service) => {
      const [hours, minutes] = service.time.split(":").map(Number);
      const duration = hours * 60 + minutes;
      console.log(`Evaluating service with duration: ${duration} minutes`);
    
      allSlots.forEach((slot) => {
        const start = new Date(`1970-01-01T${slot}`);
        const end = new Date(start.getTime() + duration * 60000);
    
        console.log(`Checking slot: ${slot}, Start: ${start.toTimeString()}, End: ${end.toTimeString()}`);
    
        let isAvailable = true;
        let current = new Date(start);
    
        while (current < end) {
          const time = current.toTimeString().split(" ")[0];
          console.log(`Checking time: ${time}`);
          if (bookedSet.has(time)) {
            console.log(`Conflict detected at time: ${time}`);
            isAvailable = false;
            break;
          }
          current.setMinutes(current.getMinutes() + 15);
        }
    
        if (isAvailable) {
          console.log(`Slot ${slot} is available for service`);
          combinedAvailableSlots.add(slot);
        } else {
          console.log(`Slot ${slot} is unavailable for service`);
        }
      });
    });
    

    return NextResponse.json({
      availableSlots: Array.from(combinedAvailableSlots),
    });
  } catch (error) {
    console.error("Error fetching available slots:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
