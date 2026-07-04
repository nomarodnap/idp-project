"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { ArrowLeft, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CreateIDPPage() {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link href="/" className={cn(buttonVariants({ variant: "outline", size: "icon" }), "rounded-full shadow-sm hover:bg-gray-100 transition-colors")}>
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">ย้อนกลับ</span>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1e3a8a]">
            สร้างแผนพัฒนารายบุคคล (New IDP)
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            กรุณากรอกข้อมูลให้ครบถ้วนเพื่อจัดทำแผนพัฒนารายบุคคลของคุณ
          </p>
        </div>
      </div>

      {/* Form Layout */}
      <Card className="shadow-md border-none bg-white">
        <CardContent className="p-6 md:p-8 space-y-10">
          
          {/* Section 1: ข้อมูลสมรรถนะ */}
          <section className="space-y-6">
            <div className="border-b pb-2">
              <h2 className="text-lg font-semibold text-gray-900">1. ข้อมูลสมรรถนะ</h2>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="competency" className="text-sm font-medium text-gray-700">
                  เลือกสมรรถนะที่ต้องการพัฒนา <span className="text-red-500">*</span>
                </Label>
                <Select>
                  <SelectTrigger id="competency" className="w-full md:w-1/2 focus:ring-[#1e3a8a]">
                    <SelectValue placeholder="-- กรุณาเลือก --" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="core">สมรรถนะหลัก (Core Competency)</SelectItem>
                    <SelectItem value="managerial">สมรรถนะทางการบริหาร (Managerial Competency)</SelectItem>
                    <SelectItem value="functional">สมรรถนะเฉพาะสายงาน (Functional Competency)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="details" className="text-sm font-medium text-gray-700">
                  ระบุหัวข้อหรือทักษะที่ต้องการพัฒนาอย่างละเอียด <span className="text-red-500">*</span>
                </Label>
                <Textarea 
                  id="details" 
                  placeholder="พิมพ์รายละเอียดที่นี่..." 
                  className="min-h-[120px] focus-visible:ring-[#1e3a8a]" 
                />
              </div>
            </div>
          </section>

          {/* Section 2: วิธีการพัฒนา */}
          <section className="space-y-6">
            <div className="border-b pb-2">
              <h2 className="text-lg font-semibold text-gray-900">2. วิธีการพัฒนา</h2>
            </div>
            
            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-700">
                รูปแบบการพัฒนา <span className="text-red-500">*</span>
              </Label>
              <RadioGroup defaultValue="training" className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:space-x-6 mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="training" id="training" className="text-[#1e3a8a] border-gray-300" />
                  <Label htmlFor="training" className="font-normal cursor-pointer">การฝึกอบรม (Training)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="coaching" id="coaching" className="text-[#1e3a8a] border-gray-300" />
                  <Label htmlFor="coaching" className="font-normal cursor-pointer">การสอนงาน (Coaching)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="self-learning" id="self-learning" className="text-[#1e3a8a] border-gray-300" />
                  <Label htmlFor="self-learning" className="font-normal cursor-pointer">การเรียนรู้ด้วยตนเอง</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="project" id="project" className="text-[#1e3a8a] border-gray-300" />
                  <Label htmlFor="project" className="font-normal cursor-pointer">การมอบหมายโครงการ</Label>
                </div>
              </RadioGroup>
            </div>
          </section>

          {/* Section 3: ระยะเวลาและงบประมาณ */}
          <section className="space-y-6">
            <div className="border-b pb-2">
              <h2 className="text-lg font-semibold text-gray-900">3. ระยะเวลาและงบประมาณ</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  ช่วงเวลาที่คาดว่าจะดำเนินการ (เริ่มต้น - สิ้นสุด)
                </Label>
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <Popover>
                    <PopoverTrigger
                      className={cn(buttonVariants({ variant: "outline" }),
                        "w-full sm:w-auto flex-1 justify-start text-left font-normal focus:ring-[#1e3a8a]",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "dd MMM yyyy", { locale: th }) : <span>วันที่เริ่มต้น</span>}
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                      />
                    </PopoverContent>
                  </Popover>
                  <span className="text-gray-400 hidden sm:inline-block">-</span>
                  <Popover>
                    <PopoverTrigger
                      className={cn(buttonVariants({ variant: "outline" }),
                        "w-full sm:w-auto flex-1 justify-start text-left font-normal focus:ring-[#1e3a8a]",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "dd MMM yyyy", { locale: th }) : <span>วันที่สิ้นสุด</span>}
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget" className="text-sm font-medium text-gray-700">
                  งบประมาณโดยประมาณ (บาท)
                </Label>
                <Input 
                  id="budget" 
                  type="number" 
                  placeholder="0.00" 
                  className="w-full focus-visible:ring-[#1e3a8a]" 
                />
              </div>
            </div>
          </section>

        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end items-center gap-4 pt-4 pb-10">
        <Link href="/" className={cn(buttonVariants({ variant: "outline" }), "border-gray-300 text-gray-700 hover:bg-gray-100")}>
          ยกเลิก
        </Link>
        <Button className="bg-[#1e3a8a] hover:bg-[#152e73] text-white shadow-md transition-colors">
          บันทึกและส่งอนุมัติ
        </Button>
      </div>
    </div>
  );
}
