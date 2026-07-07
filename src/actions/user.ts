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
