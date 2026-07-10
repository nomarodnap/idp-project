"use server";

import { db } from "@/db";
import { idpPlans, users, session as sessionTable } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import crypto from "crypto";

export async function getIDPPlans(statusFilter?: string) {
  const query = db.select({
    id: idpPlans.id,
    planCode: idpPlans.planCode,
    userId: idpPlans.userId,
    userName: users.name,
    userPosition: users.position,
    userEmployeeType: users.employeeType,
    userLevel: users.level,
    userDepartment: users.department,
    userDivision: users.division,
    fiscalYear: idpPlans.fiscalYear,
    devCategory: idpPlans.devCategory,
    devTopic: idpPlans.devTopic,
    courseTitle: idpPlans.courseTitle,
    dev70: idpPlans.dev70,
    dev20: idpPlans.dev20,
    dev10: idpPlans.dev10,
    supervisorName: idpPlans.supervisorName,
    supervisorPosition: idpPlans.supervisorPosition,
    status: idpPlans.status,
    createdAt: idpPlans.createdAt,
    updatedAt: idpPlans.updatedAt,
  })
  .from(idpPlans)
  .leftJoin(users, eq(idpPlans.userId, users.id));

  if (statusFilter) {
    return await query.where(eq(idpPlans.status, statusFilter)).orderBy(desc(idpPlans.createdAt));
  }
  return await query.orderBy(desc(idpPlans.createdAt));
}

export async function getIDPPlanById(id: string) {
  const result = await db.select().from(idpPlans).where(eq(idpPlans.id, id)).limit(1);
  return result[0];
}

export async function updateIDPStatus(id: string, status: string) {
  await db.update(idpPlans).set({ status, updatedAt: new Date() }).where(eq(idpPlans.id, id));
  revalidatePath("/admin/approvals");
  revalidatePath("/idp");
  revalidatePath("/");
}

export async function createIDPPlan(data: any) {
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

  const currentYear = new Date().getFullYear() + 543; // Thai year

  // Generate unique planCode: IDP-YY-XXXXXX
  const shortYear = currentYear.toString().slice(-2);
  const randomStr = crypto.randomBytes(3).toString("hex").toUpperCase();
  const planCode = `IDP-${shortYear}-${randomStr}`;

  try {
    const [newPlan] = await db.insert(idpPlans).values({
      userId: sessionRecord.userId,
      planCode: planCode,
      fiscalYear: currentYear,
      devCategory: data.devCategory,
      devTopic: data.devTopic,
      courseTitle: data.courseTitle,
      dev70: data.dev70,
      dev20: data.dev20,
      dev10: data.dev10,
      supervisorName: data.supervisorName,
      supervisorPosition: data.supervisorPosition,
      status: "Pending", // รออนุมัติ
    }).returning();

    revalidatePath("/idp");
    revalidatePath("/");
    revalidatePath("/admin/approvals");
    
    return { success: true, planId: newPlan.id };
  } catch (error: any) {
    console.error("Error creating IDP:", error);
    return { error: error.message || "Failed to create IDP plan" };
  }
}

export async function updateIDPPlan(id: string, data: any) {
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

  try {
    const existingPlan = await getIDPPlanById(id);
    if (!existingPlan) {
      return { error: "Plan not found" };
    }

    if (existingPlan.userId !== sessionRecord.userId) {
      return { error: "Unauthorized" };
    }

    // Only allow edit if not approved/completed
    if (existingPlan.status === "Approved" || existingPlan.status === "อนุมัติแล้ว" || existingPlan.status === "Completed" || existingPlan.status === "เสร็จสิ้น") {
      return { error: "Cannot edit an approved plan" };
    }

    await db.update(idpPlans).set({
      devCategory: data.devCategory,
      devTopic: data.devTopic,
      courseTitle: data.courseTitle,
      dev70: data.dev70,
      dev20: data.dev20,
      dev10: data.dev10,
      supervisorName: data.supervisorName,
      supervisorPosition: data.supervisorPosition,
      status: "Pending", // Reset status back to pending after edit
      updatedAt: new Date(),
    }).where(eq(idpPlans.id, id));

    revalidatePath("/idp");
    revalidatePath(`/idp/${id}`);
    revalidatePath("/");
    revalidatePath("/admin/approvals");
    
    return { success: true };
  } catch (error: any) {
    console.error("Error updating IDP:", error);
    return { error: error.message || "Failed to update IDP plan" };
  }
}

export async function deleteIDPPlan(id: string) {
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

  try {
    // Only allow deletion if user owns the plan
    const [existingPlan] = await db
      .select({ id: idpPlans.id })
      .from(idpPlans)
      .where(
        and(
          eq(idpPlans.id, id),
          eq(idpPlans.userId, sessionRecord.userId)
        )
      );

    if (!existingPlan) {
      return { error: "Plan not found or unauthorized to delete" };
    }

    await db.delete(idpPlans).where(eq(idpPlans.id, id));

    revalidatePath("/idp");
    revalidatePath("/");
    
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting IDP Plan:", error);
    return { error: error.message || "Failed to delete IDP plan" };
  }
}
