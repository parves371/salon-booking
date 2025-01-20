import { createConnection } from "@/lib/db/dbConnect";
import { NextApiRequest, NextApiResponse } from "next";

interface UpdatePaymentRequest extends NextApiRequest {
  body: {
    book_id: number;
    status: "pending" | "completed" | "failed" | "refunded";
    payment_method?: string;
    amount?: number;
  };
}

export async function POST(req: Request) {
  const { book_id, status, payment_method, amount } = await req.json();

  if (!book_id || !status) {
    return new Response(
      JSON.stringify({ error: "Missing required fields: book_id and status." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  const connection = await createConnection();
  try {
    // Update the payment record in the database
    const [result] = await connection.query(
      "UPDATE payment SET status = ?, payment_method = ?, price = ? WHERE book_id = ?",
      [status, payment_method || null, amount || null, book_id]
    );

    if ((result as any).affectedRows === 0) {
      return new Response(
        JSON.stringify({ error: "Payment record not found." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Payment status updated." }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Database error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update payment status." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
