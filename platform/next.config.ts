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
      {
        source: "/api/doctor-profile/:path*",
        destination: `${process.env.API_URL}/doctor-profile/:path*`,
      },
      {
        source: "/api/appointment",
        destination: `${process.env.API_URL}/appointment`,
      },
    ];
  },
};

export default nextConfig;
