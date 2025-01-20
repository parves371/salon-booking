import convertToSubcurrency from "@/lib/convertToSubcurrency";
import { createConnection } from "@/lib/db/dbConnect";
import stripe from "@/lib/stripe";

export async function POST(req: Request, res: Response) {
  try {
    const bookings = await req.json();

    // Validate bookings data
    if (!Array.isArray(bookings) || bookings.length === 0) {
      return new Response(
        JSON.stringify({ message: "Invalid bookings data" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    // Connect to the database
    const db = await createConnection();

    // Prepare bulk insert values
    const values = bookings.map(
      ({ serviceId, staffId, userId, startTime, endTime }) => [
        serviceId,
        staffId,
        userId,
        startTime,
        endTime,
      ]
    );
    console.log("Values:", bookings);

    // SQL query for bulk insert
    const query = `
      INSERT INTO bookings (service_id, staff_id, customer_id, start_time, end_time)
      VALUES ?
    `;

    // Execute bulk insert
    await db.query(query, [values]);

    return new Response(
      JSON.stringify({ message: "Bookings inserted successfully" }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error inserting bookings:", error);

    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const customer_id = url.searchParams.get("customer_id"); // Retrieve the query parameter
    console.log(customer_id);
    if (!customer_id || isNaN(Number(customer_id))) {
      return new Response(JSON.stringify({ message: "Invalid ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const db = await createConnection();

    // SQL query with joins
    const query = `
      SELECT 
        bookings.id AS booking_id,
        bookings.start_time,
        bookings.end_time,
        bookings.service_id,
        bookings.customer_id,
        bookings.staff_id,
        bookings.status,
        customers.name AS customer_name,
        services.name AS service_name,
        staff.position AS staff_position,
        users.name AS staff_user_name
      FROM bookings
      LEFT JOIN customers ON bookings.customer_id = customers.id
      LEFT JOIN services ON bookings.service_id = services.id
      LEFT JOIN staff ON bookings.staff_id = staff.id
      LEFT JOIN user AS users ON staff.user_id = users.id
      WHERE customer_id = ?
    `;

    // Execute the query
    const [results] = await db.query(query, [customer_id]);

    // Return the results
    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);

    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// pages/api/booking.ts

export async function PUT(req: Request) {
  let connection: any;

  try {
    // Parse request body
    const { customerId, services, totalPrice } = await req.json();
    console.log("Received data:", { customerId, services, totalPrice });

    if (
      !services ||
      (!Array.isArray(services) && typeof services !== "object")
    ) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid services format." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Normalize services to an array if it's a single object
    const normalizedServices = Array.isArray(services) ? services : [services];

    if (normalizedServices.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "Services cannot be empty." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const pool = await createConnection();
    connection = await pool.getConnection();

    await connection.beginTransaction(); // Start a transaction

    // Check if a booking already exists for this customer with the same total price
    const [existingBooking] = await connection.execute(
      `SELECT * FROM books WHERE customer_id = ? AND price = ? AND status = 'pending'`,
      [customerId, totalPrice]
    );

    let bookingId;
    if (existingBooking.length > 0) {
      // Use the existing booking ID if found
      bookingId = existingBooking[0].id;
    } else {
      // Create a new booking if no existing one
      const [bookingResult] = await connection.execute(
        `INSERT INTO books (customer_id, price) VALUES (?, ?)`,
        [customerId, totalPrice]
      );
      bookingId = (bookingResult as any).insertId;
    }

    // Add services to the booking
    for (const service of normalizedServices) {
      const parsedPrice = parseFloat(service.price);
      if (
        !service.serviceId ||
        !service.staffId ||
        !service.startTime ||
        !service.endTime ||
        isNaN(parsedPrice)
      ) {
        throw new Error("Invalid service object.");
      }

      // Insert each service for the existing/new booking
      await connection.execute(
        `INSERT INTO booking_services (booking_id, staff_id, services_id, start_time, end_time, price) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          bookingId,
          service.staffId,
          service.serviceId,
          service.startTime,
          service.endTime,
          service.price,
        ]
      );
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: convertToSubcurrency(totalPrice), // Convert to cents
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    console.log("paymentIntent", paymentIntent);

    // Save payment details
    await connection.execute(
      `INSERT INTO payment (book_id, price, payment_method, status,payment_id) VALUES (?, ?, ?, ?,?)`,
      [
        bookingId,
        totalPrice,
        paymentIntent?.payment_method_configuration_details?.id,
        "pending",
        paymentIntent.id,
      ]
    );

    await connection.commit(); // Commit transaction

    return new Response(
      JSON.stringify({
        success: true,
        clientSecret: paymentIntent.client_secret,
        bookingId,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    if (connection) await connection.rollback(); // Rollback transaction in case of error
    console.error("Error during booking:", error.message || error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Something went wrong!",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  } finally {
    if (connection) connection.release(); // Release the connection back to the pool
  }
}
