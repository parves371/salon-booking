import { createConnection } from "@/lib/db/dbConnect"; // Ensure this points to your DB helper
import { CategorySchema } from "@/schemas/product";
import { NextApiRequest, NextApiResponse } from "next";
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
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding category:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const db = await createConnection();

    const [categories]: any = await db.query("SELECT * FROM categories");

    return NextResponse.json(
      {
        message: "Categories fetched successfully",
        data: categories,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
