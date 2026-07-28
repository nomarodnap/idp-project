"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";

type Plan = {
  id: string;
  status: string;
};

export default function AdminDashboardSuccessRate({ plans }: { plans: Plan[] }) {
  // Filter only success/unsuccess
  const evaluatedPlans = plans.filter(p => p.status === "สำเร็จ" || p.status === "ไม่สำเร็จ");
  
  const countSuccess = evaluatedPlans.filter(p => p.status === "สำเร็จ").length;
  const countFail = evaluatedPlans.filter(p => p.status === "ไม่สำเร็จ").length;
  
  const totalEvaluated = evaluatedPlans.length;
  const pctSuccess = totalEvaluated > 0 ? Math.round((countSuccess / totalEvaluated) * 100) : 0;
  const pctFail = totalEvaluated > 0 ? Math.round((countFail / totalEvaluated) * 100) : 0;

  let gradient = "#f1f5f9 0deg 360deg"; // default gray
  if (totalEvaluated > 0) {
    const successAngle = (countSuccess / totalEvaluated) * 360;
    gradient = `#10b981 0deg ${successAngle}deg, #f43f5e ${successAngle}deg 360deg`;
  }

  return (
    <Card className="shadow-lg border-slate-100 dark:border-purple-900/50 rounded-3xl overflow-hidden bg-white dark:bg-[#1a0b2e]">
      <CardHeader className="bg-slate-50 dark:bg-[#150926]/50 border-b border-slate-100 dark:border-purple-900/50 px-8 py-6">
        <CardTitle className="text-xl font-bold text-[#2e1065] dark:text-purple-50 tracking-tight flex items-center gap-2">
          <Target className="w-5 h-5 text-emerald-600" />
          ผลการประเมินแผน (สำเร็จ / ไม่สำเร็จ)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8 flex flex-col md:flex-row items-center gap-8 justify-center">
        <div className="relative w-48 h-48 shrink-0">
          <div 
            className="w-full h-full rounded-full shadow-inner transition-all duration-500" 
            style={{ background: `conic-gradient(${gradient})` }}
          />
          <div className="absolute inset-4 bg-white dark:bg-[#1a0b2e] rounded-full flex flex-col items-center justify-center shadow-sm">
            <span className="text-2xl font-black text-[#2e1065] dark:text-purple-50">{totalEvaluated}</span>
            <span className="text-xs font-bold text-slate-500">แผนที่ประเมินแล้ว</span>
          </div>
        </div>
        
        <div className="w-full md:w-1/2 space-y-4">
          {totalEvaluated === 0 ? (
            <p className="text-slate-500 text-sm italic text-center">ยังไม่มีแผนที่ได้รับการประเมินผล</p>
          ) : (
            <>
              <div className="flex items-center justify-between p-3 rounded-xl border border-emerald-100 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-800/30">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">สำเร็จ</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">{countSuccess} แผน</span>
                  <span className="text-xs font-black w-8 text-right text-emerald-600">{pctSuccess}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-rose-100 bg-rose-50 dark:bg-rose-900/20 dark:border-rose-800/30">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-rose-500 shrink-0" />
                  <span className="text-sm font-bold text-rose-700 dark:text-rose-400">ไม่สำเร็จ</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-bold text-rose-700 dark:text-rose-400">{countFail} แผน</span>
                  <span className="text-xs font-black w-8 text-right text-rose-600">{pctFail}%</span>
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
