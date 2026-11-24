import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs/config";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['idp.fisheries.go.th', 'www.idp.fisheries.go.th'],
      bodySizeLimit: '10mb',
    }
  }
};

export default withSentryConfig(nextConfig, {
  org: "department-of-fisheries-thaila",
  project: "idp-app",
  silent: !process.env.CI,
  widenClientFileUpload: true,
});
