"use server";

import { db } from "@/db";
import { systemSettings, session as sessionTable, users } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const ANNOUNCEMENT_KEYS = [
  "ANNOUNCEMENT_IMAGE_1",
  "ANNOUNCEMENT_IMAGE_2",
  "ANNOUNCEMENT_IMAGE_3",
  "ANNOUNCEMENT_IMAGE_4",
];

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
  
  // TODO: Un-comment when systemRole is fully used
  // if (user.systemRole !== "Admin") return false;
  
  return true;
}

export async function getAnnouncements() {
  try {
    const records = await db
      .select()
      .from(systemSettings)
      .where(inArray(systemSettings.key, ANNOUNCEMENT_KEYS));

    const result = ANNOUNCEMENT_KEYS.map((key) => {
      const record = records.find((r) => r.key === key);
      return record ? record.value : null;
    });

    return result;
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return [null, null, null, null];
  }
}

export async function saveAnnouncement(index: number, base64Data: string) {
  if (!(await checkAdminAuth())) {
    return { error: "Unauthorized" };
  }

  if (index < 0 || index > 3) {
    return { error: "Invalid index" };
  }

  const key = ANNOUNCEMENT_KEYS[index];

  try {
    await db
      .insert(systemSettings)
      .values({ key, value: base64Data, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: systemSettings.key,
        set: { value: base64Data, updatedAt: new Date() },
      });

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    console.error("Error saving announcement:", error);
    return { error: error.message || "Failed to save announcement" };
  }
}

export async function deleteAnnouncement(index: number) {
  if (!(await checkAdminAuth())) {
    return { error: "Unauthorized" };
  }

  if (index < 0 || index > 3) {
    return { error: "Invalid index" };
  }

  const key = ANNOUNCEMENT_KEYS[index];

  try {
    await db
      .delete(systemSettings)
      .where(eq(systemSettings.key, key));

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting announcement:", error);
    return { error: error.message || "Failed to delete announcement" };
  }
}
