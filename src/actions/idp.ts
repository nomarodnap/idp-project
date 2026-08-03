"use server";

import { db } from "@/db";
import { idpPlans, users, session as sessionTable } from "@/db/schema";
import { eq, desc, and, ilike } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import crypto from "crypto";
import { getSystemPhase } from "@/actions/settings";
import { getDerivedPlanStatus } from "@/lib/idp";
import { getCurrentFiscalYear } from "@/lib/date";

export async function getIDPPlans(options?: { fetchAll?: boolean, statusFilter?: string }) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("better-auth.session_token")?.value;
  let currentUserId: string | null = null;
  let currentUserRole: string | null = null;
  let currentUserDepartment: string | null = null;
  let currentUserDivision: string | null = null;

  if (sessionToken) {
    const [sessionRecord] = await db
      .select({ userId: sessionTable.userId })
      .from(sessionTable)
      .where(eq(sessionTable.token, sessionToken));
    if (sessionRecord) {
      currentUserId = sessionRecord.userId;
      
      const [userRecord] = await db
        .select({ systemRole: users.systemRole, department: users.department, division: users.division })
        .from(users)
        .where(eq(users.id, currentUserId));
        
      if (userRecord) {
        currentUserRole = userRecord.systemRole;
        currentUserDepartment = userRecord.department;
        currentUserDivision = userRecord.division;
      }
    }
  }

  let query = db.select({
    id: idpPlans.id,
    planCode: idpPlans.planCode,
    userId: idpPlans.userId,
    userCitizenId: users.citizenId,
    userTitle: users.title,
    userFirstName: users.firstName,
    userLastName: users.lastName,
    userName: users.name,
    userPosition: users.position,
    userEmployeeType: users.employeeType,
    userLevel: users.level,
    userDepartment: users.department,
    userDivision: users.division,
    userAvatarUrl: users.avatarUrl,
    userImage: users.image,
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
    selfEvaluationResult: idpPlans.selfEvaluationResult,
    createdAt: idpPlans.createdAt,
    updatedAt: idpPlans.updatedAt,
  })
  .from(idpPlans)
  .leftJoin(users, eq(idpPlans.userId, users.id))
  .$dynamic();

  if (!options?.fetchAll && currentUserId) {
    query = query.where(eq(idpPlans.userId, currentUserId));
  } else if (options?.fetchAll && currentUserId) {
    if (currentUserRole === "Viewer_Department" && currentUserDepartment) {
      query = query.where(eq(users.department, currentUserDepartment));
    } else if (currentUserRole === "Viewer_Division" && currentUserDivision) {
      query = query.where(eq(users.division, currentUserDivision));
    }
  }

  // Note: We remove the direct DB `statusFilter` because status is now derived.
  // We will filter after deriving.
  const results = await query.orderBy(desc(idpPlans.createdAt));
  const phase = await getSystemPhase();
  const currentFiscalYear = getCurrentFiscalYear();

  const derivedResults = results.map(plan => ({
    ...plan,
    status: getDerivedPlanStatus(phase, plan.selfEvaluationResult, plan.fiscalYear, currentFiscalYear)
  }));

  if (options?.statusFilter) {
    return derivedResults.filter(p => p.status === options.statusFilter);
  }

  return derivedResults;
}

