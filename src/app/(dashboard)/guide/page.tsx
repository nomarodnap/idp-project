import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, PlayCircle } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "คู่มือการใช้งาน | ระบบ IDP กรมประมง",
  description: "วีดีโอสาธิตการใช้งานระบบ Individual Development Plan (IDP) กรมประมง",
};

export default function GuidePage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-black text-[#2e1065] dark:text-white tracking-tight flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-amber-500" />
          คู่มือการใช้งานระบบ
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          วีดีโอสาธิตการใช้งานระบบ IDP กรมประมง
        </p>
      </div>

      <Card className="border-none shadow-md overflow-hidden bg-white/80 dark:bg-[#1a0b2e]/80 backdrop-blur-sm">
        <CardHeader className="border-b border-slate-100 dark:border-purple-900/30 bg-slate-50/50 dark:bg-[#150a29]/50">
          <div className="flex items-center gap-3">
            <PlayCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <div>
              <CardTitle className="text-xl text-[#2e1065] dark:text-purple-100">
                วีดีโอแนะนำการใช้งาน
              </CardTitle>
              <CardDescription className="mt-1">
                กรุณาเปิดเสียงเพื่อรับฟังคำอธิบายประกอบการใช้งาน
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="aspect-video w-full rounded-xl overflow-hidden bg-black/5 dark:bg-black/40 ring-1 ring-slate-200 dark:ring-purple-900/50 shadow-inner flex items-center justify-center relative">
            <video 
              controls 
              className="w-full h-full object-contain bg-black"
              poster="/logo-fisheries.png"
            >
              <source src="/idp_guide.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
