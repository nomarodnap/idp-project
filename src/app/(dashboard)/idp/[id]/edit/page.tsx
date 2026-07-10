import { getIDPPlanById } from "@/actions/idp";
import { notFound, redirect } from "next/navigation";
import { CreateIDPForm } from "@/components/CreateIDPForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function EditIDPPlanPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const plan = await getIDPPlanById(resolvedParams.id);

  if (!plan) {
    notFound();
  }

  // Prevent editing if approved
  if (plan.status === "Approved" || plan.status === "อนุมัติแล้ว" || plan.status === "Completed" || plan.status === "เสร็จสิ้น") {
    redirect(`/idp/${plan.id}`);
  }

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

      <CreateIDPForm initialData={plan} planId={plan.id} />
    </div>
  );
}
