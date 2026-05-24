import type { Metadata } from "next";
import { absoluteUrl, brand } from "@/lib/brand";
import VisitTracker from "./VisitTracker";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(brand.domain),
  applicationName: brand.name,
  title: {
    default: `${brand.name} | ${brand.tagline}`,
    template: `%s | ${brand.name}`,
  },
  description: brand.shortDescription,
  keywords: [
    "best restaurants in India",
    "signature dishes",
    "food map",
    "city food guide",
    "local food discovery",
    "restaurant discovery India",
  ],
  authors: [{ name: brand.name }],
  creator: brand.name,
  publisher: brand.name,
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    title: `${brand.name} | ${brand.tagline}`,
    description: brand.shortDescription,
    url: absoluteUrl("/"),
    siteName: brand.name,
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${brand.name} | ${brand.tagline}`,
    description: brand.shortDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": absoluteUrl("/#organization"),
        name: brand.name,
        url: absoluteUrl("/"),
        description: brand.longDescription,
      },
      {
        "@type": "WebSite",
        "@id": absoluteUrl("/#website"),
        name: brand.name,
        url: absoluteUrl("/"),
        description: brand.shortDescription,
        publisher: { "@id": absoluteUrl("/#organization") },
        inLanguage: "en-IN",
      },
    ],
  };

  return (
    <html lang="en" >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <VisitTracker />
        {children}
      </body>
    </html>
  );
}
