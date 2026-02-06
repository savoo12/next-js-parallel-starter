import type { Metadata, Viewport } from "next";
import { DM_Sans, Libre_Baskerville, Geist_Mono } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Parallel AI | What can I do for you?",
  description:
    "Search, extract, and run research tasks with Parallel AI. An intelligent agent that delivers finished work, not just answers.",
};

export const viewport: Viewport = {
  themeColor: "#1A1A1A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.className} ${libreBaskerville.className} ${geistMono.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
