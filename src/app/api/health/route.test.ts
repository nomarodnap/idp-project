import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "./route";

vi.mock("@/db", () => ({
  db: {
    execute: vi.fn(),
  },
}));

import { db } from "@/db";

describe("GET /api/health", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 200 with healthy status when DB query succeeds", async () => {
    vi.mocked(db.execute).mockResolvedValueOnce([] as any);

    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.status).toBe("healthy");
    expect(json.database.status).toBe("connected");
    expect(json.database.latencyMs).toBeTypeOf("number");
    expect(json.memory).toBeDefined();
    expect(json.uptimeSeconds).toBeTypeOf("number");
  });

  it("returns 503 with unhealthy status when DB query fails", async () => {
    vi.mocked(db.execute).mockRejectedValueOnce(new Error("Connection refused"));

    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(503);
    expect(json.status).toBe("unhealthy");
    expect(json.database.status).toBe("error");
    expect(json.database.latencyMs).toBeNull();
  });
});
