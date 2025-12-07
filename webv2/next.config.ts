import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Mirror legacy dev proxies from the Vite setup for API and NuGet feeds.
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5228/api/:path*",
      },
      {
        source: "/v3/:path*",
        destination: "http://localhost:5228/v3/:path*",
      },
    ];
  },
};

export default nextConfig;
