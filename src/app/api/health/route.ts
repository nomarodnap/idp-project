import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const startTime = performance.now();
  let dbStatus = "disconnected";
  let dbLatency = -1;
  let isHealthy = false;

  try {
    const dbStart = performance.now();
    await db.execute(sql`SELECT 1`);
    dbLatency = Math.round(performance.now() - dbStart);
    dbStatus = "connected";
    isHealthy = true;
  } catch (error) {
    console.error("Health check database error:", error);
    dbStatus = "error";
    isHealthy = false;
  }

  const memoryUsage = process.memoryUsage();
  const formatMB = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

  const responsePayload = {
    status: isHealthy ? "healthy" : "unhealthy",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      status: dbStatus,
      latencyMs: dbLatency >= 0 ? dbLatency : null,
    },
    memory: {
      heapUsed: formatMB(memoryUsage.heapUsed),
      heapTotal: formatMB(memoryUsage.heapTotal),
      rss: formatMB(memoryUsage.rss),
    },
    environment: process.env.NODE_ENV || "development",
  };

  return NextResponse.json(responsePayload, {
    status: isHealthy ? 200 : 503,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    },
  });
}
