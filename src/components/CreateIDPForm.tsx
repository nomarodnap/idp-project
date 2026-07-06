"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  knowledge: z.string().min(1, "กรุณาเลือกความรู้ความสามารถที่จำเป็น"),
  skill: z.string().min(1, "กรุณาเลือกทักษะ"),
  requiredCompetency: z.string().min(1, "กรุณาเลือกสมรรถนะที่จำเป็น"),
  managerialCompetency: z.string().min(1, "กรุณาเลือกสมรรถนะทางการบริหาร"),
  functionalCompetency: z.string().min(1, "กรุณาเลือกสมรรถนะเฉพาะ"),
  coreCompetency: z.string().min(1, "กรุณาเลือกสมรรถนะหลัก"),
  dev70: z.string().min(1, "กรุณาเลือกการเรียนรู้จากประสบการณ์ (70%)"),
  dev20: z.string().min(1, "กรุณาเลือกการเรียนรู้จากผู้อื่น (20%)"),
  dev10: z.string().min(1, "กรุณาเลือกการเรียนรู้จากการฝึกอบรม (10%)"),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateIDPForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      knowledge: "",
      skill: "",
      requiredCompetency: "",
      managerialCompetency: "",
      functionalCompetency: "",
      coreCompetency: "",
      dev70: "",
      dev20: "",
      dev10: "",
    },
  });

  function onSubmit(data: FormValues) {
    console.log("Submitted Data:", data);
    // TODO: Proceed to next step based on user requirements
  }

  const handleNextStep = async () => {
    const isValid = await trigger([
      "knowledge",
      "skill",
      "requiredCompetency",
      "managerialCompetency",
      "functionalCompetency",
      "coreCompetency",
    ]);
    if (isValid) {
      setStep(2);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* หัวข้อใหญ่หลัก */}
      {step === 1 && (
        <div className="space-y-6 bg-slate-50/50 dark:bg-purple-900/10 p-6 sm:p-8 rounded-2xl border border-slate-100 dark:border-purple-800/30 shadow-sm">
          <h2 className="text-xl font-bold text-[#2e1065] dark:text-purple-100 border-b-2 border-purple-100 dark:border-purple-800/50 pb-3 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-200 text-sm">
              1
            </span>
            ความรู้ / ทักษะ / สมรรถนะที่ต้องการพัฒนา
          </h2>

          <div className="flex flex-col space-y-8 mt-6">
            {/* ความรู้ความสามารถที่จำเป็นสำหรับการปฏิบัติงาน */}
            <div className="bg-white dark:bg-[#1a0b2e] p-5 sm:p-7 rounded-2xl border border-slate-100 dark:border-purple-800/50 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Label
                  className="text-[#2e1065] dark:text-purple-200 font-bold text-lg"
                  htmlFor="knowledge"
                >
                  ความรู้ความสามารถที่จำเป็นสำหรับการปฏิบัติงาน
                </Label>
                {errors.knowledge && (
                  <span className="text-sm text-destructive font-bold bg-destructive/10 px-3 py-1 rounded-md animate-in fade-in zoom-in duration-300">
                    {errors.knowledge.message}
                  </span>
                )}
              </div>
              <Controller
                control={control}
                name="knowledge"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger
                      className={`w-full h-12 px-4 mt-3 bg-white dark:bg-[#150a29] rounded-xl border shadow-sm transition-all ${errors.knowledge ? "border-destructive ring-1 ring-destructive/50" : "border-slate-100 dark:border-purple-800/50"}`}
                    >
                      <SelectValue placeholder="-- เลือกความรู้ความสามารถ --" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ความรู้ความสามารถที่ใช้ในการปฏิบัติงาน">
                        ความรู้ความสามารถที่ใช้ในการปฏิบัติงาน
                      </SelectItem>
                      <SelectItem value="ความรู้เรื่องกฏหมายและกฏระเบียบทางราชการ">
                        ความรู้เรื่องกฏหมายและกฏระเบียบทางราชการ
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* ทักษะ */}
            <div className="bg-white dark:bg-[#1a0b2e] p-5 sm:p-7 rounded-2xl border border-slate-100 dark:border-purple-800/50 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Label
                  className="text-[#2e1065] dark:text-purple-200 font-bold text-lg"
                  htmlFor="skill"
                >
                  ทักษะ
                </Label>
                {errors.skill && (
                  <span className="text-sm text-destructive font-bold bg-destructive/10 px-3 py-1 rounded-md animate-in fade-in zoom-in duration-300">
                    {errors.skill.message}
                  </span>
                )}
              </div>
              <Controller
                control={control}
                name="skill"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger
                      className={`w-full h-12 px-4 mt-3 bg-white dark:bg-[#150a29] rounded-xl border shadow-sm transition-all ${errors.skill ? "border-destructive ring-1 ring-destructive/50" : "border-slate-100 dark:border-purple-800/50"}`}
                    >
                      <SelectValue placeholder="-- เลือกทักษะ --" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="การใช้คอมพิวเตอร์">
                        การใช้คอมพิวเตอร์
                      </SelectItem>
                      <SelectItem value="การใช้ภาษา">การใช้ภาษา</SelectItem>
                      <SelectItem value="การคำนวณ">การคำนวณ</SelectItem>
                      <SelectItem value="การจัดการข้อมูล">
                        การจัดการข้อมูล
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* สมรรถนะที่จำเป็น */}
            <div className="bg-white dark:bg-[#1a0b2e] p-5 sm:p-7 rounded-2xl border border-slate-100 dark:border-purple-800/50 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Label
                  className="text-[#2e1065] dark:text-purple-200 font-bold text-lg"
                  htmlFor="requiredCompetency"
                >
                  สมรรถนะที่จำเป็น
                </Label>
                {errors.requiredCompetency && (
                  <span className="text-sm text-destructive font-bold bg-destructive/10 px-3 py-1 rounded-md animate-in fade-in zoom-in duration-300">
                    {errors.requiredCompetency.message}
                  </span>
                )}
              </div>
              <Controller
                control={control}
                name="requiredCompetency"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger
                      className={`w-full h-12 px-4 mt-3 bg-white dark:bg-[#150a29] rounded-xl border shadow-sm transition-all ${errors.requiredCompetency ? "border-destructive ring-1 ring-destructive/50" : "border-slate-100 dark:border-purple-800/50"}`}
                    >
                      <SelectValue placeholder="-- เลือกสมรรถนะที่จำเป็น --" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="การทำงานที่เป็นเลิศ">
                        การทำงานที่เป็นเลิศ
                      </SelectItem>
                      <SelectItem value="การยึดมั่นในความถูกต้องและมีจิตบริการ">
                        การยึดมั่นในความถูกต้องและมีจิตบริการ
                      </SelectItem>
                      <SelectItem value="การประสานความร่วมมือร่วมใจ">
                        การประสานความร่วมมือร่วมใจ
                      </SelectItem>
                      <SelectItem value="ความยืดหยุ่น คล่องตัว ริเริ่มสร้างสรรค์">
                        ความยืดหยุ่น คล่องตัว ริเริ่มสร้างสรรค์
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* สมรรถนะทางการบริหาร */}
            <div className="bg-white dark:bg-[#1a0b2e] p-5 sm:p-7 rounded-2xl border border-slate-100 dark:border-purple-800/50 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Label
                  className="text-[#2e1065] dark:text-purple-200 font-bold text-lg"
                  htmlFor="managerialCompetency"
                >
                  สมรรถนะทางการบริหาร
                </Label>
                {errors.managerialCompetency && (
                  <span className="text-sm text-destructive font-bold bg-destructive/10 px-3 py-1 rounded-md animate-in fade-in zoom-in duration-300">
                    {errors.managerialCompetency.message}
                  </span>
                )}
              </div>
              <Controller
                control={control}
                name="managerialCompetency"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger
                      className={`w-full h-12 px-4 mt-3 bg-white dark:bg-[#150a29] rounded-xl border shadow-sm transition-all ${errors.managerialCompetency ? "border-destructive ring-1 ring-destructive/50" : "border-slate-100 dark:border-purple-800/50"}`}
                    >
                      <SelectValue placeholder="-- เลือกสมรรถนะทางการบริหาร --" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="การสื่อสารและการสร้างความผูกพันธ์">
                        การสื่อสารและการสร้างความผูกพันธ์
                      </SelectItem>
                      <SelectItem value="การเรียนรู้และพัฒนา">
                        การเรียนรู้และพัฒนา
                      </SelectItem>
                      <SelectItem value="การปฏิรูป / ปรับเปลี่ยนราชการสู่อนาคต">
                        การปฏิรูป / ปรับเปลี่ยนราชการสู่อนาคต
                      </SelectItem>
                      <SelectItem value="การรักษาวินัย คุณธรรม และจริยธรรม">
                        การรักษาวินัย คุณธรรม และจริยธรรม
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* สมรรถนะเฉพาะตามลักษณะงานที่ปฏิบัติ */}
            <div className="bg-white dark:bg-[#1a0b2e] p-5 sm:p-7 rounded-2xl border border-slate-100 dark:border-purple-800/50 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Label
                  className="text-[#2e1065] dark:text-purple-200 font-bold text-lg"
                  htmlFor="functionalCompetency"
                >
                  สมรรถนะเฉพาะตามลักษณะงานที่ปฏิบัติ
                </Label>
                {errors.functionalCompetency && (
                  <span className="text-sm text-destructive font-bold bg-destructive/10 px-3 py-1 rounded-md animate-in fade-in zoom-in duration-300">
                    {errors.functionalCompetency.message}
                  </span>
                )}
              </div>
              <Controller
                control={control}
                name="functionalCompetency"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger
                      className={`w-full h-12 px-4 mt-3 bg-white dark:bg-[#150a29] rounded-xl border shadow-sm transition-all ${errors.functionalCompetency ? "border-destructive ring-1 ring-destructive/50" : "border-slate-100 dark:border-purple-800/50"}`}
                    >
                      <SelectValue placeholder="-- เลือกสมรรถนะเฉพาะ --" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="การคิดวิเคราะห์">
                        การคิดวิเคราะห์
                      </SelectItem>
                      <SelectItem value="การมองภาพองค์รวม">
                        การมองภาพองค์รวม
                      </SelectItem>
                      <SelectItem value="การแสดงความรับผิดชอบตามหน้าที่">
                        การแสดงความรับผิดชอบตามหน้าที่
                      </SelectItem>
                      <SelectItem value="การสืบเสาะหาข้อมูล">
                        การสืบเสาะหาข้อมูล
                      </SelectItem>
                      <SelectItem value="การตรวจสอบความถูกต้องตามกระบวนงาน">
                        การตรวจสอบความถูกต้องตามกระบวนงาน
                      </SelectItem>
                      <SelectItem value="ความเข้าใจองค์กรและระบบราชการ">
                        ความเข้าใจองค์กรและระบบราชการ
                      </SelectItem>
                      <SelectItem value="การดำเนินการเชิงรุก">
                        การดำเนินการเชิงรุก
                      </SelectItem>
                      <SelectItem value="ความมั่นใจในตนเอง">
                        ความมั่นใจในตนเอง
                      </SelectItem>
                      <SelectItem value="สุนทรียภาพทางศิลปะ">
                        สุนทรียภาพทางศิลปะ
                      </SelectItem>
                      <SelectItem value="ความคิดสร้างสรรค์">
                        ความคิดสร้างสรรค์
                      </SelectItem>
                      <SelectItem value="การใส่ใจและพัฒนาผู้อื่น">
                        การใส่ใจและพัฒนาผู้อื่น
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* สมรรถนะหลัก */}
            <div className="bg-white dark:bg-[#1a0b2e] p-5 sm:p-7 rounded-2xl border border-slate-100 dark:border-purple-800/50 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Label
                  className="text-[#2e1065] dark:text-purple-200 font-bold text-lg"
                  htmlFor="coreCompetency"
                >
                  สมรรถนะหลัก
                </Label>
                {errors.coreCompetency && (
                  <span className="text-sm text-destructive font-bold bg-destructive/10 px-3 py-1 rounded-md animate-in fade-in duration-300">
                    {errors.coreCompetency.message}
                  </span>
                )}
              </div>
              <Controller
                control={control}
                name="coreCompetency"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger
                      className={`w-full h-12 px-4 mt-3 bg-white dark:bg-[#150a29] rounded-xl border shadow-sm transition-all ${errors.coreCompetency ? "border-destructive ring-1 ring-destructive/50" : "border-slate-100 dark:border-purple-800/50"}`}
                    >
                      <SelectValue placeholder="-- เลือกสมรรถนะหลัก --" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ความสามารถ และความอุตสาหะในการปฏิบัติงาน">
                        ความสามารถ และความอุตสาหะในการปฏิบัติงาน
                      </SelectItem>
                      <SelectItem value="การรักษาวินัย และปฏิบัติตนเหมาะสมกับการเป็นลูกจ้างประจำ">
                        การรักษาวินัย และปฏิบัติตนเหมาะสมกับการเป็นลูกจ้างประจำ
                      </SelectItem>
                      <SelectItem value="ความรับผิดชอบ">
                        ความรับผิดชอบ
                      </SelectItem>
                      <SelectItem value="ความร่วมมือ">ความร่วมมือ</SelectItem>
                      <SelectItem value="สภาพการมาปฏิบัติงาน">
                        สภาพการมาปฏิบัติงาน
                      </SelectItem>
                      <SelectItem value="การวางแผน">การวางแผน</SelectItem>
                      <SelectItem value="ความคิดริเริ่ม">
                        ความคิดริเริ่ม
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
        </div>
      )}

      {/* หัวข้อใหญ่ที่ 2 */}
      {step === 2 && (
        <div className="space-y-6 bg-slate-50/50 dark:bg-purple-900/10 p-6 sm:p-8 rounded-2xl border border-slate-100 dark:border-purple-800/30 shadow-sm">
          <div className="border-b-2 border-purple-100 dark:border-purple-800/50 pb-3">
            <h2 className="text-xl font-bold text-[#2e1065] dark:text-purple-100 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-200 text-sm shrink-0">
                2
              </span>
              วิธีการพัฒนารูปแบบ 70:20:10
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 ml-11">
              โดยต้องดำเนินการพัฒนาครบร้อยละ 100
            </p>
          </div>

          <div className="flex flex-col space-y-8 mt-6">
            {/* หมวด 70% */}
            <div className="bg-white dark:bg-[#1a0b2e] p-5 sm:p-7 rounded-2xl border border-slate-100 dark:border-purple-800/50 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Label
                  className="text-[#2e1065] dark:text-purple-200 font-bold text-lg"
                  htmlFor="dev70"
                >
                  70% การเรียนรู้จากประสบการณ์ (Experiential Learning)
                </Label>
                {errors.dev70 && (
                  <span className="text-sm text-destructive font-bold bg-destructive/10 px-3 py-1 rounded-md animate-in fade-in zoom-in duration-300">
                    {errors.dev70.message}
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                เกิดจากประสบการณ์ในการทำงาน การทดลองปฏิบัติงาน
                การได้รับการมอบหมายงานให้รับผิดชอบ
                การติดตามและสังเกตการณ์ทำงานของผู้ร่วมงาน
                เพื่อให้เกิดพัฒนาความรู้ ความคิด และทักษะในการทำงาน
                รู้จักการแก้ไขปัญหา เพื่อให้งานบรรลุเป้าหมาย ดังนี้
              </p>
              <Controller
                control={control}
                name="dev70"
                render={({ field }) => (
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-col space-y-4 mt-3 bg-white dark:bg-[#150a29] p-5 rounded-xl border border-slate-100 dark:border-purple-800/50 shadow-sm"
                  >
                    <div className="flex items-start space-x-3">
                      <RadioGroupItem
                        value="การลงมือปฏิบัติ (On the-job Training)"
                        id="dev70-1"
                        className="h-5 w-5 mt-0.5"
                      />
                      <Label
                        htmlFor="dev70-1"
                        className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300"
                      >
                        1. การลงมือปฏิบัติ (On the-job Training)
                      </Label>
                    </div>
                    <div className="flex items-start space-x-3">
                      <RadioGroupItem
                        value="การได้รับมอบหมายงาน (Assignment)"
                        id="dev70-2"
                        className="h-5 w-5 mt-0.5"
                      />
                      <Label
                        htmlFor="dev70-2"
                        className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300"
                      >
                        2. การได้รับมอบหมายงาน (Assignment)
                      </Label>
                    </div>
                    <div className="flex items-start space-x-3">
                      <RadioGroupItem
                        value="การเรียนรู้ด้วยตนเองโดยการศึกษาจากเอกสาร คู่มือ แนวทางการปฏิบัติ YouTube TikTok ฯลฯ (Self-learning)"
                        id="dev70-3"
                        className="h-5 w-5 mt-0.5"
                      />
                      <Label
                        htmlFor="dev70-3"
                        className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300 leading-relaxed"
                      >
                        3. การเรียนรู้ด้วยตนเองโดยการศึกษาจากเอกสาร คู่มือ
                        แนวทางการปฏิบัติ YouTube TikTok ฯลฯ (Self-learning)
                      </Label>
                    </div>
                    <div className="flex items-start space-x-3">
                      <RadioGroupItem
                        value="การติดตาม / สังเกต (Job Shadowing)"
                        id="dev70-4"
                        className="h-5 w-5 mt-0.5"
                      />
                      <Label
                        htmlFor="dev70-4"
                        className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300"
                      >
                        4. การติดตาม / สังเกต (Job Shadowing)
                      </Label>
                    </div>
                  </RadioGroup>
                )}
              />
            </div>

            {/* หมวด 20% */}
            <div className="bg-white dark:bg-[#1a0b2e] p-5 sm:p-7 rounded-2xl border border-slate-100 dark:border-purple-800/50 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Label
                  className="text-[#2e1065] dark:text-purple-200 font-bold text-lg"
                  htmlFor="dev20"
                >
                  20% การเรียนรู้จากผู้อื่น (Social Learning)
                </Label>
                {errors.dev20 && (
                  <span className="text-sm text-destructive font-bold bg-destructive/10 px-3 py-1 rounded-md animate-in fade-in zoom-in duration-300">
                    {errors.dev20.message}
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                เกิดจากการให้คำปรึกษาแนะนำ การสอนงาน และข้อมูลย้อนกลับ
                จากผู้บังคับบัญชา เพื่อนร่วมงาน และบุคคลอื่น ๆ ที่เกี่ยวข้อง
                ดังนี้
              </p>
              <Controller
                control={control}
                name="dev20"
                render={({ field }) => (
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-col space-y-4 mt-3 bg-white dark:bg-[#150a29] p-5 rounded-xl border border-slate-100 dark:border-purple-800/50 shadow-sm"
                  >
                    <div className="flex items-start space-x-3">
                      <RadioGroupItem
                        value="การให้คำปรึกษาแนะนำ (Consulting)"
                        id="dev20-1"
                        className="h-5 w-5 mt-0.5"
                      />
                      <Label
                        htmlFor="dev20-1"
                        className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300"
                      >
                        1. การให้คำปรึกษาแนะนำ (Consulting)
                      </Label>
                    </div>
                    <div className="flex items-start space-x-3">
                      <RadioGroupItem
                        value="การสอนงาน (Coaching)"
                        id="dev20-2"
                        className="h-5 w-5 mt-0.5"
                      />
                      <Label
                        htmlFor="dev20-2"
                        className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300"
                      >
                        2. การสอนงาน (Coaching)
                      </Label>
                    </div>
                    <div className="flex items-start space-x-3">
                      <RadioGroupItem
                        value="การให้ข้อมูลป้อนกลับ (Feedback)"
                        id="dev20-3"
                        className="h-5 w-5 mt-0.5"
                      />
                      <Label
                        htmlFor="dev20-3"
                        className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300"
                      >
                        3. การให้ข้อมูลป้อนกลับ (Feedback)
                      </Label>
                    </div>
                  </RadioGroup>
                )}
              />
            </div>

            {/* หมวด 10% */}
            <div className="bg-white dark:bg-[#1a0b2e] p-5 sm:p-7 rounded-2xl border border-slate-100 dark:border-purple-800/50 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Label
                  className="text-[#2e1065] dark:text-purple-200 font-bold text-lg"
                  htmlFor="dev10"
                >
                  10% การเรียนรู้จากการฝึกอบรม (Formal Learning)
                </Label>
                {errors.dev10 && (
                  <span className="text-sm text-destructive font-bold bg-destructive/10 px-3 py-1 rounded-md animate-in fade-in zoom-in duration-300">
                    {errors.dev10.message}
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                ได้มาจากการเข้าฝึกอบรม การประชุม / สัมมนาอย่างเป็นทางการ
                และไม่เป็นทางการ ผ่านช่องทางการเรียนรู้และสื่อต่าง ๆ ดังนี้
              </p>
              <Controller
                control={control}
                name="dev10"
                render={({ field }) => (
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-col space-y-4 mt-3 bg-white dark:bg-[#150a29] p-5 rounded-xl border border-slate-100 dark:border-purple-800/50 shadow-sm"
                  >
                    <div className="flex items-start space-x-3">
                      <RadioGroupItem
                        value="การอบรมในรูปแบบการเรียนผ่านระบบ e-learning การอบรมในห้องเรียนทั้งในรูปแบบ Onsite Online และ ผสมผสาน (Hybrid) (Training) ฯลฯ"
                        id="dev10-1"
                        className="h-5 w-5 mt-0.5"
                      />
                      <Label
                        htmlFor="dev10-1"
                        className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300 leading-relaxed"
                      >
                        1. การอบรมในรูปแบบการเรียนผ่านระบบ e-learning
                        การอบรมในห้องเรียนทั้งในรูปแบบ Onsite Online และ ผสมผสาน
                        (Hybrid) (Training) ฯลฯ
                      </Label>
                    </div>
                    <div className="flex items-start space-x-3">
                      <RadioGroupItem
                        value="การประชุม / สัมมนา (Meeting / Seminar)"
                        id="dev10-2"
                        className="h-5 w-5 mt-0.5"
                      />
                      <Label
                        htmlFor="dev10-2"
                        className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300"
                      >
                        2. การประชุม / สัมมนา (Meeting / Seminar)
                      </Label>
                    </div>
                    <div className="flex items-start space-x-3">
                      <RadioGroupItem
                        value="การอบรม / ประชุม แบบไม่เป็นทางการ"
                        id="dev10-3"
                        className="h-5 w-5 mt-0.5"
                      />
                      <Label
                        htmlFor="dev10-3"
                        className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300"
                      >
                        3. การอบรม / ประชุม แบบไม่เป็นทางการ
                      </Label>
                    </div>
                  </RadioGroup>
                )}
              />
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="pt-8 mt-8 flex justify-end items-center gap-4">
        {step === 1 ? (
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/")}
              className="h-12 px-8 rounded-xl font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-purple-900/30 border-slate-200 dark:border-purple-800/50 transition-all"
            >
              ยกเลิก
            </Button>
            <Button
              type="button"
              onClick={handleNextStep}
              className="h-12 px-8 rounded-xl font-bold text-white shadow-[0_4px_14px_0_rgba(91,33,182,0.39)] transition-all hover:shadow-[0_6px_20px_rgba(91,33,182,0.23)] hover:-translate-y-0.5 bg-gradient-to-r from-[#4c1d95] to-[#2e1065] hover:from-[#5b21b6] hover:to-[#4c1d95] dark:from-[#5b21b6] dark:to-[#3b0764] dark:hover:from-[#6d28d9] dark:hover:to-[#4c1d95] border-none"
            >
              ถัดไป
            </Button>
          </>
        ) : (
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(1)}
              className="h-12 px-8 rounded-xl font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-purple-900/30 border-slate-200 dark:border-purple-800/50 transition-all"
            >
              ย้อนกลับ
            </Button>
            <Button
              type="submit"
              className="h-12 px-8 rounded-xl font-bold text-white shadow-[0_4px_14px_0_rgba(91,33,182,0.39)] transition-all hover:shadow-[0_6px_20px_rgba(91,33,182,0.23)] hover:-translate-y-0.5 bg-gradient-to-r from-[#4c1d95] to-[#2e1065] hover:from-[#5b21b6] hover:to-[#4c1d95] dark:from-[#5b21b6] dark:to-[#3b0764] dark:hover:from-[#6d28d9] dark:hover:to-[#4c1d95] border-none"
            >
              บันทึก
            </Button>
          </>
        )}
      </div>
    </form>
  );
}
