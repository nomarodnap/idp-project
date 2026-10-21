import { describe, it, expect } from "vitest";
import { formatUserPosition, isSpecializedDirector } from "./user";

describe("user position helper", () => {
  describe("isSpecializedDirector", () => {
    it("returns true for positions starting with ผู้อำนวยการเฉพาะด้าน", () => {
      expect(isSpecializedDirector("ผู้อำนวยการเฉพาะด้าน (วิชาการคอมพิวเตอร์)")).toBe(true);
      expect(isSpecializedDirector("ผู้อำนวยการเฉพาะด้าน")).toBe(true);
      expect(isSpecializedDirector("  ผู้อำนวยการเฉพาะด้านด้านวิศวกรรม ")).toBe(true);
    });

    it("returns false for other positions", () => {
      expect(isSpecializedDirector("ผู้อำนวยการกอง")).toBe(false);
      expect(isSpecializedDirector("นักวิชาการคอมพิวเตอร์")).toBe(false);
      expect(isSpecializedDirector(null)).toBe(false);
      expect(isSpecializedDirector("")).toBe(false);
    });
  });

  describe("formatUserPosition", () => {
    describe("ข้าราชการพลเรือนสามัญ", () => {
      it("displays position + level for standard positions", () => {
        expect(
          formatUserPosition("นักวิชาการคอมพิวเตอร์", "ปฏิบัติการ", "ข้าราชการพลเรือนสามัญ")
        ).toBe("นักวิชาการคอมพิวเตอร์ปฏิบัติการ");

        expect(
          formatUserPosition("ผู้อำนวยการกอง", "สูง", "ข้าราชการพลเรือนสามัญ")
        ).toBe("ผู้อำนวยการกองสูง");
      });

      it("displays ONLY position if position starts with ผู้อำนวยการเฉพาะด้าน", () => {
        expect(
          formatUserPosition(
            "ผู้อำนวยการเฉพาะด้าน (วิชาการคอมพิวเตอร์)",
            "เชี่ยวชาญ",
            "ข้าราชการพลเรือนสามัญ"
          )
        ).toBe("ผู้อำนวยการเฉพาะด้าน (วิชาการคอมพิวเตอร์)");

        expect(
          formatUserPosition(
            "ผู้อำนวยการเฉพาะด้าน",
            "ต้น",
            "ข้าราชการพลเรือนสามัญ"
          )
        ).toBe("ผู้อำนวยการเฉพาะด้าน");

        expect(
          formatUserPosition(
            "  ผู้อำนวยการเฉพาะด้าน (ด้านการแพทย์) ",
            "ทรงคุณวุฒิ",
            "ข้าราชการพลเรือนสามัญ"
          )
        ).toBe("ผู้อำนวยการเฉพาะด้าน (ด้านการแพทย์)");
      });

      it("handles missing level gracefully", () => {
        expect(
          formatUserPosition("นักวิชาการคอมพิวเตอร์", null, "ข้าราชการพลเรือนสามัญ")
        ).toBe("นักวิชาการคอมพิวเตอร์");

        expect(
          formatUserPosition("นักวิชาการคอมพิวเตอร์", "", "ข้าราชการพลเรือนสามัญ")
        ).toBe("นักวิชาการคอมพิวเตอร์");
      });
    });

    describe("other employee types", () => {
      it("displays ONLY position regardless of level for พนักงานราชการทั่วไป", () => {
        expect(
          formatUserPosition("เจ้าพนักงานธุรการ", "ชำนาญงาน", "พนักงานราชการทั่วไป")
        ).toBe("เจ้าพนักงานธุรการ");
      });

      it("displays ONLY position regardless of level for ลูกจ้างประจำ", () => {
        expect(
          formatUserPosition("พนักงานขับรถยนต์", "บ2", "ลูกจ้างประจำ")
        ).toBe("พนักงานขับรถยนต์");
      });

      it("displays ONLY position when starts with ผู้อำนวยการเฉพาะด้าน for other types", () => {
        expect(
          formatUserPosition("ผู้อำนวยการเฉพาะด้าน", "เชี่ยวชาญ", "พนักงานราชการทั่วไป")
        ).toBe("ผู้อำนวยการเฉพาะด้าน");
      });
    });

    describe("object input support", () => {
      it("formats user object correctly", () => {
        const user = {
          position: "นักวิชาการคอมพิวเตอร์",
          level: "ชำนาญการ",
          employeeType: "ข้าราชการพลเรือนสามัญ",
        };
        expect(formatUserPosition(user)).toBe("นักวิชาการคอมพิวเตอร์ชำนาญการ");
      });

      it("formats plan object with userPosition/userLevel/userEmployeeType", () => {
        const plan = {
          userPosition: "ผู้อำนวยการเฉพาะด้าน (วิชาการคอมพิวเตอร์)",
          userLevel: "เชี่ยวชาญ",
          userEmployeeType: "ข้าราชการพลเรือนสามัญ",
        };
        expect(formatUserPosition(plan)).toBe("ผู้อำนวยการเฉพาะด้าน (วิชาการคอมพิวเตอร์)");
      });

      it("accepts custom fallback option", () => {
        expect(formatUserPosition(null, undefined, undefined, { fallback: "บุคลากร" })).toBe("บุคลากร");
        expect(formatUserPosition({}, { fallback: "บุคลากร" })).toBe("บุคลากร");
      });
    });
  });
});
