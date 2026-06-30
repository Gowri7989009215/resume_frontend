import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/providers";

export const metadata: Metadata = {
  title: "AI Resume Analyzer | ATS Resume Checker Online – ResumeIQ",
  description:
    "Upload your resume, get ATS score and instantly improve your resume professionally. Free AI-powered ATS resume analyzer and optimizer.",
  keywords: [
    "ATS resume checker",
    "AI resume analyzer",
    "resume score",
    "ATS optimizer",
    "resume improvement",
    "job application",
    "career tools",
  ],
  openGraph: {
    title: "ResumeIQ – AI Resume Analyzer & ATS Optimizer",
    description:
      "Upload your resume, get ATS score and instantly improve your resume professionally.",
    type: "website",
    locale: "en_US",
    siteName: "ResumeIQ",
  },
  twitter: {
    card: "summary_large_image",
    title: "ResumeIQ – AI Resume Analyzer & ATS Optimizer",
    description:
      "Upload your resume and get an instant ATS score with improvement suggestions.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://resumeiq.app" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className="font-sans bg-white text-slate-900 antialiased flex flex-col min-h-screen">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
