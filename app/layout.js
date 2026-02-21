import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata টাইপ সরিয়ে দেওয়া হয়েছে
export const metadata = {
  title: "VideoVault - High Speed Downloader",
  description: "Download videos from social media easily.",
};

// Props থেকে টাইপ ডেফিনিশন সরিয়ে দেওয়া হয়েছে
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}