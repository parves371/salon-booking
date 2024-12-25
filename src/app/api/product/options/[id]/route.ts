import { createConnection } from "@/lib/db/dbConnect";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {

  console.log(params.id);
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const db = await createConnection();

    const [result]: any = await db.query("DELETE FROM options WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Option not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Option deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting Option:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
