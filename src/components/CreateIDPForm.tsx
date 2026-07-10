"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { createIDPPlan, updateIDPPlan } from "@/actions/idp";
import { Loader2, CheckCircle2, Info, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@/components/UserProvider";

const formSchema = z.object({
  devCategory: z.string().min(1, "กรุณาเลือกความรู้/ทักษะ/สมรรถนะที่ต้องการพัฒนา"),
  devTopic: z.string().min(1, "กรุณาเลือกหัวข้อที่ต้องการพัฒนา"),
  courseTitle: z.string().min(1, "กรุณากรอกหัวข้อหลักสูตรที่ต้องการ"),
  dev70: z.string().min(1, "กรุณาเลือกการเรียนรู้จากประสบการณ์ (70%)"),
  dev20: z.string().min(1, "กรุณาเลือกการเรียนรู้จากผู้อื่น (20%)"),
  dev10: z.string().min(1, "กรุณาเลือกการเรียนรู้จากการฝึกอบรม (10%)"),
  supervisorName: z.string().min(1, "กรุณากรอกชื่อ-สกุลผู้บังคับบัญชา"),
  supervisorPosition: z.string().min(1, "กรุณากรอกตำแหน่งผู้บังคับบัญชา"),
});

const getFormSchema = (employeeType?: string | null) => z.object({
  devCategory: z.string().min(1, (employeeType === "พนักงานราชการทั่วไป" || employeeType === "ลูกจ้างประจำ") ? "กรุณาเลือกสมรรถนะที่ต้องการพัฒนา" : "กรุณาเลือกความรู้/ทักษะ/สมรรถนะที่ต้องการพัฒนา"),
  devTopic: z.string().min(1, "กรุณาเลือกหัวข้อที่ต้องการพัฒนา"),
  courseTitle: z.string().min(1, "กรุณากรอกหัวข้อหลักสูตรที่ต้องการ"),
  dev70: z.string().min(1, "กรุณาเลือกการเรียนรู้จากประสบการณ์ (70%)"),
  dev20: z.string().min(1, "กรุณาเลือกการเรียนรู้จากผู้อื่น (20%)"),
  dev10: z.string().min(1, "กรุณาเลือกการเรียนรู้จากการฝึกอบรม (10%)"),
  supervisorName: z.string().min(1, "กรุณากรอกชื่อ-สกุลผู้บังคับบัญชา"),
  supervisorPosition: z.string().min(1, "กรุณากรอกตำแหน่งผู้บังคับบัญชา"),
});

const categoryOptions = {
  "ความรู้ความสามารถที่จำเป็นสำหรับการปฏิบัติงาน": [
    "ความรู้ความสามารถที่ใช้ในการปฏิบัติงาน",
    "ความรู้เรื่องกฏหมายและกฏระเบียบทางราชการ"
  ],
  "ทักษะ": [
    "การใช้คอมพิวเตอร์",
    "การใช้ภาษา",
    "การคำนวณ",
    "การจัดการข้อมูล"
  ],
  "สมรรถนะที่จำเป็น": [
    "การทำงานที่เป็นเลิศ",
    "การยึดมั่นในความถูกต้องและมีจิตบริการ",
    "การประสานความร่วมมือร่วมใจ",
    "ความยืดหยุ่น คล่องตัว ริเริ่มสร้างสรรค์"
  ],
  "สมรรถนะทางการบริหาร": [
    "การสื่อสารและการสร้างความผูกพันธ์",
    "การเรียนรู้และพัฒนา",
    "การปฏิรูป/ปรับเปลี่ยนราชการสู่อนาคต",
    "การรักษาวินัย คุณธรรม และจริยธรรม"
  ],
  "สมรรถนะเฉพาะตามลักษณะงานที่ปฏิบัติ": [
    "การคิดวิเคราะห์",
    "การมองภาพองค์รวม",
    "การแสดงความรับผิดชอบตามหน้าที่",
    "การสืบเสาะหาข้อมูล",
    "การตรวจสอบความถูกต้องตามกระบวนงาน",
    "ความเข้าใจองค์กรและระบบราชการ",
    "การดำเนินการเชิงรุก",
    "ความมั่นใจในตนเอง",
    "สุนทรียภาพทางศิลปะ",
    "ความคิดสร้างสรรค์",
    "การใส่ใจและพัฒนาผู้อื่น"
  ],
  "สมรรถนะพนักงานราชการทั่วไป": [
    "การทำงานที่เป็นเลิศ",
    "การยึดมั่นในความถูกต้องและมีจิตบริการ",
    "การประสานความร่วมมือร่วมใจ",
    "ความยืดหยุ่น คล่องตัว ริเริ่มสร้างสรรค์"
  ],
  "สมรรถนะลูกจ้างประจำ": [
    "ความสามารถ และความอุตสาหะในการปฏิบัติงาน",
    "การรักษาวินัย และปฏิบัติตนเหมาะสมกับการเป็นลูกจ้างประจำ",
    "ความรับผิดชอบ",
    "ความร่วมมือ",
    "สภาพการมาปฏิบัติงาน",
    "การวางแผน",
    "ความคิดริเริ่ม"
  ]
};

type FormValues = z.infer<typeof formSchema>;

export function CreateIDPForm({ initialData, planId }: { initialData?: any, planId?: string } = {}) {
  const router = useRouter();
  const { user } = useUser();
  const [step, setStep] = useState(1);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableCategories = Object.keys(categoryOptions).filter((cat) => {
    if (user?.employeeType === "ข้าราชการพลเรือนสามัญ") {
      return cat !== "สมรรถนะพนักงานราชการทั่วไป" && cat !== "สมรรถนะลูกจ้างประจำ";
    }
    if (user?.employeeType === "พนักงานราชการทั่วไป") {
      return cat === "สมรรถนะพนักงานราชการทั่วไป";
    }
    if (user?.employeeType === "ลูกจ้างประจำ") {
      return cat === "สมรรถนะลูกจ้างประจำ";
    }
    return true; // Default
  });



  const {
    control,
    handleSubmit,
    trigger,
    clearErrors,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(getFormSchema(user?.employeeType)) as any,
    defaultValues: {
      devCategory: initialData?.devCategory || "",
      devTopic: initialData?.devTopic || "",
      courseTitle: initialData?.courseTitle || "",
      dev70: initialData?.dev70 || "",
      dev20: initialData?.dev20 || "",
      dev10: initialData?.dev10 || "",
      supervisorName: initialData?.supervisorName || "",
      supervisorPosition: initialData?.supervisorPosition || "",
    },
  });
  const watchCategory = useWatch({
    control,
    name: "devCategory",
  });

  const watchTopic = useWatch({
    control,
    name: "devTopic",
  });


  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    try {
      let result;
      if (planId) {
        result = await updateIDPPlan(planId, data);
      } else {
        result = await createIDPPlan(data);
      }

      if (result.error) {
        alert("Error: " + result.error);
        setIsSubmitting(false);
      } else {
        router.push("/idp"); // redirect to idp list
      }
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  }

  const handleNextToStep2 = async () => {
    const isValid = await trigger([
      "devCategory",
      "devTopic",
      "courseTitle"
    ]);

    // ป้องกันไม่ให้ zodResolver แสดง error ของหน้าถัดไปล่วงหน้า
    clearErrors(["dev70", "dev20", "dev10"]);

    if (isValid) {
      setStep(2);
    }
  };

  const handleNextToStep3 = async () => {
    const isValid = await trigger([
      "dev70",
      "dev20",
      "dev10"
    ]);

    clearErrors(["supervisorName"]);

    if (isValid) {
      setStep(3);
    }
  };

  const onError = (errors: any) => {
    if (errors.devCategory || errors.devTopic || errors.courseTitle) {
      setStep(1);
    } else if (errors.dev70 || errors.dev20 || errors.dev10) {
      setStep(2);
    } else {
      setStep(3);
    }
  };

  return (
    <form onSubmit={(e) => { setHasSubmitted(true); handleSubmit(onSubmit, onError)(e); }} className="space-y-8">
      {/* หัวข้อใหญ่หลัก */}
      {step === 1 && (
        <div className="space-y-6 bg-slate-50/50 dark:bg-purple-900/10 p-6 sm:p-8 rounded-2xl border border-slate-100 dark:border-purple-800/30 shadow-sm">
          <div className="flex flex-col space-y-8">
            {/* หมวดหมู่หลัก */}
            <div className="bg-white dark:bg-[#1a0b2e] p-5 sm:p-7 rounded-2xl border border-slate-100 dark:border-purple-800/50 shadow-sm hover:shadow-md transition-all space-y-4">
              {/* รายละเอียดหมวดหมู่สมรรถนะ */}
              {user?.employeeType === "ข้าราชการพลเรือนสามัญ" && (
                <details className="mb-6 group bg-purple-50/50 dark:bg-purple-900/20 rounded-2xl border border-purple-100 dark:border-purple-800/50 animate-in fade-in slide-in-from-top-4 duration-500">
                  <summary className="flex items-center justify-between p-5 sm:p-6 cursor-pointer list-none select-none [&::-webkit-details-marker]:hidden">
                    <div className="flex items-center gap-2.5">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-800/80">
                        <Info className="w-4 h-4 text-purple-600 dark:text-purple-300" />
                      </div>
                      <h3 className="font-bold text-[#2e1065] dark:text-purple-200">
                        ดูรายละเอียดหมวดหมู่สมรรถนะ
                      </h3>
                    </div>
                    <ChevronDown className="w-5 h-5 text-purple-600 dark:text-purple-400 group-open:rotate-180 transition-transform duration-300" />
                  </summary>
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border-t border-purple-100 dark:border-purple-800/50 pt-5">
                    {availableCategories.map(cat => (
                      <div key={cat} className="bg-white dark:bg-[#150a29] p-4 rounded-xl border border-slate-100 dark:border-purple-800/50 shadow-sm hover:shadow-md transition-all group">
                        <h4 className="font-bold text-purple-700 dark:text-purple-300 text-sm mb-3 pb-2 border-b border-purple-50 dark:border-purple-800/30 group-hover:border-purple-200 dark:group-hover:border-purple-700 transition-colors">
                          {cat}
                        </h4>
                        <ul className="space-y-2">
                          {categoryOptions[cat as keyof typeof categoryOptions].map((item, idx) => (
                            <li key={idx} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2 leading-relaxed">
                              <div className="w-1.5 h-1.5 rounded-full bg-purple-200 dark:bg-purple-800 mt-1.5 shrink-0 group-hover:bg-purple-400 dark:group-hover:bg-purple-500 transition-colors" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    </div>
                  </div>
                </details>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2">
                <Label
                  className="text-[#2e1065] dark:text-purple-200 font-bold text-lg"
                  htmlFor="devCategory"
                >
                  {(user?.employeeType === "พนักงานราชการทั่วไป" || user?.employeeType === "ลูกจ้างประจำ") ? "สมรรถนะที่ต้องการพัฒนา" : "ความรู้/ทักษะ/สมรรถนะที่ต้องการพัฒนา"}
                </Label>
                {errors.devCategory && (
                  <span className="text-sm text-destructive font-bold bg-destructive/10 px-3 py-1 rounded-md animate-in fade-in zoom-in duration-300">
                    {errors.devCategory.message}
                  </span>
                )}
              </div>
              <Controller
                control={control}
                name="devCategory"
                render={({ field }) => (
                  <Select 
                    onValueChange={(val) => {
                      field.onChange(val);
                      setValue("devTopic", "");
                    }} 
                    value={field.value}
                  >
                    <SelectTrigger
                      className={`w-full h-12 px-4 mt-3 bg-white dark:bg-[#150a29] rounded-xl border shadow-sm transition-all ${errors.devCategory ? "border-destructive ring-1 ring-destructive/50" : "border-slate-100 dark:border-purple-800/50"}`}
                    >
                      <SelectValue placeholder="-- เลือกระดับความต้องการพัฒนา --" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* หัวข้อย่อย */}
            {watchCategory && (
              <div className="bg-white dark:bg-[#1a0b2e] p-5 sm:p-7 rounded-2xl border border-slate-100 dark:border-purple-800/50 shadow-sm hover:shadow-md transition-all space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Label
                    className="text-[#2e1065] dark:text-purple-200 font-bold text-lg"
                    htmlFor="devTopic"
                  >
                    {watchCategory}
                  </Label>
                  {errors.devTopic && (
                    <span className="text-sm text-destructive font-bold bg-destructive/10 px-3 py-1 rounded-md animate-in fade-in zoom-in duration-300">
                      {errors.devTopic.message}
                    </span>
                  )}
                </div>
                <Controller
                  control={control}
                  name="devTopic"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        className={`w-full h-12 px-4 mt-3 bg-white dark:bg-[#150a29] rounded-xl border shadow-sm transition-all ${errors.devTopic ? "border-destructive ring-1 ring-destructive/50" : "border-slate-100 dark:border-purple-800/50"}`}
                      >
                        <SelectValue placeholder={`-- เลือก${watchCategory} --`} />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions[watchCategory as keyof typeof categoryOptions]?.map((topic) => (
                          <SelectItem key={topic} value={topic}>
                            {topic}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            )}

            {/* หัวข้อหลักสูตรที่ต้องการ */}
            {watchTopic && (
              <div className="bg-white dark:bg-[#1a0b2e] p-5 sm:p-7 rounded-2xl border border-slate-100 dark:border-purple-800/50 shadow-sm hover:shadow-md transition-all space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Label
                    className="text-[#2e1065] dark:text-purple-200 font-bold text-lg"
                    htmlFor="courseTitle"
                  >
                    หัวข้อหลักสูตรที่ต้องการ
                  </Label>
                  {errors.courseTitle && (
                    <span className="text-sm text-destructive font-bold bg-destructive/10 px-3 py-1 rounded-md animate-in fade-in zoom-in duration-300">
                      {errors.courseTitle.message}
                    </span>
                  )}
                </div>
                <Controller
                  control={control}
                  name="courseTitle"
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="กรอกหลักสูตร"
                      className={`w-full h-12 px-4 mt-3 bg-white dark:bg-[#150a29] rounded-xl border shadow-sm transition-all md:text-base text-base ${errors.courseTitle ? "border-destructive ring-1 ring-destructive/50" : "border-slate-100 dark:border-purple-800/50"}`}
                    />
                  )}
                />
              </div>
            )}
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
                  70% การเรียนรู้จากประสบการณ์
                </Label>
                {hasSubmitted && errors.dev70 && (
                  <span className="text-sm text-destructive font-bold bg-destructive/10 px-3 py-1 rounded-md animate-in fade-in zoom-in duration-300">
                    {errors.dev70.message}
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                การเรียนรู้จากการลงมือปฏิบัติจริง การได้รับมอบหมายงาน การติดตามสังเกตงาน หรือศึกษาด้วยตนเอง
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
                        value="ลงมือปฏิบัติ"
                        id="dev70-1"
                        className="h-5 w-5 mt-0.5"
                      />
                      <Label
                        htmlFor="dev70-1"
                        className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300"
                      >
                        ลงมือปฏิบัติ
                      </Label>
                    </div>
                    <div className="flex items-start space-x-3">
                      <RadioGroupItem
                        value="ได้รับมอบหมายงาน"
                        id="dev70-2"
                        className="h-5 w-5 mt-0.5"
                      />
                      <Label
                        htmlFor="dev70-2"
                        className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300"
                      >
                        ได้รับมอบหมายงาน
                      </Label>
                    </div>
                    <div className="flex items-start space-x-3">
                      <RadioGroupItem
                        value="เรียนรู้ด้วยตนเอง"
                        id="dev70-3"
                        className="h-5 w-5 mt-0.5"
                      />
                      <Label
                        htmlFor="dev70-3"
                        className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300 leading-relaxed"
                      >
                        เรียนรู้ด้วยตนเอง
                      </Label>
                    </div>
                    <div className="flex items-start space-x-3">
                      <RadioGroupItem
                        value="ติดตามสังเกตงาน"
                        id="dev70-4"
                        className="h-5 w-5 mt-0.5"
                      />
                      <Label
                        htmlFor="dev70-4"
                        className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300"
                      >
                        ติดตามสังเกตงาน
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
                  20% การเรียนรู้จากผู้อื่น
                </Label>
                {hasSubmitted && errors.dev20 && (
                  <span className="text-sm text-destructive font-bold bg-destructive/10 px-3 py-1 rounded-md animate-in fade-in zoom-in duration-300">
                    {errors.dev20.message}
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                การเรียนรู้ผ่านการพูดคุย การรับคำปรึกษา แนะนำ หรือการสอนงานจากหัวหน้าและเพื่อนร่วมงาน
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
                        value="ปรึกษาแนะนำ"
                        id="dev20-1"
                        className="h-5 w-5 mt-0.5"
                      />
                      <Label
                        htmlFor="dev20-1"
                        className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300"
                      >
                        ปรึกษาแนะนำ
                      </Label>
                    </div>
                    <div className="flex items-start space-x-3">
                      <RadioGroupItem
                        value="สอนงาน"
                        id="dev20-2"
                        className="h-5 w-5 mt-0.5"
                      />
                      <Label
                        htmlFor="dev20-2"
                        className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300"
                      >
                        สอนงาน
                      </Label>
                    </div>
                    <div className="flex items-start space-x-3">
                      <RadioGroupItem
                        value="รับข้อมูลป้อนกลับ"
                        id="dev20-3"
                        className="h-5 w-5 mt-0.5"
                      />
                      <Label
                        htmlFor="dev20-3"
                        className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300"
                      >
                        รับข้อมูลป้อนกลับ
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
                  10% การเรียนรู้จากการฝึกอบรม
                </Label>
                {hasSubmitted && errors.dev10 && (
                  <span className="text-sm text-destructive font-bold bg-destructive/10 px-3 py-1 rounded-md animate-in fade-in zoom-in duration-300">
                    {errors.dev10.message}
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                การเรียนรู้ผ่านการฝึกอบรม สัมมนา ทั้งในรูปแบบทางการและไม่เป็นทางการ
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
                        value="ฝึกอบรม/เรียนรู้ผ่านสื่อ"
                        id="dev10-1"
                        className="h-5 w-5 mt-0.5"
                      />
                      <Label
                        htmlFor="dev10-1"
                        className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300 leading-relaxed"
                      >
                        ฝึกอบรม/เรียนรู้ผ่านสื่อ
                      </Label>
                    </div>
                    <div className="flex items-start space-x-3">
                      <RadioGroupItem
                        value="ประชุม/สัมมนา"
                        id="dev10-2"
                        className="h-5 w-5 mt-0.5"
                      />
                      <Label
                        htmlFor="dev10-2"
                        className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300"
                      >
                        ประชุม/สัมมนา
                      </Label>
                    </div>
                    <div className="flex items-start space-x-3">
                      <RadioGroupItem
                        value="อบรม/ประชุมแบบไม่เป็นทางการ"
                        id="dev10-3"
                        className="h-5 w-5 mt-0.5"
                      />
                      <Label
                        htmlFor="dev10-3"
                        className="text-base font-normal cursor-pointer text-slate-700 dark:text-slate-300"
                      >
                        อบรม/ประชุมแบบไม่เป็นทางการ
                      </Label>
                    </div>
                  </RadioGroup>
                )}
              />
            </div>
          </div>
        </div>
      )}

      
      {/* หัวข้อใหญ่ที่ 3 */}
      {step === 3 && (
        <div className="space-y-6 bg-slate-50/50 dark:bg-purple-900/10 p-6 sm:p-8 rounded-2xl border border-slate-100 dark:border-purple-800/30 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="border-b-2 border-purple-100 dark:border-purple-800/50 pb-3">
            <h2 className="text-xl font-bold text-[#2e1065] dark:text-purple-100 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-200 text-sm shrink-0">
                3
              </span>
              ข้อมูลผู้กำกับดูแลแผน IDP
            </h2>
          </div>

          <div className="flex flex-col space-y-8 mt-6">
            <div className="bg-white dark:bg-[#1a0b2e] p-5 sm:p-7 rounded-2xl border border-slate-100 dark:border-purple-800/50 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Label
                  className="text-[#2e1065] dark:text-purple-200 font-bold text-lg"
                  htmlFor="supervisorName"
                >
                  ชื่อ-สกุลผู้บังคับบัญชาเหนือขึ้นไป 1 ระดับ
                </Label>
                {hasSubmitted && errors.supervisorName && (
                  <span className="text-sm text-destructive font-bold bg-destructive/10 px-3 py-1 rounded-md animate-in fade-in zoom-in duration-300">
                    {errors.supervisorName.message}
                  </span>
                )}
              </div>
              <Controller
                control={control}
                name="supervisorName"
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="กรุณากรอกชื่อ-สกุลผู้บังคับบัญชาเหนือขึ้นไป 1 ระดับ"
                    className={`w-full h-12 px-4 mt-3 bg-white dark:bg-[#150a29] rounded-xl border shadow-sm transition-all md:text-base text-base ${hasSubmitted && errors.supervisorName ? "border-destructive ring-1 ring-destructive/50" : "border-slate-100 dark:border-purple-800/50"}`}
                  />
                )}
              />
            </div>

            <div className="bg-white dark:bg-[#1a0b2e] p-5 sm:p-7 rounded-2xl border border-slate-100 dark:border-purple-800/50 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Label
                  className="text-[#2e1065] dark:text-purple-200 font-bold text-lg"
                  htmlFor="supervisorPosition"
                >
                  ตำแหน่งผู้บังคับบัญชาเหนือขึ้นไป 1 ระดับ
                </Label>
                {hasSubmitted && errors.supervisorPosition && (
                  <span className="text-sm text-destructive font-bold bg-destructive/10 px-3 py-1 rounded-md animate-in fade-in zoom-in duration-300">
                    {errors.supervisorPosition.message}
                  </span>
                )}
              </div>
              <Controller
                control={control}
                name="supervisorPosition"
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="กรุณากรอกตำแหน่งผู้บังคับบัญชาเหนือขึ้นไป 1 ระดับ"
                    className={`w-full h-12 px-4 mt-3 bg-white dark:bg-[#150a29] rounded-xl border shadow-sm transition-all md:text-base text-base ${hasSubmitted && errors.supervisorPosition ? "border-destructive ring-1 ring-destructive/50" : "border-slate-100 dark:border-purple-800/50"}`}
                  />
                )}
              />
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="pt-8 mt-8 flex justify-end items-center gap-4">
        {step === 1 && (
          <>
            <Button
              type="button"
              variant="outline"
              onClick={(e) => { e.preventDefault(); router.push("/"); }}
              className="h-12 px-8 rounded-xl font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-purple-900/30 border-slate-200 dark:border-purple-800/50 transition-all"
            >
              ยกเลิก
            </Button>
            <Button
              type="button"
              onClick={(e) => { e.preventDefault(); handleNextToStep2(); }}
              className="h-12 px-8 rounded-xl font-bold text-white shadow-[0_4px_14px_0_rgba(91,33,182,0.39)] transition-all hover:shadow-[0_6px_20px_rgba(91,33,182,0.23)] hover:-translate-y-0.5 bg-gradient-to-r from-[#4c1d95] to-[#2e1065] hover:from-[#5b21b6] hover:to-[#4c1d95] dark:from-[#5b21b6] dark:to-[#3b0764] dark:hover:from-[#6d28d9] dark:hover:to-[#4c1d95] border-none"
            >
              ถัดไป
            </Button>
          </>
        )}
        {step === 2 && (
          <>
            <Button
              type="button"
              variant="outline"
              onClick={(e) => { e.preventDefault(); setStep(1); }}
              className="h-12 px-8 rounded-xl font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-purple-900/30 border-slate-200 dark:border-purple-800/50 transition-all"
            >
              ย้อนกลับ
            </Button>
            <Button
              type="button"
              onClick={(e) => { e.preventDefault(); handleNextToStep3(); }}
              className="h-12 px-8 rounded-xl font-bold text-white shadow-[0_4px_14px_0_rgba(91,33,182,0.39)] transition-all hover:shadow-[0_6px_20px_rgba(91,33,182,0.23)] hover:-translate-y-0.5 bg-gradient-to-r from-[#4c1d95] to-[#2e1065] hover:from-[#5b21b6] hover:to-[#4c1d95] dark:from-[#5b21b6] dark:to-[#3b0764] dark:hover:from-[#6d28d9] dark:hover:to-[#4c1d95] border-none"
            >
              ถัดไป
            </Button>
          </>
        )}
        {step === 3 && (
          <>
            <Button
              type="button"
              variant="outline"
              onClick={(e) => { e.preventDefault(); setStep(2); }}
              className="h-12 px-8 rounded-xl font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-purple-900/30 border-slate-200 dark:border-purple-800/50 transition-all"
            >
              ย้อนกลับ
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 px-8 rounded-xl font-bold text-white shadow-[0_4px_14px_0_rgba(91,33,182,0.39)] transition-all hover:shadow-[0_6px_20px_rgba(91,33,182,0.23)] hover:-translate-y-0.5 bg-gradient-to-r from-[#4c1d95] to-[#2e1065] hover:from-[#5b21b6] hover:to-[#4c1d95] dark:from-[#5b21b6] dark:to-[#3b0764] dark:hover:from-[#6d28d9] dark:hover:to-[#4c1d95] border-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  กำลังบันทึก...
                </>
              ) : (
                planId ? "บันทึกการแก้ไข" : "สร้างแผนพัฒนา"
              )}
            </Button>
          </>
        )}
      </div>
    </form>
  );
}
