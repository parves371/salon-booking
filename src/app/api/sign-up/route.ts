export async function POST(request: Request) {
  try {
    // Safely parse the JSON body
    const reqBody = await request.json();

    // Destructure the required fields
    const { email, password } = reqBody;

    console.log(email, password);

    return new Response(
      JSON.stringify({
        success: true,
        message: "hi hellow world",
      }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Error processing request" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
