import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { CreateIDPForm } from "@/components/CreateIDPForm";
import { cn } from "@/lib/utils";

export default function CreateIDPPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Page Header */}
      <div className="flex items-center gap-6 bg-white dark:bg-[#1a0b2e] p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-purple-900/50">
        <Link href="/" className={cn(buttonVariants({ variant: "outline", size: "icon" }), "rounded-full shrink-0 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/50 hover:text-purple-800 dark:hover:text-purple-100 transition-colors shadow-sm")}>
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-[#2e1065] dark:text-white">สร้างแผนพัฒนารายบุคคล (New IDP)</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">กรอกข้อมูลเพื่อจัดทำแผนพัฒนาสมรรถนะของคุณในรอบประเมินนี้</p>
        </div>
      </div>

      {/* Form Layout */}
      <div className="bg-white dark:bg-[#1a0b2e] rounded-[2rem] shadow-xl border-none p-8 md:p-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 via-purple-600 to-amber-400" />
        <CreateIDPForm />
      </div>
    </div>
  );
}
