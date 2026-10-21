export interface UserPositionInfo {
  position?: string | null;
  level?: string | null;
  employeeType?: string | null;
  userPosition?: string | null;
  userLevel?: string | null;
  userEmployeeType?: string | null;
}

/**
 * Checks whether the given position starts with "ผู้อำนวยการเฉพาะด้าน"
 */
export function isSpecializedDirector(position?: string | null): boolean {
  if (!position) return false;
  return position.trim().startsWith("ผู้อำนวยการเฉพาะด้าน");
}

/**
 * Formats a user's position for display according to employee type guidelines:
 * - If employeeType is "ข้าราชการพลเรือนสามัญ":
 *   - If position starts with "ผู้อำนวยการเฉพาะด้าน", display ONLY position.
 *   - Otherwise, display position + level (or position if level is empty).
 * - For any other employeeType, display ONLY position.
 */
export function formatUserPosition(
  positionOrUser?: string | null | UserPositionInfo,
  levelOrOptions?: string | null | { fallback?: string },
  employeeType?: string | null,
  options?: { fallback?: string }
): string {
  let pos: string | null | undefined;
  let lvl: string | null | undefined;
  let empType: string | null | undefined;
  let fallback = "-";

  if (typeof positionOrUser === "object" && positionOrUser !== null) {
    pos = positionOrUser.position ?? positionOrUser.userPosition;
    lvl = positionOrUser.level ?? positionOrUser.userLevel;
    empType = positionOrUser.employeeType ?? positionOrUser.userEmployeeType;
    if (typeof levelOrOptions === "object" && levelOrOptions !== null) {
      fallback = levelOrOptions.fallback ?? "-";
    }
  } else {
    pos = positionOrUser;
    lvl = typeof levelOrOptions === "string" || levelOrOptions === null ? levelOrOptions : undefined;
    empType = employeeType;
    if (options?.fallback !== undefined) {
      fallback = options.fallback;
    }
  }

  if (!pos || !pos.trim()) {
    return fallback;
  }

  const trimmedPos = pos.trim();

  if (empType === "ข้าราชการพลเรือนสามัญ") {
    if (isSpecializedDirector(trimmedPos)) {
      return trimmedPos;
    }
    return lvl && lvl.trim() ? `${trimmedPos}${lvl.trim()}` : trimmedPos;
  }

  return trimmedPos;
}
