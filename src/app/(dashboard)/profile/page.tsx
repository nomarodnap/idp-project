import { cookies } from "next/headers";
import { db } from "@/db";
import { users, session as sessionTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("better-auth.session_token")?.value;

  if (!sessionToken) {
    redirect("/login");
  }

  const [sessionRecord] = await db
    .select()
    .from(sessionTable)
    .where(eq(sessionTable.token, sessionToken));

  if (!sessionRecord) {
    redirect("/login");
  }

  const [dbUser] = await db
    .select()
    .from(users)
    .where(eq(users.id, sessionRecord.userId));

  if (!dbUser) {
    redirect("/login");
  }


  return <ProfileClient user={dbUser} />;
}
