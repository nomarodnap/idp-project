import { notFound } from "next/navigation";
import { getIDPPlanById } from "@/actions/idp";
import { formatThaiDate } from "@/lib/date";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, Clock, FileText, User, CheckCircle } from "lucide-react";
import DeletePlanButton from "./DeletePlanButton";
import { getSystemPhase } from "@/actions/settings";
import SelfEvaluateButton from "./SelfEvaluateButton";
import { BackButton } from "@/components/BackButton";
import PrintPlanButton from "./PrintPlanButton";
import { cookies } from "next/headers";
import { db } from "@/db";
import { session as sessionTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function IDPDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const plan = await getIDPPlanById(resolvedParams.id);
  const IDP_PHASE = await getSystemPhase();

  let currentUserId: string | null = null;
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("better-auth.session_token")?.value;
  if (sessionToken) {
    const [sessionRecord] = await db
      .select({ userId: sessionTable.userId })
      .from(sessionTable)
      .where(eq(sessionTable.token, sessionToken));
    if (sessionRecord) {
      currentUserId = sessionRecord.userId;
    }
  }

  const isOwner = currentUserId === plan?.userId;

  if (!plan) {
    notFound();
  }

  const userPositionText = plan.userEmployeeType === "ข้าราชการพลเรือนสามัญ" && plan.userLevel 
    ? `${plan.userPosition}${plan.userLevel}` 
    : (plan.userPosition || "-");
  
  const currentDateStr = new Intl.DateTimeFormat('th-TH', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date());

  return (
    <>
    {/* Preload the font by rendering it invisibly */}
    <div className="fixed opacity-0 pointer-events-none font-sarabun-it9 text-[1px]" aria-hidden="true">
      <span className="font-normal">Preload Regular</span>
      <span className="font-bold">Preload Bold</span>
      <span className="italic">Preload Italic</span>
      <span className="font-bold italic">Preload Bold Italic</span>
    </div>
    
    <div className="print:hidden max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BackButton />
          <PrintPlanButton />
        </div>
        
        {isOwner && plan.status !== "Approved" && plan.status !== "อนุมัติแล้ว" && plan.status !== "Completed" && plan.status !== "เสร็จสิ้น" && plan.status !== "ไม่สำเร็จ" && plan.status !== "สำเร็จ" && (
          <div className="flex items-center gap-2">
            {IDP_PHASE === 1 && <DeletePlanButton planId={plan.id} />}
            {(IDP_PHASE === 1 || IDP_PHASE === 2) && (
              <Link href={`/idp/${plan.id}/edit`}>
                <Button variant="outline" className="text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/30 font-bold rounded-xl shadow-sm">
                  <FileText className="w-4 h-4 mr-2" />
                  แก้ไขแผนพัฒนา
                </Button>
              </Link>
            )}
            {IDP_PHASE === 4 && <SelfEvaluateButton planId={plan.id} initialStatus={plan.selfEvaluationResult} />}
          </div>
        )}
      </div>

      <div className="space-y-6 bg-slate-50/50 dark:bg-purple-900/10 p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-purple-800/30 shadow-sm">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b-2 border-purple-100 dark:border-purple-800/50 pb-6">
          <div>
              <Badge 
                variant="outline" 
                className={`text-sm font-bold px-4 py-1.5 rounded-full border shadow-sm
                  ${plan.status === "สำเร็จ" ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800" : ""}
                  ${plan.status === "รออนุมัติ" || plan.status === "รอประเมินผล" ? "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800" : ""}
                  ${plan.status === "กำลังดำเนินการ" ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800" : ""}
                  ${plan.status === "ไม่สำเร็จ" ? "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800" : ""}
                  ${plan.status === "แบบร่าง" ? "bg-slate-50 text-slate-500 border-slate-200" : ""}
                `}
              >
                {plan.status}
              </Badge>
            <h1 className="text-2xl sm:text-3xl font-black text-[#2e1065] dark:text-purple-50 tracking-tight leading-snug mt-4">
              {plan.courseTitle}
            </h1>
            <div className="mt-2 inline-flex items-center rounded-md bg-purple-100 dark:bg-purple-900/50 px-2.5 py-0.5 text-sm font-semibold text-purple-800 dark:text-purple-200">
              รหัสแผน: {plan.planCode || "-"}
            </div>
            {plan.selfEvaluationResult && (
              <div className={`mt-2 ml-2 inline-flex items-center rounded-md px-2.5 py-0.5 text-sm font-bold border shadow-sm 
                ${plan.selfEvaluationResult === 'Success' ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' : 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800'}`}>
                <CheckCircle className="w-4 h-4 mr-1.5" />
                ผลการประเมิน: {plan.selfEvaluationResult === 'Success' ? 'สำเร็จ' : 'ไม่สำเร็จ'}
              </div>
            )}
            <div className="flex flex-col gap-2 mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-slate-400"/> สร้างเมื่อ {formatThaiDate(plan.createdAt)}</span>
                {plan.updatedAt && plan.updatedAt.getTime() !== plan.createdAt.getTime() && (
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-slate-400"/> แก้ไขล่าสุดเมื่อ {formatThaiDate(plan.updatedAt)}</span>
                )}
              </div>
              <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-purple-400"/> ผู้ส่งแผน: {plan.userName || "-"} {plan.userPosition && `(${plan.userEmployeeType === "ข้าราชการพลเรือนสามัญ" && plan.userLevel ? plan.userPosition + plan.userLevel : plan.userPosition})`}</span>
              <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-purple-400"/> ผู้กำกับดูแล: {plan.supervisorName} {plan.supervisorPosition ? `(${plan.supervisorPosition})` : ''}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid gap-6">
          <Card className="shadow-sm border-slate-100 dark:border-purple-900/50 bg-white dark:bg-[#1a0b2e] rounded-2xl">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-bold text-[#2e1065] dark:text-purple-100">เป้าหมายการพัฒนา</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-purple-50/50 dark:bg-purple-900/20 border border-purple-100/50 dark:border-purple-800/30">
                  <div className="text-xs font-bold text-purple-600 dark:text-purple-400 mb-1">หมวดหมู่ที่ต้องการพัฒนา</div>
                  <div className="text-sm font-bold text-slate-700 dark:text-slate-200">{plan.devCategory}</div>
                </div>
                <div className="p-4 rounded-xl bg-purple-50/50 dark:bg-purple-900/20 border border-purple-100/50 dark:border-purple-800/30">
                  <div className="text-xs font-bold text-purple-600 dark:text-purple-400 mb-1">หัวข้อที่ต้องการพัฒนา</div>
                  <div className="text-sm font-bold text-slate-700 dark:text-slate-200">{plan.devTopic}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-100 dark:border-purple-900/50 bg-white dark:bg-[#1a0b2e] rounded-2xl">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-bold text-[#2e1065] dark:text-purple-100">วิธีการพัฒนารูปแบบ 70:20:10</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-[#150a29] border border-slate-100 dark:border-purple-900/30">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                    <span className="font-black text-blue-600 dark:text-blue-400">70%</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">การเรียนรู้จากประสบการณ์</div>
                    <div className="text-sm font-bold text-slate-700 dark:text-slate-200">{plan.dev70}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-[#150a29] border border-slate-100 dark:border-purple-900/30">
                  <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                    <span className="font-black text-amber-600 dark:text-amber-400">20%</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">การเรียนรู้จากผู้อื่น</div>
                    <div className="text-sm font-bold text-slate-700 dark:text-slate-200">{plan.dev20}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-[#150a29] border border-slate-100 dark:border-purple-900/30">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                    <span className="font-black text-emerald-600 dark:text-emerald-400">10%</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">การเรียนรู้จากการฝึกอบรม</div>
                    <div className="text-sm font-bold text-slate-700 dark:text-slate-200">{plan.dev10}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>

    {/* Printable Format */}
    <div 
      className="hidden print:block w-full text-black bg-white pt-8 px-12 font-sarabun-it9"
    >
      <h1 className="text-[22pt] font-bold text-center mb-1 leading-tight">แผนพัฒนารายบุคคล (Individual Development Plan : IDP)</h1>
      <div className="text-[18pt] font-bold text-center mb-1 leading-tight">
        ประจำปีงบประมาณปี พ.ศ. {plan.fiscalYear}
      </div>
      <div className="text-[16pt] text-center mb-6 leading-tight">
        (รหัสแผนพัฒนา {plan.planCode || "-"})
      </div>
      
      <div className="mb-8 text-[16pt] leading-tight">
        <div className="font-bold underline mb-4 text-center">ข้อมูลผู้ใช้งาน</div>
        <div className="grid grid-cols-2 gap-x-12 gap-y-2">
          <div><span className="font-bold">ชื่อ-สกุล:</span> {plan.userName}</div>
          <div><span className="font-bold">สังกัด/กอง:</span> {plan.userDepartment || "-"}</div>
          
          <div><span className="font-bold">ตำแหน่ง/ระดับ:</span> {userPositionText}</div>
          <div><span className="font-bold">กลุ่ม/ฝ่าย:</span> {plan.userDivision || "-"}</div>
          
          <div><span className="font-bold">ประเภท:</span> {plan.userEmployeeType || "-"}</div>
        </div>
      </div>

      <div className="mb-12">
        <div className="font-bold underline mb-4 text-[16pt] leading-tight text-center">รายละเอียดการพัฒนารายบุคคล (IDP)</div>
        <table className="w-full border-collapse border border-black text-[16pt] leading-tight">
          <thead>
            <tr>
              <th className="border border-black p-2 align-middle text-center" rowSpan={2}>ความรู้/ทักษะ/สมรรถนะ<br/>ที่ต้องการพัฒนา</th>
              <th className="border border-black p-2 align-middle text-center" rowSpan={2}>หัวข้อที่ต้องการพัฒนา</th>
              <th className="border border-black p-2 text-center" colSpan={3}>วิธีพัฒนา</th>
              <th className="border border-black p-2 align-middle text-center" rowSpan={2}>ผลการพัฒนารายบุคคล</th>
            </tr>
            <tr>
              <th className="border border-black p-2 text-center font-normal">70</th>
              <th className="border border-black p-2 text-center font-normal">20</th>
              <th className="border border-black p-2 text-center font-normal">10</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-2 align-top">{plan.devTopic}</td>
              <td className="border border-black p-2 align-top">{plan.courseTitle}</td>
              <td className="border border-black p-2 align-top">{plan.dev70}</td>
              <td className="border border-black p-2 align-top">{plan.dev20}</td>
              <td className="border border-black p-2 align-top">{plan.dev10}</td>
              <td className="border border-black p-2 align-top text-center">
                {plan.selfEvaluationResult === 'Success' ? 'สำเร็จ' : plan.selfEvaluationResult === 'Fail' ? 'ไม่สำเร็จ' : 'กำลังดำเนินการ'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-end mt-20 text-[16pt] px-8 break-inside-avoid leading-tight">
        <div className="text-center">
          <div className="mb-8">ผู้ได้รับการพัฒนา</div>
          <div className="mb-2">_________________________</div>
          <div className="mb-1">({plan.userName || "................................................"})</div>
          <div className="mb-2">{userPositionText}</div>
          <div>วันที่ {currentDateStr}</div>
        </div>

        <div className="text-center">
          <div className="mb-8">ผู้บังคับบัญชา (ผู้กำกับดูแลแผน IDP)</div>
          <div className="mb-2">_________________________</div>
          <div className="mb-1">({plan.supervisorName || "................................................"})</div>
          <div className="mb-2">{plan.supervisorPosition || "................................................"}</div>
          <div>วันที่ {currentDateStr}</div>
        </div>
      </div>
    </div>
    </>
  );
}
