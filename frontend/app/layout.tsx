import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Easy Education | A Joyful Learning Experience",
  description: "Connect with specialized teachers, access high-quality video lessons, and track your progress on your path to academic excellence.",
  keywords: ["education", "online learning", "tutoring", "courses", "teachers", "students"],
  authors: [{ name: "Easy Education" }],
  icons: {
    icon: "/main logo.png",
    shortcut: "/main logo.png",
    apple: "/main logo.png",
  },
  openGraph: {
    title: "Easy Education | A Joyful Learning Experience",
    description: "Connect with specialized teachers and access high-quality educational content.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

