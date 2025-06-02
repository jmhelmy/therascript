// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Import the Inter font
import "./globals.css";

// Configure the Inter font (adjust weight(s) and subsets as needed)
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // ← changed from `weights` to `weight`
  display: "swap",
  variable: "--font-inter", // Optional: if you want to use it as a CSS variable
});

// --- KEEP THIS 'metadata' EXPORT (and delete the other one) ---
export const metadata: Metadata = {
  title: "Terapai",
  description: "HIPAA-compliant AI note assistant for therapists",
  icons: {
    icon: "/couchicon2.png", // Path to your favicon in the /public directory
    // You can also specify apple-touch-icon, etc.
    // apple: '/apple-touch-icon.png', // Example
  },
  // You can add other common metadata here:
  // openGraph: {
  //   title: 'Terapai',
  //   description: 'HIPAA-compliant AI note assistant for therapists',
  //   images: ['/og-image.png'], // Path to your Open Graph image in /public
  // },
  // twitter: {
  //   card: 'summary_large_image',
  //   title: 'Terapai',
  //   description: 'HIPAA-compliant AI note assistant for therapists',
  //   images: ['/twitter-image.png'], // Path to your Twitter card image in /public
  // },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${inter.className}`}>
      {/*
        If you did NOT use the `variable` option in `Inter({ ... })`,
        then just use: <html lang="en" className={inter.className}>
      */}
      <body>{children}</body>
    </html>
  );
}
