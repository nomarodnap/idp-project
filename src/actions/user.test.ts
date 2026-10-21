import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock next/headers
vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

// Mock next/cache
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

// Mock db
vi.mock("@/db", () => {
  const mockDb: any = {
    select: vi.fn(),
    update: vi.fn(),
  };
  return { db: mockDb };
});

import { cookies } from "next/headers";
import { db } from "@/db";
import { updateUserRole } from "./user";

describe("updateUserRole Permissions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const setupAuth = (userId: string | null, systemRole: string | null) => {
    if (!userId) {
      vi.mocked(cookies).mockResolvedValue({
        get: vi.fn().mockReturnValue(undefined),
      } as any);
      return;
    }

    vi.mocked(cookies).mockResolvedValue({
      get: vi.fn().mockReturnValue({ value: "test-session-token" }),
    } as any);

    let callCount = 0;
    vi.mocked(db.select).mockImplementation((() => {
      callCount++;
      return {
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockImplementation(() => {
            if (callCount === 1) {
              return Promise.resolve([{ userId }]);
            }
            if (callCount === 2) {
              return Promise.resolve([{ systemRole }]);
            }
            return Promise.resolve([]);
          }),
        }),
      } as any;
    }) as any);

    vi.mocked(db.update).mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([{ id: "target-user-id" }]),
      }),
    } as any);
  };

  it("allows Super Admin to update user role", async () => {
    setupAuth("superadmin-id", "Super Admin");

    const result = await updateUserRole("target-user-id", "Admin");

    expect(result).toEqual({ success: true });
    expect(db.update).toHaveBeenCalled();
  });

  it("blocks Admin from updating user role", async () => {
    setupAuth("admin-id", "Admin");

    const result = await updateUserRole("target-user-id", "Admin");

    expect(result).toEqual({
      error: "Unauthorized: มีเพียง Super Admin เท่านั้นที่สามารถปรับเปลี่ยน Role ได้",
    });
    expect(db.update).not.toHaveBeenCalled();
  });

  it("blocks regular User from updating user role", async () => {
    setupAuth("regular-user-id", "User");

    const result = await updateUserRole("target-user-id", "Admin");

    expect(result).toEqual({
      error: "Unauthorized: มีเพียง Super Admin เท่านั้นที่สามารถปรับเปลี่ยน Role ได้",
    });
    expect(db.update).not.toHaveBeenCalled();
  });

  it("blocks unauthenticated caller", async () => {
    setupAuth(null, null);

    const result = await updateUserRole("target-user-id", "Admin");

    expect(result).toEqual({ error: "Unauthorized" });
    expect(db.update).not.toHaveBeenCalled();
  });
});
