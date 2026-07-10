import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, CheckCircle2, Clock } from "lucide-react";

export default function AdminDashboardPage() {
  const statCards = [
    { title: "พนักงานทั้งหมด", value: "150", icon: Users, color: "text-blue-600", subtitle: "ลงทะเบียนในระบบ" },
    { title: "ส่งแผนแล้ว", value: "120", icon: FileText, color: "text-purple-600", subtitle: "คิดเป็น 80%" },
    { title: "รออนุมัติ", value: "45", icon: Clock, color: "text-amber-500", subtitle: "ต้องการตรวจสอบ" },
    { title: "อนุมัติแล้ว", value: "75", icon: CheckCircle2, color: "text-emerald-600", subtitle: "เริ่มดำเนินการได้" },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#2e1065] dark:text-purple-50 tracking-tight">Admin Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">ภาพรวมการจัดทำแผนพัฒนาบุคลากร (IDP) ประจำปี 2569</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="shadow-md hover:shadow-xl transition-all duration-300 border-slate-100 dark:border-purple-900/50 rounded-2xl bg-white dark:bg-[#1a0b2e] group hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-amber-600 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-xl bg-slate-50 dark:bg-purple-900/20 ${stat.color} dark:text-amber-400`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-[#2e1065] dark:text-purple-50 tracking-tight">{stat.value}</div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">
                {stat.subtitle}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-lg border-slate-100 dark:border-purple-900/50 rounded-3xl overflow-hidden bg-white dark:bg-[#1a0b2e]">
           <CardHeader className="bg-slate-50 dark:bg-[#150926]/50 border-b border-slate-100 dark:border-purple-900/50 px-8 py-6">
             <CardTitle className="text-xl font-bold text-[#2e1065] dark:text-purple-50 tracking-tight">หมวดหมู่ที่พนักงานเลือกพัฒนา</CardTitle>
           </CardHeader>
           <CardContent className="p-8 space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-bold text-slate-700 dark:text-slate-300">สมรรถนะที่จำเป็น (Functional)</span>
                  <span className="font-bold text-purple-600 dark:text-purple-400">45%</span>
                </div>
                <div className="h-3 w-full bg-slate-100 dark:bg-purple-900/30 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-600 to-purple-400 w-[45%] rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-bold text-slate-700 dark:text-slate-300">สมรรถนะหลัก (Core)</span>
                  <span className="font-bold text-amber-500 dark:text-amber-400">30%</span>
                </div>
                <div className="h-3 w-full bg-slate-100 dark:bg-purple-900/30 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-amber-300 w-[30%] rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-bold text-slate-700 dark:text-slate-300">สมรรถนะทางการบริหาร (Managerial)</span>
                  <span className="font-bold text-blue-500 dark:text-blue-400">25%</span>
                </div>
                <div className="h-3 w-full bg-slate-100 dark:bg-purple-900/30 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 w-[25%] rounded-full"></div>
                </div>
              </div>
           </CardContent>
        </Card>

        <Card className="shadow-lg border-slate-100 dark:border-purple-900/50 rounded-3xl overflow-hidden bg-white dark:bg-[#1a0b2e]">
           <CardHeader className="bg-slate-50 dark:bg-[#150926]/50 border-b border-slate-100 dark:border-purple-900/50 px-8 py-6">
             <CardTitle className="text-xl font-bold text-[#2e1065] dark:text-purple-50 tracking-tight">สัดส่วนวิธีการพัฒนา (70:20:10)</CardTitle>
           </CardHeader>
           <CardContent className="p-8 space-y-6 flex flex-col justify-center">
              <div className="grid grid-cols-3 gap-4 h-full items-center">
                <div className="text-center p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30">
                  <div className="text-3xl font-black text-blue-600 dark:text-blue-400">65%</div>
                  <div className="text-xs font-bold text-slate-500 mt-2">ลงมือปฏิบัติ (70)</div>
                </div>
                <div className="text-center p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30">
                  <div className="text-3xl font-black text-amber-600 dark:text-amber-400">20%</div>
                  <div className="text-xs font-bold text-slate-500 mt-2">เรียนรู้จากผู้อื่น (20)</div>
                </div>
                <div className="text-center p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30">
                  <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">15%</div>
                  <div className="text-xs font-bold text-slate-500 mt-2">ฝึกอบรม (10)</div>
                </div>
              </div>
              <p className="text-sm text-center text-slate-500 font-medium">
                *สัดส่วนเฉลี่ยจากแผนที่ส่งเข้ามาทั้งหมดในระบบ
              </p>
           </CardContent>
        </Card>
      </div>

    </div>
  );
}
