const required = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "MAPBOX_ACCESS_TOKEN"] as const;
export const env = {
  enablePayments: process.env.NEXT_PUBLIC_ENABLE_PAYMENTS === "true",
  razorpayKeyId: process.env.RAZORPAY_KEY_ID,
};

export function validateEnv() {
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) throw new Error(`Missing env: ${missing.join(", ")}`);
}
