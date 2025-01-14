import { createConnection } from "@/lib/db/dbConnect";
import { NextResponse } from "next/server";

type Service = { id: number; time: string };
type BookedSlot = { start_time: string; end_time: string };

export async function POST(req: Request) {
  try {
    const {
      staffIds,
      date,
      services,
    }: { staffIds: number[]; date: string; services: Service[] } =
      await req.json();

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

    // Define salon operating hours
    const salonStartTime = "10:00:00";
    const salonEndTime = "22:00:00";

    // Generate 15-minute time slots
    const generateTimeSlots = (
      startTime: string,
      endTime: string,
      intervalMinutes: number
    ): string[] => {
      const slots: string[] = [];
      let current = new Date(`1970-01-01T${startTime}`);
      const end = new Date(`1970-01-01T${endTime}`);
      while (current < end) {
        slots.push(current.toTimeString().split(" ")[0]);
        current.setMinutes(current.getMinutes() + intervalMinutes);
      }
      return slots;
    };

    const allSlots = generateTimeSlots(salonStartTime, salonEndTime, 15);

    const dbConnection = await createConnection();

    // Fetch booked slots from the database
    const [rows] = await dbConnection.query(
      `
        SELECT TIME(start_time) AS start_time, TIME(end_time) AS end_time
        FROM bookings
        WHERE staff_id IN (?) AND DATE(start_time) = ? 
      `,
      [staffIds, date]
    );

    const bookedSlots = rows as BookedSlot[];
    const bookedSet = createBookedSet(bookedSlots);

    const availableSlots = getCombinedAvailableSlots(
      allSlots,
      services,
      bookedSet,
      salonStartTime,
      salonEndTime
    );

    return NextResponse.json({ availableSlots });
  } catch (error) {
    console.error("Error fetching available slots:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Utility to create a Set of booked times from booked slots
const createBookedSet = (bookedSlots: BookedSlot[]): Set<string> => {
  const bookedSet = new Set<string>();
  bookedSlots.forEach((slot) => {
    let current = new Date(`1970-01-01T${slot.start_time}`);
    const end = new Date(`1970-01-01T${slot.end_time}`);
    while (current < end) {
      bookedSet.add(current.toTimeString().split(" ")[0]);
      current.setMinutes(current.getMinutes() + 15);
    }
  });
  return bookedSet;
};

// Function to determine available slots
const getCombinedAvailableSlots = (
  allSlots: string[],
  services: { id: number; time: string }[],
  bookedSet: Set<string>,
  salonStartTime: string,
  salonEndTime: string
): string[] => {
  const combinedAvailableSlots = new Set<string>();

  // Calculate total service duration in minutes
  const totalDuration = services.reduce((sum, service) => {
    const [hours, minutes] = service.time.split(":").map(Number);
    return sum + hours * 60 + minutes;
  }, 0);

  allSlots.forEach((slot) => {
    const start = new Date(`1970-01-01T${slot}`);
    const end = new Date(start.getTime() + totalDuration * 60000);

    // Ensure the combined services fit within salon hours
    const salonStart = new Date(`1970-01-01T${salonStartTime}`);
    const salonEnd = new Date(`1970-01-01T${salonEndTime}`);

    if (end > salonEnd || start < salonStart) return; // Skip invalid slots

    // Check if the slot is available for the entire combined duration
    let isAvailable = true;
    let current = new Date(start);

    while (current < end) {
      const time = current.toTimeString().split(" ")[0];
      if (bookedSet.has(time)) {
        isAvailable = false;
        break;
      }
      current.setMinutes(current.getMinutes() + 15); // Increment by 15 minutes
    }

    if (isAvailable) {
      combinedAvailableSlots.add(slot);
    }
  });

  return Array.from(combinedAvailableSlots);
};
