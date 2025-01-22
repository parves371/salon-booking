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
