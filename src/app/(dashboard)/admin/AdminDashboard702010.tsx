"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

type Plan = {
  id: string;
  dev70: string;
  dev20: string;
  dev10: string;
};

export default function AdminDashboard702010({ plans }: { plans: Plan[] }) {
  // Helper to count frequencies
  const getFrequencies = (key: 'dev70' | 'dev20' | 'dev10') => {
    const counts = plans.reduce((acc, plan) => {
      if (plan[key]) {
        acc[plan[key]] = (acc[plan[key]] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: plans.length > 0 ? Math.round((count / plans.length) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3); // top 3 most popular
  };

  const top70 = getFrequencies('dev70');
  const top20 = getFrequencies('dev20');
  const top10 = getFrequencies('dev10');

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* 70% Column */}
      <Card className="shadow-lg border-slate-100 dark:border-purple-900/50 rounded-3xl overflow-hidden bg-white dark:bg-[#1a0b2e]">
        <CardHeader className="bg-slate-50 dark:bg-[#150926]/50 border-b border-slate-100 dark:border-purple-900/50 px-6 py-5">
          <CardTitle className="text-lg font-bold text-[#2e1065] dark:text-purple-50 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            ยอดนิยม 70% (ประสบการณ์)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {top70.length === 0 ? (
            <p className="text-slate-500 text-sm italic text-center py-4">ไม่มีข้อมูล</p>
          ) : top70.map((item, i) => (
            <div key={i}>
              <div className="flex justify-between mb-1.5">
                <span className="font-bold text-slate-700 dark:text-slate-300 text-xs sm:text-sm line-clamp-1 flex-1 pr-2">{item.name}</span>
                <span className="font-bold text-purple-600 dark:text-purple-400 text-xs sm:text-sm shrink-0">{item.count} แผน ({item.percentage}%)</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 dark:bg-purple-900/30 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full" style={{ width: `${item.percentage}%` }}></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 20% Column */}
      <Card className="shadow-lg border-slate-100 dark:border-purple-900/50 rounded-3xl overflow-hidden bg-white dark:bg-[#1a0b2e]">
        <CardHeader className="bg-slate-50 dark:bg-[#150926]/50 border-b border-slate-100 dark:border-purple-900/50 px-6 py-5">
          <CardTitle className="text-lg font-bold text-[#2e1065] dark:text-purple-50 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-500" />
            ยอดนิยม 20% (ผู้อื่น)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {top20.length === 0 ? (
            <p className="text-slate-500 text-sm italic text-center py-4">ไม่มีข้อมูล</p>
          ) : top20.map((item, i) => (
            <div key={i}>
              <div className="flex justify-between mb-1.5">
                <span className="font-bold text-slate-700 dark:text-slate-300 text-xs sm:text-sm line-clamp-1 flex-1 pr-2">{item.name}</span>
                <span className="font-bold text-amber-500 dark:text-amber-400 text-xs sm:text-sm shrink-0">{item.count} แผน ({item.percentage}%)</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 dark:bg-purple-900/30 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full" style={{ width: `${item.percentage}%` }}></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 10% Column */}
      <Card className="shadow-lg border-slate-100 dark:border-purple-900/50 rounded-3xl overflow-hidden bg-white dark:bg-[#1a0b2e]">
        <CardHeader className="bg-slate-50 dark:bg-[#150926]/50 border-b border-slate-100 dark:border-purple-900/50 px-6 py-5">
          <CardTitle className="text-lg font-bold text-[#2e1065] dark:text-purple-50 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            ยอดนิยม 10% (ฝึกอบรม)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {top10.length === 0 ? (
            <p className="text-slate-500 text-sm italic text-center py-4">ไม่มีข้อมูล</p>
          ) : top10.map((item, i) => (
            <div key={i}>
              <div className="flex justify-between mb-1.5">
                <span className="font-bold text-slate-700 dark:text-slate-300 text-xs sm:text-sm line-clamp-1 flex-1 pr-2">{item.name}</span>
                <span className="font-bold text-blue-500 dark:text-blue-400 text-xs sm:text-sm shrink-0">{item.count} แผน ({item.percentage}%)</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 dark:bg-purple-900/30 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full" style={{ width: `${item.percentage}%` }}></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
