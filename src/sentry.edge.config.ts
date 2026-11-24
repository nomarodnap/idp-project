import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || "https://b246e8e3c7cc13061f2c2343aa0d506a@o4512484713431040.ingest.de.sentry.io/4512485295652945",

  // Enable OpenTelemetry integration
  enableOpenTelemetrySetup: true,

  // Enables Tracing
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
});
