"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { PieChart as PieChartIcon } from "lucide-react";

type Plan = {
  id: string;
  devCategory: string;
  devTopic: string;
};

const CATEGORY_COLORS: Record<string, string> = {
  "ความรู้ความสามารถที่จำเป็นสำหรับการปฏิบัติงาน": "#2563eb", // blue-600
  "ทักษะ": "#6366f1", // indigo-500
  "สมรรถนะที่จำเป็น": "#f59e0b", // amber-500
  "สมรรถนะทางการบริหาร": "#10b981", // emerald-500
  "สมรรถนะเฉพาะตามลักษณะงานที่ปฏิบัติ": "#f43f5e", // rose-500
  "สมรรถนะพนักงานราชการทั่วไป": "#d946ef", // fuchsia-500
  "สมรรถนะลูกจ้างประจำ": "#06b6d4", // cyan-500
};

const TOPIC_COLORS = [
  "#8b5cf6", "#d946ef", "#f43f5e", "#f97316", "#eab308", "#84cc16", "#10b981", "#06b6d4", "#3b82f6", "#6366f1"
];

export default function AdminDashboardCharts({ plans }: { plans: Plan[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // --- Process Category Data ---
  const categoryCounts = plans.reduce((acc, plan) => {
    acc[plan.devCategory] = (acc[plan.devCategory] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryData = Object.entries(categoryCounts)
    .map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / plans.length) * 100),
      color: CATEGORY_COLORS[name] || "#94a3b8"
    }))
    .sort((a, b) => b.count - a.count);

  let currentCategoryAngle = 0;
  const categoryGradient = categoryData.length > 0 ? categoryData.map(item => {
    const startAngle = currentCategoryAngle;
    const endAngle = currentCategoryAngle + (item.count / plans.length * 360);
    currentCategoryAngle = endAngle;
    return `${item.color} ${startAngle}deg ${endAngle}deg`;
  }).join(", ") : "#f1f5f9 0deg 360deg";

  // --- Process Topic Data ---
  const filteredPlansForTopic = selectedCategory 
    ? plans.filter(p => p.devCategory === selectedCategory)
    : plans;

  const topicCounts = filteredPlansForTopic.reduce((acc, plan) => {
    acc[plan.devTopic] = (acc[plan.devTopic] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topicData = Object.entries(topicCounts)
    .map(([name, count], index) => ({
      name,
      count,
      percentage: Math.round((count / filteredPlansForTopic.length) * 100),
      color: TOPIC_COLORS[index % TOPIC_COLORS.length]
    }))
    .sort((a, b) => b.count - a.count);

  let currentTopicAngle = 0;
  const topicGradient = topicData.length > 0 ? topicData.map(item => {
    const startAngle = currentTopicAngle;
    const endAngle = currentTopicAngle + (item.count / filteredPlansForTopic.length * 360);
    currentTopicAngle = endAngle;
    return `${item.color} ${startAngle}deg ${endAngle}deg`;
  }).join(", ") : "#f1f5f9 0deg 360deg";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Chart 1: Categories */}
      <Card className="shadow-lg border-slate-100 dark:border-purple-900/50 rounded-3xl overflow-hidden bg-white dark:bg-[#1a0b2e]">
        <CardHeader className="bg-slate-50 dark:bg-[#150926]/50 border-b border-slate-100 dark:border-purple-900/50 px-8 py-6">
          <CardTitle className="text-xl font-bold text-[#2e1065] dark:text-purple-50 tracking-tight flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-purple-600" />
            สัดส่วนหมวดหมู่ที่ต้องการพัฒนา
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 flex flex-col md:flex-row items-center gap-8">
          <div className="relative w-48 h-48 shrink-0">
            <div 
              className="w-full h-full rounded-full shadow-inner transition-all duration-500" 
              style={{ background: `conic-gradient(${categoryGradient})` }}
            />
            {/* Inner circle for donut chart look */}
            <div className="absolute inset-4 bg-white dark:bg-[#1a0b2e] rounded-full flex flex-col items-center justify-center shadow-sm">
              <span className="text-2xl font-black text-[#2e1065] dark:text-purple-50">{plans.length}</span>
              <span className="text-xs font-bold text-slate-500">แผนทั้งหมด</span>
            </div>
          </div>
          
          <div className="w-full space-y-3">
            {categoryData.length === 0 ? (
              <p className="text-slate-500 text-sm italic text-center">ไม่มีข้อมูล</p>
            ) : categoryData.map((item, i) => (
              <button 
                key={i} 
                onClick={() => setSelectedCategory(selectedCategory === item.name ? null : item.name)}
                className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors border text-left ${selectedCategory === item.name ? 'bg-purple-50 border-purple-200 dark:bg-purple-900/30 dark:border-purple-700' : 'border-transparent hover:bg-slate-50 dark:hover:bg-purple-900/10'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className={`text-sm font-medium ${selectedCategory === item.name ? 'text-purple-700 dark:text-purple-300' : 'text-slate-700 dark:text-slate-300'}`}>{item.name}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.count}</span>
                  <span className="text-xs font-bold w-8 text-right" style={{ color: item.color }}>{item.percentage}%</span>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chart 2: Topics */}
      <Card className="shadow-lg border-slate-100 dark:border-purple-900/50 rounded-3xl overflow-hidden bg-white dark:bg-[#1a0b2e]">
        <CardHeader className="bg-slate-50 dark:bg-[#150926]/50 border-b border-slate-100 dark:border-purple-900/50 px-8 py-6">
          <CardTitle className="text-xl font-bold text-[#2e1065] dark:text-purple-50 tracking-tight flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-amber-500" />
            {selectedCategory ? 'หัวข้อที่ต้องการพัฒนา (กรองตามหมวด)' : 'หัวข้อที่ต้องการพัฒนา (ทั้งหมด)'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 flex flex-col md:flex-row items-center gap-8">
          <div className="relative w-48 h-48 shrink-0">
            <div 
              className="w-full h-full rounded-full shadow-inner transition-all duration-500" 
              style={{ background: `conic-gradient(${topicGradient})` }}
            />
            <div className="absolute inset-4 bg-white dark:bg-[#1a0b2e] rounded-full flex flex-col items-center justify-center shadow-sm">
              <span className="text-2xl font-black text-[#2e1065] dark:text-purple-50">{filteredPlansForTopic.length}</span>
              <span className="text-xs font-bold text-slate-500">แผน</span>
            </div>
          </div>
          
          <div className="w-full space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
            {topicData.length === 0 ? (
              <p className="text-slate-500 text-sm italic text-center">ไม่มีข้อมูล</p>
            ) : topicData.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-purple-900/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 line-clamp-2">{item.name}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-2">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.count}</span>
                  <span className="text-xs font-bold w-8 text-right" style={{ color: item.color }}>{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
