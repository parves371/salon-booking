export async function GET() {
    try {
      // Create a response to clear the `salon-admin` cookie
      const response = new Response(
        JSON.stringify({ message: "Logout successful" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
  
      // Clear the cookie by setting its expiration date in the past
      response.headers.set(
        "Set-Cookie",
        "salon-admin=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0"
      );
  
      return response;
    } catch (error) {
      console.error("Error during logout process:", error);
      return new Response(JSON.stringify({ message: "Error during logout" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
  