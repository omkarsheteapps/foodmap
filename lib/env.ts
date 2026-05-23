const required = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"] as const;

export const env = {
  enablePayments: process.env.NEXT_PUBLIC_ENABLE_PAYMENTS === "true",
  razorpayKeyId: process.env.RAZORPAY_KEY_ID,
};

export function validateEnv() {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) throw new Error(`Missing env: ${missing.join(", ")}`);
}
