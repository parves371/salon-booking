import { createConnection } from "@/lib/db/dbConnect";
import { ResultSetHeader } from "mysql2";
import { NextResponse } from "next/server";

// Define the structure of the request body for POST and PUT
interface WorkScheduleRequest {
  staff_id: number;
  work_date: string;
  slot_start: string;
  slot_end: string;
  status: "free" | "booked" | "off";
  id?: number; // For updates
}

// Handle GET, POST, PUT, DELETE methods
export async function GET(): Promise<Response> {
  try {
    const db = await createConnection();

    // Fetch all work schedules
    const [rows] = await db.query(`
      SELECT * FROM Work_Schedule
    `);

    return NextResponse.json({ data: rows }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching work schedules:", error.message || error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message || error },
      { status: 500 }
    );
  }
}

export async function POST(req: Request): Promise<Response> {
  try {
    const body: WorkScheduleRequest = await req.json();
    const { staff_id, work_date, slot_start, slot_end, status } = body;

    if (!staff_id || !work_date || !slot_start || !slot_end || !status) {
      return NextResponse.json(
        { message: "All fields (staff_id, work_date, slot_start, slot_end, status) are required." },
        { status: 400 }
      );
    }

    const db = await createConnection();

    // Insert a new work schedule
    const [result] = await db.query<ResultSetHeader>(
      `
      INSERT INTO Work_Schedule (staff_id, work_date, slot_start, slot_end, status) 
      VALUES (?, ?, ?, ?, ?)
      `,
      [staff_id, work_date, slot_start, slot_end, status]
    );

    return NextResponse.json({ message: "Work schedule added successfully", id: result.insertId });
  } catch (error: any) {
    console.error("Error creating work schedule:", error.message || error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message || error },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request): Promise<Response> {
  try {
    const body: WorkScheduleRequest = await req.json();
    const { id, staff_id, work_date, slot_start, slot_end, status } = body;

    if (!id || !staff_id || !work_date || !slot_start || !slot_end || !status) {
      return NextResponse.json(
        { message: "All fields (id, staff_id, work_date, slot_start, slot_end, status) are required." },
        { status: 400 }
      );
    }

    const db = await createConnection();

    // Update the work schedule
    await db.query(
      `
      UPDATE Work_Schedule 
      SET staff_id = ?, work_date = ?, slot_start = ?, slot_end = ?, status = ? 
      WHERE id = ?
      `,
      [staff_id, work_date, slot_start, slot_end, status, id]
    );

    return NextResponse.json({ message: "Work schedule updated successfully" });
  } catch (error: any) {
    console.error("Error updating work schedule:", error.message || error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message || error },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ message: "Work schedule ID is required." }, { status: 400 });
    }

    const db = await createConnection();

    // Delete the work schedule
    await db.query(`DELETE FROM Work_Schedule WHERE id = ?`, [id]);

    return NextResponse.json({ message: "Work schedule deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting work schedule:", error.message || error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message || error },
      { status: 500 }
    );
  }
}
