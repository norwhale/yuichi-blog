import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdSenseScript from "@/components/AdSenseScript";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yuichi.blog"),
  title: {
    default: "yuichi.blog - Life, Tech & Vibes from Bulgaria",
    template: "%s | yuichi.blog",
  },
  description: "A personal blog by Yuichi — university life in Bulgaria, vibe coding, tech experiments, and everything in between.",
  authors: [{ name: "Yuichi" }],
  openGraph: {
    title: "yuichi.blog",
    description: "Life, Tech & Vibes from Bulgaria",
    url: "https://yuichi.blog",
    siteName: "yuichi.blog",
    type: "website",
    locale: "ja_JP",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "yuichi.blog - A winding path through misty green hills",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "yuichi.blog",
    description: "Life, Tech & Vibes from Bulgaria",
    images: ["/opengraph-image"],
  },
  alternates: {
    canonical: "https://yuichi.blog",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "affd0be1a59630f9",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col overflow-x-hidden selection:bg-accent selection:text-white">
        <GoogleAnalytics />
        <AdSenseScript />
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

