"use server";

import { db } from "@/db";
import { competencyCategories, trainingCourses } from "@/db/schema";
import { revalidatePath } from "next/cache";

// -------------------------------------------------------------
// Competency Categories
// -------------------------------------------------------------
export async function getCompetencyCategories() {
  return await db.select().from(competencyCategories).orderBy(competencyCategories.createdAt);
}

export async function addCompetencyCategory(data: { code: string; name: string; employeeType: string }) {
  await db.insert(competencyCategories).values({
    code: data.code,
    name: data.name,
    employeeType: data.employeeType,
  });
  revalidatePath("/admin/master-data");
}

// -------------------------------------------------------------
// Training Courses
// -------------------------------------------------------------
export async function getTrainingCourses() {
  return await db.select().from(trainingCourses).orderBy(trainingCourses.createdAt);
}

export async function addTrainingCourse(data: { title: string; provider: string; duration: string }) {
  await db.insert(trainingCourses).values({
    title: data.title,
    provider: data.provider,
    duration: data.duration,
  });
  revalidatePath("/admin/master-data");
}
