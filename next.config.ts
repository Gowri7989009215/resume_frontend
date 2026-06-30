import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow pdfkit and pdf-parse to work in Node.js runtime API routes
  serverExternalPackages: ["pdfkit", "pdf-parse"],

  // Disable x-powered-by header for production readiness
  poweredByHeader: false,

  // Compress responses
  compress: true,
};

export default nextConfig;
