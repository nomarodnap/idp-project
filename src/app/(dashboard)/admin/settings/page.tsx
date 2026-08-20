import { getSystemPhase } from "@/actions/settings";
import { getAnnouncements } from "@/actions/announcements";
import { getSystemMetrics } from "@/actions/monitoring";
import SettingsForm from "./SettingsForm";
import AnnouncementManager from "./AnnouncementManager";
import SystemHealthMonitor from "./SystemHealthMonitor";
import { ShieldAlert } from "lucide-react";
import { db } from "@/db";
import { users, session as sessionTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminSettingsPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("better-auth.session_token")?.value;

  if (!sessionToken) {
    redirect("/");
  }

  const [sessionRecord] = await db
    .select()
    .from(sessionTable)
    .where(eq(sessionTable.token, sessionToken));

  if (!sessionRecord) {
    redirect("/");
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, sessionRecord.userId));

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20 text-slate-500">
        <ShieldAlert className="w-16 h-16 text-rose-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">ไม่มีสิทธิ์เข้าถึง</h2>
        <p>ไม่พบข้อมูลผู้ใช้ในระบบ</p>
      </div>
    );
  }

  const currentPhase = await getSystemPhase();
  const announcements = await getAnnouncements();
  const metricsResult = await getSystemMetrics();

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#2e1065] dark:text-purple-50 tracking-tight">ตั้งค่าระบบ</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">จัดการตั้งค่าและติดตามสถานะของระบบ</p>
        </div>
      </div>

      <SystemHealthMonitor initialMetrics={metricsResult.data} />
      <SettingsForm currentPhase={currentPhase} />
      <AnnouncementManager initialAnnouncements={announcements} />
    </div>
  );
}
