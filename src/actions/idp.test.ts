import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock next/headers
vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

// Mock next/cache
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

// Mock settings
vi.mock("@/actions/settings", () => ({
  getSystemPhase: vi.fn().mockResolvedValue(1),
}));

// Mock date
vi.mock("@/lib/date", () => ({
  getCurrentFiscalYear: vi.fn().mockReturnValue(2567),
  formatThaiDate: vi.fn().mockReturnValue("1 ม.ค. 2567"),
}));

// Mock db
vi.mock("@/db", () => {
  const mockDb: any = {
    select: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    insert: vi.fn(),
  };
  return { db: mockDb };
});

import { cookies } from "next/headers";
import { db } from "@/db";
import { updateIDPPlan, deleteIDPPlan, evaluateIDPPlan } from "./idp";

describe("Admin Permissions for IDP Plans", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const setupAuth = (userId: string, systemRole: string) => {
    vi.mocked(cookies).mockResolvedValue({
      get: vi.fn().mockReturnValue({ value: "test-session-token" }),
    } as any);

    // Mock select for getAuthContext:
    // First query: sessionTable
    // Second query: users table
    let callCount = 0;
    vi.mocked(db.select).mockImplementation((() => {
      callCount++;
      return {
        from: vi.fn().mockReturnValue({
          leftJoin: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue([
                {
                  id: "plan-1",
                  userId: "user-target",
                  fiscalYear: 2567,
                  status: "Pending",
                  selfEvaluationResult: null,
                },
              ]),
            }),
          }),
          where: vi.fn().mockImplementation(() => {
            if (callCount === 1) {
              return Promise.resolve([{ userId }]);
            }
            if (callCount === 2) {
              return Promise.resolve([
                {
                  id: userId,
                  systemRole,
                  department: "IT",
                  division: "Dev",
                  employeeType: "ข้าราชการพลเรือนสามัญ",
                },
              ]);
            }
            // For deleteIDPPlan query
            return Promise.resolve([
              { id: "plan-1", fiscalYear: 2567, userId: "user-target" },
            ]);
          }),
        }),
      } as any;
    }) as any);

    vi.mocked(db.update).mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([{ id: "plan-1" }]),
      }),
    } as any);

    vi.mocked(db.delete).mockReturnValue({
      where: vi.fn().mockResolvedValue([{ id: "plan-1" }]),
    } as any);
  };

  describe("updateIDPPlan", () => {
    it("allows Admin to update another user's plan", async () => {
      setupAuth("admin-user", "Admin");

      const result = await updateIDPPlan("plan-1", {
        devCategory: "ทักษะ",
        devTopic: "การใช้คอมพิวเตอร์",
        courseTitle: "Next.js Advanced",
        dev70: "Practice",
        dev20: "Mentoring",
        dev10: "Training",
        supervisorName: "Boss",
        supervisorPosition: "Director",
      });

      expect(result).toEqual({ success: true });
      expect(db.update).toHaveBeenCalled();
    });

    it("allows Super Admin to update another user's plan", async () => {
      setupAuth("superadmin-user", "Super Admin");

      const result = await updateIDPPlan("plan-1", {
        devCategory: "ทักษะ",
        devTopic: "การใช้คอมพิวเตอร์",
        courseTitle: "Next.js Advanced",
        dev70: "Practice",
        dev20: "Mentoring",
        dev10: "Training",
        supervisorName: "Boss",
        supervisorPosition: "Director",
      });

      expect(result).toEqual({ success: true });
      expect(db.update).toHaveBeenCalled();
    });

    it("prevents regular User from updating another user's plan", async () => {
      setupAuth("regular-user", "User");

      const result = await updateIDPPlan("plan-1", {
        devCategory: "ทักษะ",
        devTopic: "การใช้คอมพิวเตอร์",
        courseTitle: "Next.js Advanced",
        dev70: "Practice",
        dev20: "Mentoring",
        dev10: "Training",
        supervisorName: "Boss",
        supervisorPosition: "Director",
      });

      expect(result).toEqual({ error: "Unauthorized" });
    });
  });

  describe("deleteIDPPlan", () => {
    it("allows Admin to delete another user's plan", async () => {
      setupAuth("admin-user", "Admin");

      const result = await deleteIDPPlan("plan-1");

      expect(result).toEqual({ success: true });
      expect(db.delete).toHaveBeenCalled();
    });

    it("prevents regular User from deleting another user's plan", async () => {
      setupAuth("regular-user", "User");

      const result = await deleteIDPPlan("plan-1");

      expect(result).toEqual({ error: "Unauthorized to delete this plan" });
    });
  });

  describe("evaluateIDPPlan", () => {
    it("allows Admin to evaluate another user's plan as Success", async () => {
      setupAuth("admin-user", "Admin");

      const result = await evaluateIDPPlan("plan-1", "Success");

      expect(result).toEqual({ success: true });
      expect(db.update).toHaveBeenCalled();
    });

    it("allows Admin to reset another user's plan evaluation", async () => {
      setupAuth("admin-user", "Admin");

      const result = await evaluateIDPPlan("plan-1", "Reset");

      expect(result).toEqual({ success: true });
      expect(db.update).toHaveBeenCalled();
    });

    it("prevents regular User from evaluating another user's plan", async () => {
      setupAuth("regular-user", "User");

      const result = await evaluateIDPPlan("plan-1", "Success");

      expect(result).toEqual({ error: "The system is not currently open for evaluation." });
    });
  });
});
