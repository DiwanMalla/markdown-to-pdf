import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Markdown to PDF Converter | Modern Online Editor",
  description:
    "Convert Markdown to PDF with a modern, live preview editor. Built with Next.js 15, Tailwind CSS, Monaco Editor, and GitHub-style rendering. Secure, fast, and user-friendly.",
  keywords: [
    "Markdown to PDF",
    "Markdown editor",
    "Online Markdown converter",
    "PDF export",
    "Next.js Markdown",
    "Monaco Editor",
    "GitHub Markdown preview",
    "Tailwind CSS",
    "React Markdown",
    "Free Markdown to PDF",
  ],
  openGraph: {
    title: "Markdown to PDF Converter | Modern Online Editor",
    description:
      "Convert Markdown to PDF with a modern, live preview editor. Built with Next.js 15, Tailwind CSS, Monaco Editor, and GitHub-style rendering.",
    url: "https://markdown-to-pdf.diwanmalla.com.au/",
    siteName: "Markdown to PDF Converter",
    images: [
      {
        url: "/window.svg",
        width: 1200,
        height: 630,
        alt: "Markdown to PDF Converter preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Markdown to PDF Converter | Modern Online Editor",
    description:
      "Convert Markdown to PDF with a modern, live preview editor. Built with Next.js 15, Tailwind CSS, Monaco Editor, and GitHub-style rendering.",
    images: ["/window.svg"],
    creator: "@diwanmalla",
  },
  metadataBase: new URL("https://markdown-to-pdf.diwanmalla.com.au/"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
