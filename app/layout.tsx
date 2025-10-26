import type { Metadata } from "next";
import { Geist, Geist_Mono, Engagement } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const engagement = Engagement({
  variable: "--font-engagement",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "PrettyQR - Generate QR Codes Easily",
  description: "Generate and customize QR codes effortlessly",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${engagement.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
