import { NextResponse } from "next/server";
import crypto from "node:crypto";

export async function POST(req: Request) {
  const payload = await req.text();
  const signature = req.headers.get("x-razorpay-signature") || "";
  const secret = process.env.RAZORPAY_KEY_SECRET || "";
  const digest = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  if (secret && digest !== signature) return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  return NextResponse.json({ ok: true });
}
