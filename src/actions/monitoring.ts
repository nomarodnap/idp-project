"use server";

import { db } from "@/db";
import { sql } from "drizzle-orm";
import { cookies } from "next/headers";
import { session as sessionTable, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export interface SystemMetrics {
  database: {
    status: "connected" | "error";
    latencyMs: number;
    totalSize: string;
    totalSizeBytes: number;
    tables: {
      tableName: string;
      totalSize: string;
      totalBytes: number;
    }[];
  };
  announcementsStorage: {
    key: string;
    sizeBytes: number;
    sizeFormatted: string;
  }[];
  stats: {
    totalUsers: number;
    activeSessions: number;
    totalIdpPlans: number;
  };
  server: {
    uptimeSeconds: number;
    nodeVersion: string;
    heapUsed: string;
    heapTotal: string;
    rss: string;
    environment: string;
  };
  checkedAt: string;
}

async function checkAdminAuth() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("better-auth.session_token")?.value;

  if (!sessionToken) return false;

  const [sessionRecord] = await db
    .select()
    .from(sessionTable)
    .where(eq(sessionTable.token, sessionToken));

  if (!sessionRecord) return false;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, sessionRecord.userId));

  if (!user) return false;

  return true;
}

export async function getSystemMetrics(): Promise<{ data?: SystemMetrics; error?: string }> {
  const isAuthorized = await checkAdminAuth();
  if (!isAuthorized) {
    return { error: "Unauthorized" };
  }

  try {
    // 1. Measure DB Ping Latency
    const dbStart = performance.now();
    await db.execute(sql`SELECT 1`);
    const latencyMs = Math.round(performance.now() - dbStart);

    // 2. Query Total Database Size
    const dbSizeResult = await db.execute<{ db_size: string; bytes: string }>(
      sql`SELECT pg_size_pretty(pg_database_size(current_database())) as db_size, pg_database_size(current_database())::text as bytes`
    );
    const totalSize = dbSizeResult[0]?.db_size || "N/A";
    const totalSizeBytes = parseInt(dbSizeResult[0]?.bytes || "0", 10);

    // 3. Query User Tables Size Breakdown
    const tableSizesResult = await db.execute<{
      table_name: string;
      total_size: string;
      total_bytes: string;
    }>(
      sql`
        SELECT 
          relname AS table_name,
          pg_size_pretty(pg_total_relation_size(relid)) AS total_size,
          pg_total_relation_size(relid)::text AS total_bytes
        FROM pg_catalog.pg_statio_user_tables
        ORDER BY pg_total_relation_size(relid) DESC
      `
    );

    const tables = tableSizesResult.map((t) => ({
      tableName: t.table_name,
      totalSize: t.total_size,
      totalBytes: parseInt(t.total_bytes || "0", 10),
    }));

    // 4. Query Announcement Base64 Sizes
    const announcementSizesResult = await db.execute<{
      key: string;
      char_length: number;
    }>(
      sql`
        SELECT 
          key, 
          length(value) as char_length
        FROM system_settings 
        WHERE key LIKE 'ANNOUNCEMENT_%'
        ORDER BY key ASC
      `
    );

    const formatBytes = (bytes: number) => {
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    const announcementsStorage = announcementSizesResult.map((item) => ({
      key: item.key,
      sizeBytes: item.char_length,
      sizeFormatted: formatBytes(item.char_length),
    }));

    // 5. Query App Counts
    const userCountResult = await db.execute<{ count: string }>(
      sql`SELECT count(*)::text as count FROM users`
    );
    const sessionCountResult = await db.execute<{ count: string }>(
      sql`SELECT count(*)::text as count FROM session WHERE "expiresAt" > NOW()`
    );
    const idpCountResult = await db.execute<{ count: string }>(
      sql`SELECT count(*)::text as count FROM idp_plans`
    );

    // 6. Server Process Info
    const mem = process.memoryUsage();
    const formatMB = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

    const metrics: SystemMetrics = {
      database: {
        status: "connected",
        latencyMs,
        totalSize,
        totalSizeBytes,
        tables,
      },
      announcementsStorage,
      stats: {
        totalUsers: parseInt(userCountResult[0]?.count || "0", 10),
        activeSessions: parseInt(sessionCountResult[0]?.count || "0", 10),
        totalIdpPlans: parseInt(idpCountResult[0]?.count || "0", 10),
      },
      server: {
        uptimeSeconds: Math.floor(process.uptime()),
        nodeVersion: process.version,
        heapUsed: formatMB(mem.heapUsed),
        heapTotal: formatMB(mem.heapTotal),
        rss: formatMB(mem.rss),
        environment: process.env.NODE_ENV || "development",
      },
      checkedAt: new Date().toISOString(),
    };

    return { data: metrics };
  } catch (error: any) {
    console.error("Error collecting system metrics:", error);
    return { error: error.message || "Failed to load metrics" };
  }
}
