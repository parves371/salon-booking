import { createConnection } from "@/lib/db/dbConnect";

export async function GET(req: Request) {
  try {
    const db = await createConnection();
    const sql = "SELECT * FROM user";

    const [rows] = await db.query(sql);

    return Response.json({ success: true, message: rows }, { status: 200 });
  } catch (error) {
    console.error("Error in signup", error);
    return Response.json(
      { success: false, message: "Error in signup" },
      { status: 500 }
    );
  }
}
