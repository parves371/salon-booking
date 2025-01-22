import { createConnection } from "@/lib/db/dbConnect";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { id, status } = await request.json();

    // Validate inputs
    if (!id || !status) {
      return NextResponse.json(
        { error: "Missing required parameters: id and status" },
        { status: 400 }
      );
    }

    // Allowed statuses
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

    // Connect to the database
    const db = await createConnection();

    // Execute the query
    const [result]: any = await db.query(
      `UPDATE books
       SET status = ?
       WHERE id = ?`,
      [status, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "No record found with the provided ID" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Book status updated successfully" });
  } catch (error) {
    console.error("Error updating book status:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
