"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
  
  const { control, handleSubmit, trigger, formState: { errors } } = useForm<FormValues>({
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
    const isValid = await trigger(["knowledge", "skill", "requiredCompetency", "managerialCompetency", "functionalCompetency", "coreCompetency"]);
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
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-200 text-sm">1</span>
          ความรู้ / ทักษะ / สมรรถนะที่ต้องการพัฒนา
        </h2>
        
        

        <div className="flex flex-col space-y-6">
          {/* ความรู้ความสามารถที่จำเป็นสำหรับการปฏิบัติงาน */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Label className="text-[#2e1065] dark:text-purple-200 font-bold text-lg" htmlFor="knowledge">ความรู้ความสามารถที่จำเป็นสำหรับการปฏิบัติงาน</Label>
              {errors.knowledge && <span className="text-sm text-destructive font-bold bg-destructive/10 px-3 py-1 rounded-md animate-in fade-in zoom-in duration-300">{errors.knowledge.message}</span>}
            </div>
            <Controller
              control={control}
              name="knowledge"
              render={({ field }) => (
                <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-col space-y-4 mt-3 bg-white dark:bg-[#150a29] p-5 rounded-xl border border-slate-100 dark:border-purple-800/50 shadow-sm">
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="ความรู้ความสามารถที่ใช้ในการปฏิบัติงาน" id="k1" className="h-5 w-5 mt-0.5" />
                    <Label htmlFor="k1" className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300">ความรู้ความสามารถที่ใช้ในการปฏิบัติงาน</Label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="ความรู้เรื่องกฏหมายและกฏระเบียบทางราชการ" id="k2" className="h-5 w-5 mt-0.5" />
                    <Label htmlFor="k2" className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300">ความรู้เรื่องกฏหมายและกฏระเบียบทางราชการ</Label>
                  </div>
                </RadioGroup>
              )}
            />
          </div>

          {/* ทักษะ */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Label className="text-[#2e1065] dark:text-purple-200 font-bold text-lg" htmlFor="skill">ทักษะ</Label>
              {errors.skill && <span className="text-sm text-destructive font-bold bg-destructive/10 px-3 py-1 rounded-md animate-in fade-in zoom-in duration-300">{errors.skill.message}</span>}
            </div>
            <Controller
              control={control}
              name="skill"
              render={({ field }) => (
                <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-col space-y-4 mt-3 bg-white dark:bg-[#150a29] p-5 rounded-xl border border-slate-100 dark:border-purple-800/50 shadow-sm">
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="การใช้คอมพิวเตอร์" id="s1" className="h-5 w-5 mt-0.5" />
                    <Label htmlFor="s1" className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300">การใช้คอมพิวเตอร์</Label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="การใช้ภาษา" id="s2" className="h-5 w-5 mt-0.5" />
                    <Label htmlFor="s2" className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300">การใช้ภาษา</Label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="การคำนวณ" id="s3" className="h-5 w-5 mt-0.5" />
                    <Label htmlFor="s3" className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300">การคำนวณ</Label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="การจัดการข้อมูล" id="s4" className="h-5 w-5 mt-0.5" />
                    <Label htmlFor="s4" className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300">การจัดการข้อมูล</Label>
                  </div>
                </RadioGroup>
              )}
            />
          </div>

          {/* สมรรถนะที่จำเป็น */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Label className="text-[#2e1065] dark:text-purple-200 font-bold text-lg" htmlFor="requiredCompetency">สมรรถนะที่จำเป็น</Label>
              {errors.requiredCompetency && <span className="text-sm text-destructive font-bold bg-destructive/10 px-3 py-1 rounded-md animate-in fade-in zoom-in duration-300">{errors.requiredCompetency.message}</span>}
            </div>
            <Controller
              control={control}
              name="requiredCompetency"
              render={({ field }) => (
                <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-col space-y-4 mt-3 bg-white dark:bg-[#150a29] p-5 rounded-xl border border-slate-100 dark:border-purple-800/50 shadow-sm">
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="การทำงานที่เป็นเลิศ" id="rc1" className="h-5 w-5 mt-0.5" />
                    <Label htmlFor="rc1" className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300">การทำงานที่เป็นเลิศ</Label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="การยึดมั่นในความถูกต้องและมีจิตบริการ" id="rc2" className="h-5 w-5 mt-0.5" />
                    <Label htmlFor="rc2" className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300">การยึดมั่นในความถูกต้องและมีจิตบริการ</Label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="การประสานความร่วมมือร่วมใจ" id="rc3" className="h-5 w-5 mt-0.5" />
                    <Label htmlFor="rc3" className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300">การประสานความร่วมมือร่วมใจ</Label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="ความยืดหยุ่น คล่องตัว ริเริ่มสร้างสรรค์" id="rc4" className="h-5 w-5 mt-0.5" />
                    <Label htmlFor="rc4" className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300">ความยืดหยุ่น คล่องตัว ริเริ่มสร้างสรรค์</Label>
                  </div>
                </RadioGroup>
              )}
            />
          </div>

          {/* สมรรถนะทางการบริหาร */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Label className="text-[#2e1065] dark:text-purple-200 font-bold text-lg" htmlFor="managerialCompetency">สมรรถนะทางการบริหาร</Label>
              {errors.managerialCompetency && <span className="text-sm text-destructive font-bold bg-destructive/10 px-3 py-1 rounded-md animate-in fade-in zoom-in duration-300">{errors.managerialCompetency.message}</span>}
            </div>
            <Controller
              control={control}
              name="managerialCompetency"
              render={({ field }) => (
                <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-col space-y-4 mt-3 bg-white dark:bg-[#150a29] p-5 rounded-xl border border-slate-100 dark:border-purple-800/50 shadow-sm">
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="การสื่อสารและการสร้างความผูกพันธ์" id="mc1" className="h-5 w-5 mt-0.5" />
                    <Label htmlFor="mc1" className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300">การสื่อสารและการสร้างความผูกพันธ์</Label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="การเรียนรู้และพัฒนา" id="mc2" className="h-5 w-5 mt-0.5" />
                    <Label htmlFor="mc2" className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300">การเรียนรู้และพัฒนา</Label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="การปฏิรูป / ปรับเปลี่ยนราชการสู่อนาคต" id="mc3" className="h-5 w-5 mt-0.5" />
                    <Label htmlFor="mc3" className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300">การปฏิรูป / ปรับเปลี่ยนราชการสู่อนาคต</Label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="การรักษาวินัย คุณธรรม และจริยธรรม" id="mc4" className="h-5 w-5 mt-0.5" />
                    <Label htmlFor="mc4" className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300">การรักษาวินัย คุณธรรม และจริยธรรม</Label>
                  </div>
                </RadioGroup>
              )}
            />
          </div>

          {/* สมรรถนะเฉพาะตามลักษณะงานที่ปฏิบัติ */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Label className="text-[#2e1065] dark:text-purple-200 font-bold text-lg" htmlFor="functionalCompetency">สมรรถนะเฉพาะตามลักษณะงานที่ปฏิบัติ</Label>
              {errors.functionalCompetency && <span className="text-sm text-destructive font-bold bg-destructive/10 px-3 py-1 rounded-md animate-in fade-in zoom-in duration-300">{errors.functionalCompetency.message}</span>}
            </div>
            <Controller
              control={control}
              name="functionalCompetency"
              render={({ field }) => (
                <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-col space-y-4 mt-3 bg-white dark:bg-[#150a29] p-5 rounded-xl border border-slate-100 dark:border-purple-800/50 shadow-sm">
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="การคิดวิเคราะห์" id="fc1" className="h-5 w-5 mt-0.5" />
                    <Label htmlFor="fc1" className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300">การคิดวิเคราะห์</Label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="การมองภาพองค์รวม" id="fc2" className="h-5 w-5 mt-0.5" />
                    <Label htmlFor="fc2" className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300">การมองภาพองค์รวม</Label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="การแสดงความรับผิดชอบตามหน้าที่" id="fc3" className="h-5 w-5 mt-0.5" />
                    <Label htmlFor="fc3" className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300">การแสดงความรับผิดชอบตามหน้าที่</Label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="การสืบเสาะหาข้อมูล" id="fc4" className="h-5 w-5 mt-0.5" />
                    <Label htmlFor="fc4" className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300">การสืบเสาะหาข้อมูล</Label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="การตรวจสอบความถูกต้องตามกระบวนงาน" id="fc5" className="h-5 w-5 mt-0.5" />
                    <Label htmlFor="fc5" className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300">การตรวจสอบความถูกต้องตามกระบวนงาน</Label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="ความเข้าใจองค์กรและระบบราชการ" id="fc6" className="h-5 w-5 mt-0.5" />
                    <Label htmlFor="fc6" className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300">ความเข้าใจองค์กรและระบบราชการ</Label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="การดำเนินการเชิงรุก" id="fc7" className="h-5 w-5 mt-0.5" />
                    <Label htmlFor="fc7" className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300">การดำเนินการเชิงรุก</Label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="ความมั่นใจในตนเอง" id="fc8" className="h-5 w-5 mt-0.5" />
                    <Label htmlFor="fc8" className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300">ความมั่นใจในตนเอง</Label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="สุนทรียภาพทางศิลปะ" id="fc9" className="h-5 w-5 mt-0.5" />
                    <Label htmlFor="fc9" className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300">สุนทรียภาพทางศิลปะ</Label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="ความคิดสร้างสรรค์" id="fc10" className="h-5 w-5 mt-0.5" />
                    <Label htmlFor="fc10" className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300">ความคิดสร้างสรรค์</Label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="การใส่ใจและพัฒนาผู้อื่น" id="fc11" className="h-5 w-5 mt-0.5" />
                    <Label htmlFor="fc11" className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300">การใส่ใจและพัฒนาผู้อื่น</Label>
                  </div>
                </RadioGroup>
              )}
            />
          </div>

          {/* สมรรถนะหลัก */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Label className="text-[#2e1065] dark:text-purple-200 font-bold text-lg" htmlFor="coreCompetency">สมรรถนะหลัก</Label>
              {errors.coreCompetency && <span className="text-sm text-destructive font-bold bg-destructive/10 px-3 py-1 rounded-md animate-in fade-in duration-300">{errors.coreCompetency.message}</span>}
            </div>
            <Controller
              control={control}
              name="coreCompetency"
              render={({ field }) => (
                <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-col space-y-4 mt-3 bg-white dark:bg-[#150a29] p-5 rounded-xl border border-slate-100 dark:border-purple-800/50 shadow-sm">
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="ความสามารถ และความอุตสาหะในการปฏิบัติงาน" id="cc1" className="h-5 w-5 mt-0.5" />
                    <Label htmlFor="cc1" className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300">ความสามารถ และความอุตสาหะในการปฏิบัติงาน</Label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="การรักษาวินัย และปฏิบัติตนเหมาะสมกับการเป็นลูกจ้างประจำ" id="cc2" className="h-5 w-5 mt-0.5" />
                    <Label htmlFor="cc2" className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300">การรักษาวินัย และปฏิบัติตนเหมาะสมกับการเป็นลูกจ้างประจำ</Label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="ความรับผิดชอบ" id="cc3" className="h-5 w-5 mt-0.5" />
                    <Label htmlFor="cc3" className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300">ความรับผิดชอบ</Label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="ความร่วมมือ" id="cc4" className="h-5 w-5 mt-0.5" />
                    <Label htmlFor="cc4" className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300">ความร่วมมือ</Label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="สภาพการมาปฏิบัติงาน" id="cc5" className="h-5 w-5 mt-0.5" />
                    <Label htmlFor="cc5" className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300">สภาพการมาปฏิบัติงาน</Label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="การวางแผน" id="cc6" className="h-5 w-5 mt-0.5" />
                    <Label htmlFor="cc6" className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300">การวางแผน</Label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="ความคิดริเริ่ม" id="cc7" className="h-5 w-5 mt-0.5" />
                    <Label htmlFor="cc7" className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300">ความคิดริเริ่ม</Label>
                  </div>
                </RadioGroup>
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
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-200 text-sm shrink-0">2</span>
            วิธีการพัฒนารูปแบบ 70:20:10
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 ml-11">โดยต้องดำเนินการพัฒนาครบร้อยละ 100</p>
        </div>
        
        

        <div className="flex flex-col space-y-6">
          {/* หมวด 70% */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Label className="text-[#2e1065] dark:text-purple-200 font-bold text-lg" htmlFor="dev70">
                70% การเรียนรู้จากประสบการณ์ (Experiential Learning)
              </Label>
              {errors.dev70 && <span className="text-sm text-destructive font-bold bg-destructive/10 px-3 py-1 rounded-md animate-in fade-in zoom-in duration-300">{errors.dev70.message}</span>}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              เกิดจากประสบการณ์ในการทำงาน การทดลองปฏิบัติงาน การได้รับการมอบหมายงานให้รับผิดชอบ การติดตามและสังเกตการณ์ทำงานของผู้ร่วมงาน เพื่อให้เกิดพัฒนาความรู้ ความคิด และทักษะในการทำงาน รู้จักการแก้ไขปัญหา เพื่อให้งานบรรลุเป้าหมาย ดังนี้
            </p>
            <Controller
              control={control}
              name="dev70"
              render={({ field }) => (
                <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-col space-y-4 mt-3 bg-white dark:bg-[#150a29] p-5 rounded-xl border border-slate-100 dark:border-purple-800/50 shadow-sm">
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="การลงมือปฏิบัติ (On the-job Training)" id="dev70-1" className="h-5 w-5 mt-0.5" />
                    <Label htmlFor="dev70-1" className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300">1. การลงมือปฏิบัติ (On the-job Training)</Label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="การได้รับมอบหมายงาน (Assignment)" id="dev70-2" className="h-5 w-5 mt-0.5" />
                    <Label htmlFor="dev70-2" className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300">2. การได้รับมอบหมายงาน (Assignment)</Label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="การเรียนรู้ด้วยตนเองโดยการศึกษาจากเอกสาร คู่มือ แนวทางการปฏิบัติ YouTube TikTok ฯลฯ (Self-learning)" id="dev70-3" className="h-5 w-5 mt-0.5" />
                    <Label htmlFor="dev70-3" className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300 leading-relaxed">3. การเรียนรู้ด้วยตนเองโดยการศึกษาจากเอกสาร คู่มือ แนวทางการปฏิบัติ YouTube TikTok ฯลฯ (Self-learning)</Label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="การติดตาม / สังเกต (Job Shadowing)" id="dev70-4" className="h-5 w-5 mt-0.5" />
                    <Label htmlFor="dev70-4" className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300">4. การติดตาม / สังเกต (Job Shadowing)</Label>
                  </div>
                </RadioGroup>
              )}
            />
          </div>

          {/* หมวด 20% */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Label className="text-[#2e1065] dark:text-purple-200 font-bold text-lg" htmlFor="dev20">
                20% การเรียนรู้จากผู้อื่น (Social Learning)
              </Label>
              {errors.dev20 && <span className="text-sm text-destructive font-bold bg-destructive/10 px-3 py-1 rounded-md animate-in fade-in zoom-in duration-300">{errors.dev20.message}</span>}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              เกิดจากการให้คำปรึกษาแนะนำ การสอนงาน และข้อมูลย้อนกลับ จากผู้บังคับบัญชา เพื่อนร่วมงาน และบุคคลอื่น ๆ ที่เกี่ยวข้อง ดังนี้
            </p>
            <Controller
              control={control}
              name="dev20"
              render={({ field }) => (
                <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-col space-y-4 mt-3 bg-white dark:bg-[#150a29] p-5 rounded-xl border border-slate-100 dark:border-purple-800/50 shadow-sm">
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="การให้คำปรึกษาแนะนำ (Consulting)" id="dev20-1" className="h-5 w-5 mt-0.5" />
                    <Label htmlFor="dev20-1" className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300">1. การให้คำปรึกษาแนะนำ (Consulting)</Label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="การสอนงาน (Coaching)" id="dev20-2" className="h-5 w-5 mt-0.5" />
                    <Label htmlFor="dev20-2" className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300">2. การสอนงาน (Coaching)</Label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="การให้ข้อมูลป้อนกลับ (Feedback)" id="dev20-3" className="h-5 w-5 mt-0.5" />
                    <Label htmlFor="dev20-3" className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300">3. การให้ข้อมูลป้อนกลับ (Feedback)</Label>
                  </div>
                </RadioGroup>
              )}
            />
          </div>

          {/* หมวด 10% */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Label className="text-[#2e1065] dark:text-purple-200 font-bold text-lg" htmlFor="dev10">
                10% การเรียนรู้จากการฝึกอบรม (Formal Learning)
              </Label>
              {errors.dev10 && <span className="text-sm text-destructive font-bold bg-destructive/10 px-3 py-1 rounded-md animate-in fade-in zoom-in duration-300">{errors.dev10.message}</span>}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              ได้มาจากการเข้าฝึกอบรม การประชุม / สัมมนาอย่างเป็นทางการ และไม่เป็นทางการ ผ่านช่องทางการเรียนรู้และสื่อต่าง ๆ ดังนี้
            </p>
            <Controller
              control={control}
              name="dev10"
              render={({ field }) => (
                <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-col space-y-4 mt-3 bg-white dark:bg-[#150a29] p-5 rounded-xl border border-slate-100 dark:border-purple-800/50 shadow-sm">
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="การอบรมในรูปแบบการเรียนผ่านระบบ e-learning การอบรมในห้องเรียนทั้งในรูปแบบ Onsite Online และ ผสมผสาน (Hybrid) (Training) ฯลฯ" id="dev10-1" className="h-5 w-5 mt-0.5" />
                    <Label htmlFor="dev10-1" className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300 leading-relaxed">1. การอบรมในรูปแบบการเรียนผ่านระบบ e-learning การอบรมในห้องเรียนทั้งในรูปแบบ Onsite Online และ ผสมผสาน (Hybrid) (Training) ฯลฯ</Label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="การประชุม / สัมมนา (Meeting / Seminar)" id="dev10-2" className="h-5 w-5 mt-0.5" />
                    <Label htmlFor="dev10-2" className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300">2. การประชุม / สัมมนา (Meeting / Seminar)</Label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="การอบรม / ประชุม แบบไม่เป็นทางการ" id="dev10-3" className="h-5 w-5 mt-0.5" />
                    <Label htmlFor="dev10-3" className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300">3. การอบรม / ประชุม แบบไม่เป็นทางการ</Label>
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