export async function getIDPPlanById(id: string) {
  const result = await db.select({
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
    selfEvaluationResult: idpPlans.selfEvaluationResult,
    createdAt: idpPlans.createdAt,
    updatedAt: idpPlans.updatedAt,
  })
  .from(idpPlans)
  .leftJoin(users, eq(idpPlans.userId, users.id))
  .where(eq(idpPlans.id, id))
  .limit(1);
  const plan = result[0];
  const phase = await getSystemPhase();
  const currentFiscalYear = getCurrentFiscalYear();
  
  if (plan) {
    plan.status = getDerivedPlanStatus(phase, plan.selfEvaluationResult, plan.fiscalYear, currentFiscalYear);
  }
  
  return plan;
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

  const IDP_PHASE = await getSystemPhase();
  if (IDP_PHASE !== 1) {
    return { error: "The system is not currently open for creating plans." };
  }

  const [sessionRecord] = await db
    .select()
    .from(sessionTable)
    .where(eq(sessionTable.token, sessionToken));

  if (!sessionRecord) {
    return { error: "Unauthorized" };
  }

  const currentYear = getCurrentFiscalYear();

  // Check if user already has 3 plans this fiscal year
  const existingUserPlans = await db.select({ id: idpPlans.id })
    .from(idpPlans)
    .where(and(eq(idpPlans.userId, sessionRecord.userId), eq(idpPlans.fiscalYear, currentYear)));

  if (existingUserPlans.length >= 3) {
    return { error: `คุณได้สร้างแผนพัฒนาสำหรับปีงบประมาณ ${currentYear} ครบโควตา 3 แผนแล้ว` };
  }

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

    const IDP_PHASE = await getSystemPhase();
    if (IDP_PHASE > 2) {
      return { error: "The system is not currently open for editing plans." };
    }

    if (existingPlan.fiscalYear !== getCurrentFiscalYear()) {
      return { error: "Cannot edit plans from previous fiscal years." };
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

  const IDP_PHASE = await getSystemPhase();
  if (IDP_PHASE !== 1) {
    return { error: "The system is not currently open for deleting plans." };
  }

  try {
    // Only allow deletion if user owns the plan
    const [existingPlan] = await db
      .select({ id: idpPlans.id, fiscalYear: idpPlans.fiscalYear })
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

    if (existingPlan.fiscalYear !== getCurrentFiscalYear()) {
      return { error: "Cannot delete plans from previous fiscal years." };
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

export async function evaluateIDPPlan(id: string, result: string) {
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

  const IDP_PHASE = await getSystemPhase();
  if (IDP_PHASE !== 4) {
    return { error: "The system is not currently open for evaluation." };
  }

  try {
    const existingPlan = await getIDPPlanById(id);
    if (!existingPlan) {
      return { error: "Plan not found" };
    }

    if (existingPlan.userId !== sessionRecord.userId) {
      return { error: "Unauthorized" };
    }

    if (existingPlan.fiscalYear !== getCurrentFiscalYear()) {
      return { error: "Cannot evaluate plans from previous fiscal years." };
    }

    await db.update(idpPlans).set({
      selfEvaluationResult: result,
      updatedAt: new Date(),
    }).where(eq(idpPlans.id, id));

    revalidatePath("/idp");
    revalidatePath(`/idp/${id}`);
    
    return { success: true };
  } catch (error: any) {
    console.error("Error evaluating IDP Plan:", error);
    return { error: error.message || "Failed to evaluate IDP plan" };
  }
}

export async function getPlansForSupervisor() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("better-auth.session_token")?.value;

  if (!sessionToken) {
    return [];
  }

  const [sessionRecord] = await db
    .select({ userId: sessionTable.userId })
    .from(sessionTable)
    .where(eq(sessionTable.token, sessionToken));

  if (!sessionRecord) {
    return [];
  }

  const [currentUser] = await db
    .select({
      title: users.title,
      firstName: users.firstName,
      lastName: users.lastName,
      position: users.position,
      level: users.level,
      employeeType: users.employeeType,
    })
    .from(users)
    .where(eq(users.id, sessionRecord.userId));

  if (!currentUser) {
    return [];
  }

  const expectedSupervisorPosition = currentUser.employeeType === "ข้าราชการพลเรือนสามัญ" && currentUser.level 
    ? `${currentUser.position || ""}${currentUser.level}`
    : currentUser.position || "";

  const plans = await db.select({
    id: idpPlans.id,
    planCode: idpPlans.planCode,
    userId: idpPlans.userId,
    userName: users.name,
    userPosition: users.position,
    userEmployeeType: users.employeeType,
    userLevel: users.level,
    userDepartment: users.department,
    userDivision: users.division,
    userAvatarUrl: users.avatarUrl,
    userImage: users.image,
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
    selfEvaluationResult: idpPlans.selfEvaluationResult,
    createdAt: idpPlans.createdAt,
    updatedAt: idpPlans.updatedAt,
  })
  .from(idpPlans)
  .leftJoin(users, eq(idpPlans.userId, users.id))
  .where(
    and(
      // Ensure the positions match based on employee type rules
      eq(idpPlans.supervisorPosition, expectedSupervisorPosition),
      // Ensure the name string contains title, first, and last name
      ilike(idpPlans.supervisorName, `%${currentUser.title || ""}%`),
      ilike(idpPlans.supervisorName, `%${currentUser.firstName || ""}%`),
      ilike(idpPlans.supervisorName, `%${currentUser.lastName || ""}%`)
    )
  )
  .orderBy(desc(idpPlans.createdAt));

  const phase = await getSystemPhase();
  const currentFiscalYear = getCurrentFiscalYear();

  return plans.map(p => ({
    ...p,
    status: getDerivedPlanStatus(phase, p.selfEvaluationResult, p.fiscalYear, currentFiscalYear)
  }));
}
