import type React from "react";
import type { Metadata } from "next";
import { PT_Serif } from "next/font/google";
import "./globals.css";

const serif = PT_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Timothy Chen - Developer Portfolio",
  description: "A minimal CV-style developer portfolio.",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={serif.variable}>
      <body>{children}</body>
    </html>
  );
}
