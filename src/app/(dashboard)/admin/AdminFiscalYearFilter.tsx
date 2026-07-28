"use client";

import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays } from "lucide-react";

export default function AdminFiscalYearFilter({ 
  currentYear, 
  selectedYear 
}: { 
  currentYear: number;
  selectedYear: number;
}) {
  const router = useRouter();
  
  // Generate last 5 years up to current year + 1 (in case they are planning for next year early)
  const years = Array.from({ length: 6 }, (_, i) => currentYear + 1 - i);

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400">
        <CalendarDays className="w-4 h-4" />
        ปีงบประมาณ:
      </div>
      <Select 
        value={selectedYear.toString()} 
        onValueChange={(val) => {
          router.push(`?year=${val}`);
        }}
      >
        <SelectTrigger className="w-32 font-bold bg-white dark:bg-[#1a0b2e] border-slate-200 dark:border-purple-800 focus:ring-purple-500">
          <SelectValue placeholder="เลือกปีงบประมาณ" />
        </SelectTrigger>
        <SelectContent>
          {years.map(y => (
            <SelectItem key={y} value={y.toString()} className="font-bold">
              {y} {y === currentYear ? "(ปัจจุบัน)" : ""}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
