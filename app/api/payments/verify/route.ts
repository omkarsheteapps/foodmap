import { NextResponse } from "next/server";
import { env } from "@/lib/env";

export async function POST() {
  if (!env.enablePayments) return NextResponse.json({ message: "Coming Soon" }, { status: 503 });
  return NextResponse.json({ verified: true });
}
