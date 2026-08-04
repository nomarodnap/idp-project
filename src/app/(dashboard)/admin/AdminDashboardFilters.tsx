"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays, Users } from "lucide-react";

export default function AdminDashboardFilters({ 
  currentYear, 
  selectedYear,
  selectedEmployeeType
}: { 
  currentYear: number;
  selectedYear: number;
  selectedEmployeeType: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Generate last 5 years up to current year + 1 (in case they are planning for next year early)
  const years = Array.from({ length: 6 }, (_, i) => currentYear + 1 - i);

  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    const valStr = value || "";
    if (valStr === "ทั้งหมด" || valStr === "") {
      params.delete(key);
    } else {
      params.set(key, valStr);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      {/* Employee Type Filter */}
      <div className="flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400">
        <Users className="w-4 h-4" />
        ประเภทบุคลากร:
      </div>
      <Select 
        value={selectedEmployeeType} 
        onValueChange={(val) => updateFilters("employeeType", val)}
      >
        <SelectTrigger className="w-auto sm:w-[200px] font-bold bg-white dark:bg-[#1a0b2e] border-slate-200 dark:border-purple-800 focus:ring-purple-500">
          <SelectValue placeholder="ทั้งหมด" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ทั้งหมด" className="font-bold">ทั้งหมด</SelectItem>
          <SelectItem value="ข้าราชการพลเรือนสามัญ" className="font-bold">ข้าราชการพลเรือนสามัญ</SelectItem>
          <SelectItem value="พนักงานราชการทั่วไป" className="font-bold">พนักงานราชการทั่วไป</SelectItem>
          <SelectItem value="ลูกจ้างประจำ" className="font-bold">ลูกจ้างประจำ</SelectItem>
        </SelectContent>
      </Select>

      {/* Year Filter */}
      <div className="flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400">
        <CalendarDays className="w-4 h-4" />
        ปีงบประมาณ:
      </div>
      <Select 
        value={selectedYear.toString()} 
        onValueChange={(val) => updateFilters("year", val)}
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
