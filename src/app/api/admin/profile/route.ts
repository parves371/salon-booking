import { AdminAuthenticate } from "@/lib/user/auth";

export async function GET(request: Request) {
  // Await the result of authenticate to get the user or error
  const { user, error } = await AdminAuthenticate(request);

  if (error) {
    return new Response(JSON.stringify({ error }), { status: 401 });
  }

  // If authentication is successful, send the user profile
  return new Response(
    JSON.stringify({ message: "Welcome to your profile", user }),
    { status: 200 }
  );
}