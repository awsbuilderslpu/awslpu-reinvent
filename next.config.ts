import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    cpus: 1,
    agentUpgrade: "security",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dqq6hmbhjgrfe.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "static.awslpu.in",
      },
    ],
  },
};

export default nextConfig;
