import { ArrowLeft, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { CreateIDPForm } from "@/components/CreateIDPForm";
import { cn } from "@/lib/utils";

import { getSystemPhase } from "@/actions/settings";
import { getIDPPlans } from "@/actions/idp";
import { getUsers } from "@/actions/user";
import { redirect } from "next/navigation";
import { getCurrentFiscalYear } from "@/lib/date";

export default async function CreateIDPPage() {
  const IDP_PHASE = await getSystemPhase();
  if (IDP_PHASE !== 1) {
    redirect("/idp");
  }

  const thaiFiscalYear = getCurrentFiscalYear();

  const userPlans = await getIDPPlans();
  const currentYearPlans = userPlans.filter(p => p.fiscalYear === thaiFiscalYear);
  const isQuotaFull = currentYearPlans.length >= 3;

  const allUsers = await getUsers();
  const supervisorCandidates = allUsers.map(u => ({
    id: u.id,
    name: `${u.firstName} ${u.lastName}`,
    fullName: `${u.title || ''}${u.firstName} ${u.lastName}`.trim(),
    position: u.employeeType === "ข้าราชการพลเรือนสามัญ" && u.level ? `${u.position}${u.level}` : u.position
  }));

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Page Header */}
      <div className="flex items-center gap-6 bg-white dark:bg-[#1a0b2e] p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-purple-900/50">
        <Link href="/" className={cn(buttonVariants({ variant: "outline", size: "icon" }), "rounded-full shrink-0 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/50 hover:text-purple-800 dark:hover:text-purple-100 transition-colors shadow-sm")}>
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-[#2e1065] dark:text-white">
            สร้างแผนพัฒนารายบุคคล ประจำปีงบประมาณ {thaiFiscalYear}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">กรอกข้อมูลเพื่อจัดทำแผนพัฒนาสมรรถนะของคุณในรอบประเมินนี้</p>
        </div>
      </div>

      {/* Form Layout */}
      <div className="bg-white dark:bg-[#1a0b2e] rounded-[2rem] shadow-xl border-none p-8 md:p-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 via-purple-600 to-amber-400" />
        {isQuotaFull ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-20 h-20 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mb-6">
              <AlertTriangle className="w-10 h-10 text-rose-600 dark:text-rose-400" />
            </div>
            <h2 className="text-2xl font-black text-[#2e1065] dark:text-purple-50 mb-4">
              โควตาการสร้างแผนเต็มแล้ว
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg mb-8 max-w-lg mx-auto">
              คุณได้สร้างแผนพัฒนาสำหรับปีงบประมาณ {thaiFiscalYear} ครบ 3 แผนแล้ว<br />
              (โควตาสูงสุด: 3 แผน ต่อ 1 ปีงบประมาณ)
            </p>
            <Link href="/" className={cn(buttonVariants({ size: "lg" }), "bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg")}>
              กลับสู่หน้าหลัก
            </Link>
          </div>
        ) : (
          <CreateIDPForm users={supervisorCandidates} />
        )}
      </div>
    </div>
  );
}
