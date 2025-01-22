import { createConnection } from "@/lib/db/dbConnect";

export async function GET(req: Request) {
  try {
    // Create a database connection
    const db = await createConnection();

    // Execute the query to fetch payment and customer details
    const [result]: any = await db.query(
      `SELECT 
        p.id AS payment_id,         
        p.price AS payment_price,   
        p.payment_method,           
        p.status AS payment_status, 
        p.created_at AS payment_date,
        p.book_id,                  
        c.id AS customer_id,        
        c.profile AS customer_profile,
        c.name AS customer_name,    
        c.email AS customer_email,  
        c.number AS customer_number 
      FROM 
        payment p
      JOIN 
        books b ON p.book_id = b.id 
      JOIN 
        customers c ON b.customer_id = c.id`,
      []
    );

    // Respond with the fetched data
    return Response.json(
      {
        message: "Payment details fetched successfully",
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching payment details:", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // Parse the request body
    const { book_id } = await req.json();

    if (!book_id) {
      return new Response(
        JSON.stringify({ message: "Missing book_id parameter" }),
        { status: 400 }
      );
    }

    // Create database connection
    const db = await createConnection();

    // Execute query
    const [results]: any = await db.query(
      `
      SELECT 
          -- Booking details
          b.id AS booking_id,
          b.created_at AS booking_date,
          b.status AS booking_status,
          
          -- Customer details
          c.name AS customer_name,
          c.number AS customer_number,
          c.email AS customer_email,
          
          -- Payment details
          p.payment_method,
          p.status AS payment_status,
          p.created_at AS payment_date,
          p.price AS payment_price,
          
          -- Service details
          s.name AS service_name,
          bs.id AS service_id,
          bs.start_time AS service_start_time,
          bs.end_time AS service_end_time,
          bs.price AS service_price,
          bs.status AS service_status

      FROM books b
      JOIN customers c ON b.customer_id = c.id
      LEFT JOIN payment p ON b.id = p.book_id
      LEFT JOIN booking_services bs ON b.id = bs.booking_id
      LEFT JOIN services s ON bs.services_id = s.id

      WHERE b.id = ?;
      `,
      [book_id]
    );

    if (results.length === 0) {
      return new Response(
        JSON.stringify({
          message: "No booking found for the provided book_id",
        }),
        { status: 404 }
      );
    }

    // Group services under booking details
    const groupedResult = {
      booking_id: results[0].booking_id,
      booking_date: results[0].booking_date,
      booking_status: results[0].booking_status,
      customer: {
        name: results[0].customer_name,
        number: results[0].customer_number,
        email: results[0].customer_email,
      },
      payment: {
        method: results[0].payment_method,
        status: results[0].payment_status,
        date: results[0].payment_date,
        price: results[0].payment_price,
      },
      services: results.map((row: any) => ({
        name: row.service_name,
        id: row.service_id,
        start_time: row.service_start_time,
        end_time: row.service_end_time,
        price: row.service_price,
        status: row.service_status,
      })),
    };

    return new Response(JSON.stringify(groupedResult), { status: 200 });
  } catch (error) {
    console.error("Error fetching booking details:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
