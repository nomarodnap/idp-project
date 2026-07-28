"use client";

import { useState } from "react";
import { updateSystemPhase } from "@/actions/settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface SettingsFormProps {
  currentPhase: number;
}

export default function SettingsForm({ currentPhase }: SettingsFormProps) {
  const [phase, setPhase] = useState<number>(currentPhase);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await updateSystemPhase(phase);
      if (res.error) {
        alert(res.error);
      } else {
        alert("บันทึกการตั้งค่าระบบเรียบร้อยแล้ว");
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาดในการบันทึก");
    } finally {
      setIsSaving(false);
    }
  };

  const phases = [
    {
      id: 1,
      title: "Phase 1: เปิดแบบสมบูรณ์",
      description: "ผู้ใช้สามารถ สร้าง, แก้ไข, และ ลบ แผนพัฒนาของตนเองได้",
      color: "bg-emerald-50 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800",
      activeColor: "ring-2 ring-emerald-500 border-emerald-500 dark:border-emerald-500 bg-emerald-100 dark:bg-emerald-900/50 shadow-md",
      textColor: "text-emerald-700 dark:text-emerald-300"
    },
    {
      id: 2,
      title: "Phase 2: เปิดให้แก้ไขเท่านั้น",
      description: "ผู้ใช้สามารถเข้าถึงแผนเพื่อแก้ไขได้อย่างเดียว (ห้ามลบ, ห้ามสร้างใหม่)",
      color: "bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800",
      activeColor: "ring-2 ring-blue-500 border-blue-500 dark:border-blue-500 bg-blue-100 dark:bg-blue-900/50 shadow-md",
      textColor: "text-blue-700 dark:text-blue-300"
    },
    {
      id: 3,
      title: "Phase 3: ปิดระบบจัดการ",
      description: "ผู้ใช้จะไม่สามารถ สร้าง, แก้ไข, หรือ ลบ แผนได้เลย (ทำได้แค่ดูรายละเอียด)",
      color: "bg-amber-50 border-amber-200 dark:bg-amber-900/30 dark:border-amber-800",
      activeColor: "ring-2 ring-amber-500 border-amber-500 dark:border-amber-500 bg-amber-100 dark:bg-amber-900/50 shadow-md",
      textColor: "text-amber-700 dark:text-amber-300"
    },
    {
      id: 4,
      title: "Phase 4: เปิดประเมินผล",
      description: "ผู้ใช้จะไม่สามารถจัดการแผนได้ แต่จะสามารถกดปุ่ม \"ประเมินผล (ด้วยตัวเอง)\" ได้",
      color: "bg-purple-50 border-purple-200 dark:bg-purple-900/30 dark:border-purple-800",
      activeColor: "ring-2 ring-purple-500 border-purple-500 dark:border-purple-500 bg-purple-100 dark:bg-purple-900/50 shadow-md",
      textColor: "text-purple-700 dark:text-purple-300"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#1a0b2e] rounded-[2rem] shadow-xl p-8 relative overflow-hidden border border-slate-100 dark:border-purple-900/50">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 via-purple-600 to-amber-400" />
        
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#2e1065] dark:text-purple-50 mb-2">เลือกช่วงเวลาของระบบ (Time Phase)</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            การเปลี่ยน Phase จะมีผลกระทบกับสิทธิ์ในการจัดการแผน IDP ของผู้ใช้งานทุกคนในระบบทันที
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {phases.map((p) => {
            const isActive = phase === p.id;
            return (
              <div 
                key={p.id}
                onClick={() => setPhase(p.id)}
                className={`cursor-pointer rounded-2xl p-6 border transition-all duration-200 hover:-translate-y-1 ${isActive ? p.activeColor : p.color}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className={`font-bold text-lg mb-2 ${p.textColor}`}>{p.title}</h3>
                    <p className="text-sm opacity-80 font-medium text-slate-700 dark:text-slate-300">{p.description}</p>
                  </div>
                  {isActive && <CheckCircle2 className={`w-6 h-6 shrink-0 ${p.textColor}`} />}
                </div>
              </div>
            );
          })}
        </div>

        {phase !== currentPhase && (
          <div className="mt-6 flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 rounded-xl border border-amber-200 dark:border-amber-800">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-sm font-medium">
              คุณกำลังจะเปลี่ยน Phase ของระบบจาก Phase {currentPhase} เป็น Phase {phase} โปรดยืนยันการเปลี่ยนแปลง
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <Button 
            onClick={handleSave} 
            disabled={isSaving || phase === currentPhase}
            className="h-12 px-8 rounded-xl font-bold text-white shadow-sm transition-all bg-gradient-to-r from-purple-600 to-[#2e1065] hover:from-purple-700 hover:to-[#1a0b2e] border-none text-base"
          >
            {isSaving && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
            บันทึกการตั้งค่า
          </Button>
        </div>
      </div>
    </div>
  );
}
