import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://cravemap.example.com"),
  title: { default: "CraveMap | Discover Your City Through Its Best Dishes", template: "%s | CraveMap" },
  description: "Cinematic dish-first food discovery across India's top cities.",
  openGraph: { title: "CraveMap", description: "Discover Your City Through Its Best Dishes", type: "website" },
  twitter: { card: "summary_large_image", title: "CraveMap" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" >
      <body>{children}</body>
    </html>
  );
}
