"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

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

const formSchema = z.object({
  devCategory: z.string().min(1, "กรุณาเลือกความรู้ / ทักษะ / สมรรถนะที่ต้องการพัฒนา"),
  devTopic: z.string().min(1, "กรุณาเลือกหัวข้อที่ต้องการพัฒนา"),
  courseTitle: z.string().min(1, "กรุณากรอกหัวข้อหลักสูตรที่ต้องการ"),
  dev70: z.string().min(1, "กรุณาเลือกการเรียนรู้จากประสบการณ์ (70%)"),
  dev20: z.string().min(1, "กรุณาเลือกการเรียนรู้จากผู้อื่น (20%)"),
  dev10: z.string().min(1, "กรุณาเลือกการเรียนรู้จากการฝึกอบรม (10%)"),
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
    "การปฏิรูป / ปรับเปลี่ยนราชการสู่อนาคต",
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
  "สมรรถนะหลัก": [
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

export function CreateIDPForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const {
    control,
    handleSubmit,
    trigger,
    clearErrors,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      devCategory: "",
      devTopic: "",
      courseTitle: "",
      dev70: "",
      dev20: "",
      dev10: "",
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


  function onSubmit(data: FormValues) {
    console.log("Submitted Data:", data);
    // TODO: Proceed to next step based on user requirements
  }

  const handleNextStep = async () => {
    const isValid = await trigger([
      "devCategory",
      "devTopic",
      "courseTitle"
    ]);

    // ป้องกันไม่ให้ zodResolver แสดง error ของหน้า 2 ล่วงหน้า
    clearErrors(["dev70", "dev20", "dev10"]);

    if (isValid) {
      setStep(2);
    }
  };

  const onError = (errors: any) => {
    // If there are errors in step 1, go back to step 1 to show them
    if (errors.devCategory || errors.devTopic || errors.courseTitle) {
      setStep(1);
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
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Label
                  className="text-[#2e1065] dark:text-purple-200 font-bold text-lg"
                  htmlFor="devCategory"
                >
                  ความรู้ / ทักษะ / สมรรถนะที่ต้องการพัฒนา
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
                      {Object.keys(categoryOptions).map((cat) => (
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
                      placeholder="เช่น คอร์สพัฒนาบุคลิกภาพ, การเขียน React ขั้นสูง"
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
                  70% การเรียนรู้จากประสบการณ์ (Experiential Learning)
                </Label>
                {hasSubmitted && errors.dev70 && (
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
                {hasSubmitted && errors.dev20 && (
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
                {hasSubmitted && errors.dev10 && (
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
              onClick={(e) => { e.preventDefault(); router.push("/"); }}
              className="h-12 px-8 rounded-xl font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-purple-900/30 border-slate-200 dark:border-purple-800/50 transition-all"
            >
              ยกเลิก
            </Button>
            <Button
              type="button"
              onClick={(e) => { e.preventDefault(); handleNextStep(); }}
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
              onClick={(e) => { e.preventDefault(); setStep(1); }}
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
