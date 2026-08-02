import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  experimental: {
    externalDir: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: `${process.env.API_URL}/api/auth/:path*`,
      },
      {
        source: "/api/invitations/:path*",
        destination: `${process.env.API_URL}/invitations/:path*`,
      },
    ];
  },
};

export default nextConfig;
