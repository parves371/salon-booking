import { createConnection } from "@/lib/db/dbConnect";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { id, status } = await request.json();

    // Validate input
    if (!id || !status) {
      return NextResponse.json(
        { error: "Missing required parameters: id and status" },
        { status: 400 }
      );
    }

    // Allowed status values
    const allowedStatuses = [
      "pending",
      "processing",
      "completed",
      "cancelled",
      "hold",
    ];
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    // Database connection
    const db = await createConnection();

    // Update query
    const [result]: any = await db.query(
      `UPDATE booking_services
       SET status = ?
       WHERE id = ?`,
      [status, id]
    );

    // Check if the record was updated
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "No record found with the provided id" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Status updated successfully" });
  } catch (error) {
    console.error("Error updating service status:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
