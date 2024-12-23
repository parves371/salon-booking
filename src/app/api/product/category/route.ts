import { createConnection } from "@/lib/db/dbConnect"; // Ensure this points to your DB helper
import { CategorySchema } from "@/schemas/product";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name } = await CategorySchema.parseAsync(body);

    const db = await createConnection();

    const [result]: any = await db.query(
      "INSERT INTO categories (name) VALUES (?)",
      [name]
    );

    return NextResponse.json(
      {
        message: "Category added successfully",
        id: result.insertId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding category:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
