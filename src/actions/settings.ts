"use server";

import { db } from "@/db";
import { systemSettings, session as sessionTable, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function getSystemPhase(): Promise<number> {
  try {
    const [setting] = await db
      .select()
      .from(systemSettings)
      .where(eq(systemSettings.key, "IDP_PHASE"));
    
    if (setting) {
      return parseInt(setting.value, 10);
    }
  } catch (error) {
    console.error("Error fetching IDP_PHASE:", error);
  }
  return 1; // Default to phase 1
}

export async function updateSystemPhase(phase: number) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("better-auth.session_token")?.value;

  if (!sessionToken) {
    return { error: "Unauthorized" };
  }

  const [sessionRecord] = await db
    .select()
    .from(sessionTable)
    .where(eq(sessionTable.token, sessionToken));

  if (!sessionRecord) {
    return { error: "Unauthorized" };
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, sessionRecord.userId));

  if (!user) {
    return { error: "Unauthorized: User not found" };
  }

  // TODO: Add back Admin check when role system is ready
  // if (user.systemRole !== "Admin") {
  //   return { error: "Unauthorized: Admins only" };
  // }

  try {
    await db
      .insert(systemSettings)
      .values({ key: "IDP_PHASE", value: phase.toString(), updatedAt: new Date() })
      .onConflictDoUpdate({
        target: systemSettings.key,
        set: { value: phase.toString(), updatedAt: new Date() }
      });
      
    revalidatePath("/", "layout"); // Revalidate all paths to ensure phase change reflects globally
    
    return { success: true };
  } catch (error: any) {
    console.error("Error updating IDP_PHASE:", error);
    return { error: error.message || "Failed to update phase" };
  }
}
