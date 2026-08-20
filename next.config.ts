import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['idp.fisheries.go.th', 'www.idp.fisheries.go.th'],
      bodySizeLimit: '10mb',
    }
  }
};

export default nextConfig;
