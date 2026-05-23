import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  if (!body.restaurant_name || !body.city || !body.email) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  return NextResponse.json({ ok: true, status: "pending" });
}
