"use client";

import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { th } from "date-fns/locale";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  competencyType: z.string({
    message: "กรุณาเลือกสมรรถนะ",
  }).min(1, "กรุณาเลือกสมรรถนะ"),
  details: z.string().min(10, {
    message: "กรุณาระบุรายละเอียดอย่างน้อย 10 ตัวอักษร",
  }),
  developmentMethod: z.string({
    message: "กรุณาเลือกรูปแบบการพัฒนา",
  }).min(1, "กรุณาเลือกรูปแบบการพัฒนา"),
  dateRange: z
    .object({
      from: z.date(),
      to: z.date().optional(),
    })
    .refine((data) => data.from, { message: "กรุณาเลือกช่วงเวลา" }),
  budget: z.coerce.number().min(0, {
    message: "งบประมาณต้องไม่ต่ำกว่า 0",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const formatThaiDate = (date: Date) => {
  return `${format(date, "d MMM", { locale: th })} ${date.getFullYear() + 543}`;
};

export function CreateIDPForm() {
  const router = useRouter();
  
  const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      competencyType: "",
      developmentMethod: "",
      details: "",
      budget: 0,
    },
  });

  function onSubmit(data: FormValues) {
    console.log("Submitted Data:", data);
    // TODO: Send to API
    router.push("/");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* ส่วนที่ 1: ข้อมูลสมรรถนะ */}
      <div className="space-y-6 bg-slate-50/50 dark:bg-purple-900/10 p-6 sm:p-8 rounded-2xl border border-slate-100 dark:border-purple-800/30 shadow-sm">
        <h2 className="text-xl font-bold text-[#2e1065] dark:text-purple-100 border-b-2 border-purple-100 dark:border-purple-800/50 pb-3 flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-200 text-sm">1</span>
          ข้อมูลสมรรถนะ
        </h2>
        
        <div className="space-y-2">
          <Label className="text-[#2e1065] dark:text-purple-200 font-bold" htmlFor="competencyType">เลือกสมรรถนะที่ต้องการพัฒนา</Label>
          <Controller
            control={control}
            name="competencyType"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id="competencyType" className="w-full h-12 bg-white dark:bg-[#150a29] dark:border-purple-800/50 dark:text-white focus:ring-purple-500/30 focus:border-purple-500 transition-all shadow-sm">
                  <SelectValue placeholder="-- เลือกประเภทสมรรถนะ --" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="core">สมรรถนะหลัก (Core Competency)</SelectItem>
                  <SelectItem value="managerial">สมรรถนะทางการบริหาร (Managerial Competency)</SelectItem>
                  <SelectItem value="functional">สมรรถนะเฉพาะสายงาน (Functional Competency)</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.competencyType && <p className="text-sm font-medium text-destructive">{errors.competencyType.message}</p>}
        </div>

        <div className="space-y-2">
          <Label className="text-[#2e1065] dark:text-purple-200 font-bold" htmlFor="details">ระบุหัวข้อหรือทักษะที่ต้องการพัฒนาอย่างละเอียด</Label>
          <Controller
            control={control}
            name="details"
            render={({ field }) => (
              <Textarea
                id="details"
                placeholder="ตัวอย่าง: ต้องการพัฒนาทักษะการใช้โปรแกรมวิเคราะห์ข้อมูลทางสถิติ R เพื่อประยุกต์ใช้ในงานวิจัย..."
                className="min-h-[120px] resize-none bg-white dark:bg-[#150a29] dark:border-purple-800/50 dark:text-white dark:placeholder-slate-500 focus-visible:ring-purple-500/30 focus-visible:border-purple-500 transition-all shadow-sm p-4"
                {...field}
              />
            )}
          />
          {errors.details && <p className="text-sm font-medium text-destructive">{errors.details.message}</p>}
        </div>
      </div>

      {/* ส่วนที่ 2: วิธีการพัฒนา */}
      <div className="space-y-6 bg-slate-50/50 dark:bg-purple-900/10 p-6 sm:p-8 rounded-2xl border border-slate-100 dark:border-purple-800/30 shadow-sm">
        <h2 className="text-xl font-bold text-[#2e1065] dark:text-purple-100 border-b-2 border-purple-100 dark:border-purple-800/50 pb-3 flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-200 text-sm">2</span>
          วิธีการพัฒนา
        </h2>
        
        <div className="space-y-4">
          <Label className="text-[#2e1065] dark:text-purple-200 font-bold">รูปแบบการพัฒนา</Label>
          <Controller
            control={control}
            name="developmentMethod"
            render={({ field }) => (
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="training" id="r-training" className="dark:border-purple-700 dark:text-purple-400" />
                  <Label htmlFor="r-training" className="font-normal cursor-pointer dark:text-slate-300">การฝึกอบรม</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="coaching" id="r-coaching" className="dark:border-purple-700 dark:text-purple-400" />
                  <Label htmlFor="r-coaching" className="font-normal cursor-pointer dark:text-slate-300">การสอนงาน (Coaching)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="self-learning" id="r-self-learning" className="dark:border-purple-700 dark:text-purple-400" />
                  <Label htmlFor="r-self-learning" className="font-normal cursor-pointer dark:text-slate-300">การเรียนรู้ด้วยตนเอง</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="project" id="r-project" className="dark:border-purple-700 dark:text-purple-400" />
                  <Label htmlFor="r-project" className="font-normal cursor-pointer dark:text-slate-300">การมอบหมายโครงการ</Label>
                </div>
              </RadioGroup>
            )}
          />
          {errors.developmentMethod && <p className="text-sm font-medium text-destructive">{errors.developmentMethod.message}</p>}
        </div>
      </div>

      {/* ส่วนที่ 3: ระยะเวลาและงบประมาณ */}
      <div className="space-y-6 bg-slate-50/50 dark:bg-purple-900/10 p-6 sm:p-8 rounded-2xl border border-slate-100 dark:border-purple-800/30 shadow-sm">
        <h2 className="text-xl font-bold text-[#2e1065] dark:text-purple-100 border-b-2 border-purple-100 dark:border-purple-800/50 pb-3 flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-200 text-sm">3</span>
          ระยะเวลาและงบประมาณ
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col space-y-2">
            <Label className="text-[#2e1065] dark:text-purple-200 font-bold">ช่วงเวลาที่คาดว่าจะดำเนินการ</Label>
            <Controller
              control={control}
              name="dateRange"
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger 
                    className={cn(
                      "inline-flex items-center justify-start rounded-lg border border-slate-200 dark:border-purple-800/50 bg-white dark:bg-[#150a29] hover:bg-slate-50 dark:hover:bg-purple-900/30 hover:text-[#2e1065] dark:hover:text-white h-12 px-4 w-full text-left font-medium focus-visible:ring-purple-500/30 transition-all shadow-sm",
                      !field.value && "text-slate-400 dark:text-slate-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                    {field.value?.from ? (
                      field.value.to ? (
                        <span className="truncate">
                          {formatThaiDate(field.value.from)} - {formatThaiDate(field.value.to)}
                        </span>
                      ) : (
                        <span className="truncate">
                          {formatThaiDate(field.value.from)}
                        </span>
                      )
                    ) : (
                      <span>เลือกวันที่เริ่มต้น - สิ้นสุด</span>
                    )}
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white dark:bg-[#150a29] border border-slate-200 dark:border-purple-800 shadow-lg rounded-xl overflow-hidden" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={field.value?.from}
                      selected={field.value}
                      onSelect={field.onChange}
                      numberOfMonths={1}
                      locale={th}
                      captionLayout="dropdown"
                      startMonth={new Date(new Date().getFullYear() - 5, 0)}
                      endMonth={new Date(new Date().getFullYear() + 10, 11)}
                      className="p-3"
                      classNames={{
                        day_selected: "bg-[#4c1d95] text-white hover:bg-[#5b21b6] focus:bg-[#4c1d95]",
                        day_today: "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200 font-bold rounded-md",
                        day: "h-8 w-8 p-0 font-normal text-sm aria-selected:opacity-100 hover:bg-slate-100 dark:hover:bg-purple-900/40 rounded-md transition-colors",
                        button_previous: "h-7 w-7 bg-transparent hover:bg-slate-100 dark:hover:bg-purple-900/40 rounded-md transition-colors",
                        button_next: "h-7 w-7 bg-transparent hover:bg-slate-100 dark:hover:bg-purple-900/40 rounded-md transition-colors",
                        cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-purple-50 dark:[&:has([aria-selected])]:bg-purple-900/20",
                        day_range_middle: "aria-selected:bg-purple-50 dark:aria-selected:bg-purple-900/20 aria-selected:text-[#2e1065] dark:aria-selected:text-purple-200 rounded-none",
                      }}
                      formatters={{
                        formatCaption: (date) => {
                          return `${format(date, "LLLL", { locale: th })} ${date.getFullYear() + 543}`;
                        },
                        formatYearCaption: (date) => {
                          return `${date.getFullYear() + 543}`;
                        },
                        formatYearDropdown: (date) => {
                          return `${date.getFullYear() + 543}`;
                        }
                      }}
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.dateRange && <p className="text-sm font-medium text-destructive">{errors.dateRange.message}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-[#2e1065] dark:text-purple-200 font-bold" htmlFor="budget">งบประมาณโดยประมาณ (บาท)</Label>
            <Controller
              control={control}
              name="budget"
              render={({ field }) => (
                <Input 
                  id="budget"
                  type="number" 
                  placeholder="0.00" 
                  className="h-12 bg-white dark:bg-[#150a29] dark:border-purple-800/50 dark:text-white focus-visible:ring-purple-500/30 focus-visible:border-purple-500 transition-all shadow-sm text-lg font-medium"
                  {...field} 
                />
              )}
            />
            {errors.budget && <p className="text-sm font-medium text-destructive">{errors.budget.message}</p>}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-8 mt-8 flex justify-end items-center gap-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => router.push("/")}
          className="h-12 px-8 rounded-xl font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-purple-900/30 border-slate-200 dark:border-purple-800/50 transition-all"
        >
          ยกเลิก
        </Button>
        <Button 
          type="submit" 
          className="h-12 px-8 rounded-xl font-bold text-white shadow-[0_4px_14px_0_rgba(91,33,182,0.39)] transition-all hover:shadow-[0_6px_20px_rgba(91,33,182,0.23)] hover:-translate-y-0.5 bg-gradient-to-r from-[#4c1d95] to-[#2e1065] hover:from-[#5b21b6] hover:to-[#4c1d95] dark:from-[#5b21b6] dark:to-[#3b0764] dark:hover:from-[#6d28d9] dark:hover:to-[#4c1d95] border-none"
        >
          บันทึกและส่งอนุมัติ
        </Button>
      </div>
    </form>
  );
}
