"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { User, Lock, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useState } from "react";
import { loginWithDPIS } from "@/actions/auth";

const loginSchema = z.object({
  citizenId: z.string().length(13, {
    message: "รหัสบัตรประชาชนต้องมี 13 หลัก",
  }).regex(/^[0-9]+$/, {
    message: "กรุณากรอกเฉพาะตัวเลข",
  }),
  password: z.string().min(4, {
    message: "กรุณากรอกรหัสผ่าน",
  }),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema) as any,
    defaultValues: {
      citizenId: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginValues) {
    setErrorMsg("");
    const formData = new FormData();
    formData.append("citizenId", data.citizenId);
    formData.append("password", data.password);

    try {
      const result = await loginWithDPIS(formData);
      if (result.error) {
        setErrorMsg(result.error);
      } else if (result.success) {
        router.push("/");
      }
    } catch (err) {
      setErrorMsg("เกิดข้อผิดพลาดในการเชื่อมต่อระบบ");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="citizenId" className="text-[#2e1065] dark:text-purple-100 font-bold tracking-wide">รหัสบัตรประชาชน 13 หลัก</Label>
        <div className="relative group/input">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within/input:text-purple-600 dark:group-focus-within/input:text-purple-400 transition-colors">
            <User className="w-5 h-5" />
          </div>
          <Input
            id="citizenId"
            type="text"
            placeholder="กรอกรหัสบัตรประชาชน 13 หลัก"
            maxLength={13}
            className={`pl-12 h-14 text-lg bg-slate-50 dark:bg-[#1a0b2e] border-slate-200 dark:border-purple-900/50 text-[#2e1065] dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus-visible:bg-white dark:focus-visible:bg-[#230f3f] focus-visible:ring-purple-500/30 focus-visible:border-purple-500 dark:focus-visible:border-purple-400 transition-all shadow-sm ${errors.citizenId ? 'border-red-400 dark:border-red-500/50 focus-visible:ring-red-400/30' : ''}`}
            {...register("citizenId")}
          />
        </div>
        {errors.citizenId && (
          <p className="text-sm font-medium text-red-500 mt-1">{errors.citizenId.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-[#2e1065] dark:text-purple-100 font-bold tracking-wide">รหัสผ่าน (Password)</Label>
        <div className="relative group/input">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within/input:text-purple-600 dark:group-focus-within/input:text-purple-400 transition-colors">
            <Lock className="w-5 h-5" />
          </div>
          <Input
            id="password"
            type="password"
            placeholder="รหัสผ่านระบบ DPIS"
            className={`pl-12 h-14 text-lg bg-slate-50 dark:bg-[#1a0b2e] border-slate-200 dark:border-purple-900/50 text-[#2e1065] dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus-visible:bg-white dark:focus-visible:bg-[#230f3f] focus-visible:ring-purple-500/30 focus-visible:border-purple-500 dark:focus-visible:border-purple-400 transition-all shadow-sm ${errors.password ? 'border-red-400 dark:border-red-500/50 focus-visible:ring-red-400/30' : ''}`}
            {...register("password")}
          />
        </div>
        {errors.password && (
          <p className="text-sm font-medium text-red-500 dark:text-red-400 mt-1">{errors.password.message}</p>
        )}
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 text-red-600 dark:text-red-400 text-sm font-medium text-center animate-in fade-in zoom-in duration-300">
          {errorMsg}
        </div>
      )}

      <Button 
        type="submit" 
        className="w-full h-14 text-lg font-bold shadow-[0_4px_14px_0_rgba(91,33,182,0.39)] transition-all hover:shadow-[0_6px_20px_rgba(91,33,182,0.23)] hover:-translate-y-1 bg-gradient-to-r from-[#4c1d95] to-[#2e1065] hover:from-[#5b21b6] hover:to-[#4c1d95] dark:from-[#5b21b6] dark:to-[#3b0764] dark:hover:from-[#6d28d9] dark:hover:to-[#4c1d95] text-white border-none group mt-4"
        disabled={isSubmitting}
      >
        <span className="flex items-center justify-center gap-2">
          {isSubmitting ? "กำลังตรวจสอบข้อมูล..." : "เข้าสู่ระบบ (Login)"}
          {!isSubmitting && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-amber-400" />}
        </span>
      </Button>
    </form>
  );
}
