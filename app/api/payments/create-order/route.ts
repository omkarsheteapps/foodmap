import { NextResponse } from "next/server";
import { env } from "@/lib/env";

export async function POST() {
  if (!env.enablePayments) return NextResponse.json({ message: "Payments are not enabled for this environment." }, { status: 503 });
  return NextResponse.json({ order: "placeholder" });
}
