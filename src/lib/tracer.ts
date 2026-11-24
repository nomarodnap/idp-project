import { trace, type Tracer, SpanStatusCode } from "@opentelemetry/api";

/**
 * Global OpenTelemetry Tracer for the IDP application.
 * When running with @sentry/nextjs, this tracer connects directly to
 * Sentry's TracerProvider, recording all spans as native Sentry performance spans.
 */
export const tracer: Tracer = trace.getTracer("idp-app");

/**
 * Execute an async operation within an active OpenTelemetry span.
 *
 * @param name The span name (e.g. "db.query", "auth.verifyToken")
 * @param fn The callback function receiving the active span
 * @param attributes Optional initial span attributes
 */
export async function withSpan<T>(
  name: string,
  fn: (span: import("@opentelemetry/api").Span) => Promise<T>,
  attributes?: Record<string, string | number | boolean>
): Promise<T> {
  return tracer.startActiveSpan(name, { attributes }, async (span) => {
    try {
      const result = await fn(span);
      return result;
    } catch (error) {
      if (error instanceof Error) {
        span.recordException(error);
        span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
      }
      throw error;
    } finally {
      span.end();
    }
  });
}
