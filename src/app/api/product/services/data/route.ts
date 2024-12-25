import { createConnection } from "@/lib/db/dbConnect"; // Ensure this points to your DB helper
import { CategorySchema } from "@/schemas/product";
import { NextResponse } from "next/server";
export async function GET(req: Request) {
  try {
    const db = await createConnection();

    const [categories]: any = await db.query("SELECT * FROM Services WHERE option = TRUE");

    return NextResponse.json(
      {
        message: "Services fetched successfully",
        data: categories,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching Services:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}