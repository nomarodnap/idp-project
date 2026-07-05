import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Loader2, Clock, CheckCircle2, MoreHorizontal } from "lucide-react";

const statCards = [
  { title: "แผนทั้งหมด", value: "12", icon: FileText, color: "text-blue-600" },
  { title: "กำลังดำเนินการ", value: "3", icon: Loader2, color: "text-amber-500" },
  { title: "รอการอนุมัติ", value: "2", icon: Clock, color: "text-orange-500" },
  { title: "เสร็จสิ้น", value: "7", icon: CheckCircle2, color: "text-emerald-600" },
];

const recentPlans = [
  {
    id: 1,
    name: "หลักสูตรการเพาะเลี้ยงสัตว์น้ำสมัยใหม่",
    type: "การฝึกอบรม",
    date: "10 ต.ค. 2569",
    status: "อนุมัติแล้ว",
  },
  {
    id: 2,
    name: "การวิเคราะห์ข้อมูลทางสถิติสำหรับงานวิจัย",
    type: "การเรียนรู้ด้วยตนเอง",
    date: "15 พ.ย. 2569",
    status: "รออนุมัติ",
  },
  {
    id: 3,
    name: "การใช้เทคโนโลยีภูมิสารสนเทศ (GIS)",
    type: "การสัมมนา",
    date: "20 ธ.ค. 2569",
    status: "กำลังดำเนินการ",
  },
  {
    id: 4,
    name: "ความเป็นผู้นำและการบริหารทีมงาน",
    type: "การฝึกอบรม",
    date: "05 ก.ย. 2569",
    status: "เสร็จสิ้น",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 to-purple-400 dark:from-[#1e0a45] dark:to-[#3b1775] p-8 sm:p-10 text-white shadow-xl border border-purple-200 dark:border-purple-800/50">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400 dark:bg-amber-500 rounded-full blur-[100px] opacity-30 dark:opacity-20 pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 dark:bg-black/20 border border-white/40 dark:border-white/10 backdrop-blur-md mb-6 w-fit shadow-sm">
            <span className="text-amber-200 dark:text-amber-300 text-xs font-bold tracking-widest uppercase text-shadow-sm">Overview</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3 drop-shadow-sm">
            ยินดีต้อนรับสู่ระบบจัดทำแผนพัฒนา<span className="text-amber-300 dark:text-amber-400">รายบุคคล (IDP)</span>
          </h1>
          <p className="text-purple-50 dark:text-purple-200/90 text-lg max-w-none font-medium drop-shadow-sm">
            สรุปข้อมูลภาพรวมการพัฒนาสมรรถนะของคุณในรอบปีประเมิน พร้อมติดตามความคืบหน้าอย่างใกล้ชิด
          </p>
        </div>
      </div>

      {/* Progress Section */}
      <Card className="shadow-lg border-slate-100 dark:border-purple-900/50 rounded-3xl overflow-hidden bg-white dark:bg-[#1a0b2e]">
        <CardContent className="p-8 relative">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-amber-400 to-amber-600" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4 pl-4">
            <div>
              <h2 className="text-xl font-bold text-[#2e1065] dark:text-purple-50 tracking-tight">ความคืบหน้าการพัฒนาสมรรถนะประจำปี 2569</h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">คุณทำสำเร็จไปแล้ว 65% ของแผนทั้งหมด ก้าวต่อไปอีกนิด!</p>
            </div>
            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700 dark:from-amber-400 dark:to-amber-600">65%</div>
          </div>
          <Progress value={65} className="h-4 bg-slate-100 dark:bg-purple-950/50 ml-4 [&>div]:bg-gradient-to-r [&>div]:from-purple-600 [&>div]:to-purple-400 rounded-full" />
        </CardContent>
      </Card>

      {/* Stat Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="shadow-md hover:shadow-xl transition-all duration-300 border-slate-100 dark:border-purple-900/50 rounded-2xl bg-white dark:bg-[#1a0b2e] group hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-purple-400 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-xl bg-slate-50 dark:bg-purple-900/20 ${stat.color} dark:text-purple-300`}>
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

      {/* Data Table */}
      <Card className="shadow-lg border-slate-100 dark:border-purple-900/50 rounded-3xl overflow-hidden bg-white dark:bg-[#1a0b2e]">
        <CardHeader className="bg-slate-50 dark:bg-[#150926]/50 border-b border-slate-100 dark:border-purple-900/50 px-8 py-6">
          <CardTitle className="text-xl font-bold text-[#2e1065] dark:text-purple-50 tracking-tight">แผนการพัฒนาล่าสุด</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50 dark:bg-purple-950/30">
              <TableRow className="hover:bg-transparent border-slate-100 dark:border-purple-900/50">
                <TableHead className="font-bold text-[#2e1065] dark:text-purple-200 h-14 px-8">ชื่อหลักสูตร/แผนงาน</TableHead>
                <TableHead className="font-bold text-[#2e1065] dark:text-purple-200 hidden md:table-cell">รูปแบบการพัฒนา</TableHead>
                <TableHead className="font-bold text-[#2e1065] dark:text-purple-200 hidden sm:table-cell">วันที่</TableHead>
                <TableHead className="font-bold text-[#2e1065] dark:text-purple-200">สถานะ</TableHead>
                <TableHead className="text-right font-bold text-[#2e1065] dark:text-purple-200 px-8">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentPlans.map((plan) => (
                <TableRow key={plan.id} className="hover:bg-purple-50/30 dark:hover:bg-purple-900/20 transition-colors border-slate-100 dark:border-purple-900/30 group">
                  <TableCell className="font-bold text-slate-700 dark:text-purple-100 px-8 py-5">{plan.name}</TableCell>
                  <TableCell className="hidden md:table-cell text-slate-500 dark:text-slate-400 font-medium">{plan.type}</TableCell>
                  <TableCell className="hidden sm:table-cell text-slate-500 dark:text-slate-400 font-medium">{plan.date}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={`font-bold px-3 py-1 rounded-full border shadow-sm
                        ${plan.status === "อนุมัติแล้ว" ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800" : ""}
                        ${plan.status === "รออนุมัติ" ? "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800" : ""}
                        ${plan.status === "กำลังดำเนินการ" ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800" : ""}
                        ${plan.status === "เสร็จสิ้น" ? "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700" : ""}
                      `}
                    >
                      {plan.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right px-8">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" className="hidden sm:flex rounded-full border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/50 hover:text-purple-800 dark:hover:text-purple-100 font-bold transition-all shadow-sm group-hover:shadow">ดูรายละเอียด</Button>
                      <Button variant="ghost" size="icon" className="sm:hidden rounded-full text-purple-600 dark:text-purple-400">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
