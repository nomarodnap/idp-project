import { getIDPPlanById } from "@/actions/idp";
import { notFound, redirect } from "next/navigation";
import { CreateIDPForm } from "@/components/CreateIDPForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getSystemPhase } from "@/actions/settings";
import { getUsers } from "@/actions/user";
import { cookies } from "next/headers";
import { db } from "@/db";
import { session as sessionTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function EditIDPPlanPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const plan = await getIDPPlanById(resolvedParams.id);
  const IDP_PHASE = await getSystemPhase();

  if (!plan) {
    notFound();
  }

  // Prevent editing if approved or in Phase > 2 or if plan is locked (สำเร็จ/ไม่สำเร็จ)
  if (IDP_PHASE > 2 || plan.status === "Approved" || plan.status === "อนุมัติแล้ว" || plan.status === "Completed" || plan.status === "เสร็จสิ้น" || plan.status === "สำเร็จ" || plan.status === "ไม่สำเร็จ") {
    redirect(`/idp/${plan.id}`);
  }

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("better-auth.session_token")?.value;
  let currentUserId: string | null = null;
  
  if (sessionToken) {
    const [sessionRecord] = await db
      .select({ userId: sessionTable.userId })
      .from(sessionTable)
      .where(eq(sessionTable.token, sessionToken));
    if (sessionRecord) {
      currentUserId = sessionRecord.userId;
    }
  }

  // Prevent editing other people's plans
  if (currentUserId !== plan.userId) {
    redirect(`/idp/${plan.id}`);
  }

  const allUsers = await getUsers();
  const supervisorCandidates = allUsers.map(u => ({
    id: u.id,
    name: `${u.firstName} ${u.lastName}`,
    fullName: `${u.title || ''}${u.firstName} ${u.lastName}`.trim(),
    position: u.employeeType === "ข้าราชการพลเรือนสามัญ" && u.level ? `${u.position}${u.level}` : u.position
  }));

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Link href={`/idp/${plan.id}`}>
        <Button variant="ghost" className="text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30">
          <ArrowLeft className="w-4 h-4 mr-2" />
          ย้อนกลับ
        </Button>
      </Link>
      
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-[#2e1065] dark:text-purple-50 tracking-tight">แก้ไขแผนพัฒนา (IDP)</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">ปรับปรุงแผนพัฒนาบุคลากรรายบุคคลของคุณ</p>
      </div>

      <CreateIDPForm initialData={plan} planId={plan.id} users={supervisorCandidates} />
    </div>
  );
}
