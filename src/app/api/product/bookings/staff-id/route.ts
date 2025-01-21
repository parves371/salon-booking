import { createConnection } from "@/lib/db/dbConnect";
import { NextResponse } from "next/server";

interface Service {
  service_id: number;
  service_name: string;
  service_price: number;
  service_status: string;
  service_discount: number | null;
  service_created_at: string;
  start_time: string;
  end_time: string;
}

interface Booking {
  booking_id: number;
  customer_id: number;
  services: Service[];
}

export async function POST(request: Request) {
  try {
    const { admin_id } = await request.json();

    const id = parseInt(admin_id); // Get the booking ID from the params

    if (isNaN(id)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const db = await createConnection();

    // SQL query to select booking data with JOINs
    const query = `
                SELECT 
                    bs.id AS service_id,                  -- Service ID
                    bs.booking_id,                        -- Booking ID
                    b.customer_id,                        -- Customer ID
                    customers.name AS customer_name,      -- Customer's name
                    bs.staff_id,                          -- Staff ID handling the service
                    bs.services_id,                       -- Service ID for the offered service
                    services.name AS service_name,        -- Service name from services table
                    bs.start_time,                        -- Start time of the service
                    bs.end_time,                          -- End time of the service
                    bs.price AS service_price,            -- Price of the service
                    bs.status AS service_status,          -- Status of the service (pending, completed, etc.)
                    bs.discount AS service_discount,      -- Discount applied to the service
                    bs.created_at AS service_created_at   -- Timestamp when the service was created
                FROM booking_services bs
                JOIN books b ON bs.booking_id = b.id         -- Join booking_services with books table
                JOIN customers ON b.customer_id = customers.id -- Join books with customers to get customer names
                JOIN services ON bs.services_id = services.id -- Join services table to get service details
                WHERE bs.staff_id = ?                        -- Filter by the specified staff_id
                ORDER BY bs.created_at DESC;                 -- Order results by created_at in descending order

    `;

    // Execute the query with the booking ID as a parameter
    const [rows]: [any[], any] = await db.query(query, [id]);

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { message: "Booking not found" },
        { status: 404 }
      );
    }

    // Group the services by booking_id

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching booking data:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
