import { createConnection } from "@/lib/db/dbConnect";
import { RowDataPacket } from "mysql2";

export async function GET(
  req: Request,
  { params }: { params: { staffId: string } }
) {
  const { staffId } = params;
  console.log("Staff ID:", staffId);

  if (!staffId) {
    return Response.json({ message: "Staff ID is required" }, { status: 400 });
  }

  try {
    const connection = await createConnection();

    // Fetch all services for the given staff_id
    const [rows] = await connection.execute<RowDataPacket[]>(
      `
        SELECT 
          bs.id AS booking_service_id,
          bs.booking_id,
          bs.staff_id,
          bs.services_id,
          bs.start_time,
          bs.end_time,
          bs.price,
          bs.status,
          bs.discount,
          bs.created_at,
          c.name AS customer_name,
          s.name AS service_name
        FROM 
          booking_services bs
        INNER JOIN 
          books b ON bs.booking_id = b.id
        INNER JOIN 
          customers c ON b.customer_id = c.id
        INNER JOIN 
          services s ON bs.services_id = s.id
        WHERE 
          bs.staff_id = ?
        ORDER BY 
          bs.start_time ASC;
      `,
      [staffId]
    );

    if (rows.length === 0) {
      return Response.json(
        { message: "No services found for the given staff ID." },
        { status: 404 }
      );
    }

    return Response.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching services:", error);
    return Response.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
