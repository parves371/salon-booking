export async function GET(request: Request) {
  const { email, password } = await request.json();

  console.log(email, password);

  return Response.json({ success: true, message: "aksj" }, { status: 200 });
}
