"use server";

import { db } from "@/db";
import { users, session as sessionTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updateAvatar(url: string) {
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

  await db
    .update(users)
    .set({
      avatarUrl: url,
      updatedAt: new Date(),
    })
    .where(eq(users.id, sessionRecord.userId));

  // Revalidate the layout so the header and profile page reflect the new avatar
  revalidatePath("/", "layout");

  return { success: true };
}

export async function getUsers() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("better-auth.session_token")?.value;
  let currentUserRole: string | null = null;
  let currentUserDepartment: string | null = null;
  let currentUserDivision: string | null = null;

  if (sessionToken) {
    const [sessionRecord] = await db
      .select({ userId: sessionTable.userId })
      .from(sessionTable)
      .where(eq(sessionTable.token, sessionToken));
    if (sessionRecord) {
      const [userRecord] = await db
        .select({ systemRole: users.systemRole, department: users.department, division: users.division })
        .from(users)
        .where(eq(users.id, sessionRecord.userId));
        
      if (userRecord) {
        currentUserRole = userRecord.systemRole;
        currentUserDepartment = userRecord.department;
        currentUserDivision = userRecord.division;
      }
    }
  }

  let query = db.select().from(users).$dynamic();
  
  if (currentUserRole === "Viewer_Department" && currentUserDepartment) {
    query = query.where(eq(users.department, currentUserDepartment));
  } else if (currentUserRole === "Viewer_Division" && currentUserDivision) {
    query = query.where(eq(users.division, currentUserDivision));
  }

  return await query.orderBy(users.firstName);
}

export async function updateUserRole(id: string, role: string) {
  await db.update(users).set({ systemRole: role }).where(eq(users.id, id));
  revalidatePath("/admin/users");
}

export async function updateUserSupervisor(id: string, supervisorId: string) {
  await db.update(users).set({ supervisorId: supervisorId }).where(eq(users.id, id));
  revalidatePath("/admin/users");
}

