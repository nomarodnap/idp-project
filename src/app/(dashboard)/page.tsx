import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Loader2, Clock, CheckCircle2, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { getIDPPlans } from "@/actions/idp";
import { format } from "date-fns";

const statCards = [
  { title: "แผนทั้งหมด", value: "12", icon: FileText, color: "text-blue-600", subtitle: "แผนพัฒนาตลอดปี" },
  { title: "กำลังดำเนินการ", value: "3", icon: Loader2, color: "text-amber-500", subtitle: "อยู่ระหว่างศึกษา" },
  { title: "รอการอนุมัติ", value: "2", icon: Clock, color: "text-orange-500", subtitle: "รอการประเมินผล" },
  { title: "เสร็จสิ้น", value: "7", icon: CheckCircle2, color: "text-emerald-600", subtitle: "ผ่านเกณฑ์ 100%" },
];



export default async function DashboardPage() {
  const plans = await getIDPPlans();
  const topPlans = plans.slice(0, 4); // Show only recent 4 plans
  
  const allCount = plans.length;
  const pendingCount = plans.filter(p => p.status === 'Pending' || p.status === 'รออนุมัติ').length;
  const completedCount = plans.filter(p => p.status === 'Completed' || p.status === 'เสร็จสิ้น').length;
  const inProgressCount = plans.filter(p => p.status === 'In Progress' || p.status === 'กำลังดำเนินการ').length;

  const statCards = [
    { title: "แผนทั้งหมด", value: allCount.toString(), icon: FileText, color: "text-blue-600", subtitle: "แผนพัฒนาตลอดปี" },
    { title: "กำลังดำเนินการ", value: inProgressCount.toString(), icon: Loader2, color: "text-amber-500", subtitle: "อยู่ระหว่างศึกษา" },
    { title: "รอการอนุมัติ", value: pendingCount.toString(), icon: Clock, color: "text-orange-500", subtitle: "รอการประเมินผล" },
    { title: "เสร็จสิ้น", value: completedCount.toString(), icon: CheckCircle2, color: "text-emerald-600", subtitle: "ผ่านเกณฑ์ 100%" },
  ];
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

      {/* Data Cards (Replacing Table) */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-2xl font-black text-[#2e1065] dark:text-purple-50 tracking-tight">แผนการพัฒนาล่าสุด</h2>
          <Link href="/idp">
            <Button variant="ghost" className="text-purple-600 dark:text-purple-400 font-bold hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-xl">ดูทั้งหมด</Button>
          </Link>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {topPlans.length === 0 && (
            <div className="col-span-2 text-center py-10 text-slate-500">
              ยังไม่มีแผนการพัฒนา
            </div>
          )}
          {topPlans.map((plan) => (
            <Card key={plan.id} className="shadow-md hover:shadow-xl transition-all duration-300 border-slate-100 dark:border-purple-900/50 rounded-3xl bg-white dark:bg-[#1a0b2e] group hover:-translate-y-1 relative overflow-hidden flex flex-col">
              <div className={`absolute top-0 left-0 w-full h-1.5 
                ${plan.status === "อนุมัติแล้ว" ? "bg-emerald-500" : ""}
                ${plan.status === "รออนุมัติ" ? "bg-amber-500" : ""}
                ${plan.status === "กำลังดำเนินการ" ? "bg-blue-500" : ""}
                ${plan.status === "เสร็จสิ้น" ? "bg-slate-400" : ""}
              `} />
              <CardContent className="p-6 sm:p-8 flex flex-col h-full flex-grow">
                <div className="flex justify-between items-start gap-4 mb-4">
                  <Badge 
                    variant="outline" 
                    className={`font-bold px-3 py-1 rounded-full border shadow-sm shrink-0
                      ${plan.status === "Approved" || plan.status === "อนุมัติแล้ว" ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800" : ""}
                      ${plan.status === "Pending" || plan.status === "รออนุมัติ" ? "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800" : ""}
                      ${plan.status === "Completed" || plan.status === "เสร็จสิ้น" ? "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700" : ""}
                      ${plan.status === "Draft" || plan.status === "แบบร่าง" ? "bg-slate-50 text-slate-500 border-slate-200" : ""}
                    `}
                  >
                    {plan.status === "Pending" ? "รออนุมัติ" : plan.status === "Approved" ? "อนุมัติแล้ว" : plan.status === "Completed" ? "เสร็จสิ้น" : plan.status === "Draft" ? "แบบร่าง" : plan.status}
                  </Badge>
                  <div className="text-sm font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1.5 shrink-0">
                    <Clock className="w-4 h-4" />
                    {plan.createdAt ? format(new Date(plan.createdAt), "dd/MM/yyyy") : "-"}
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-xl font-bold text-[#2e1065] dark:text-purple-50 line-clamp-2 leading-snug group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
                    {plan.courseTitle}
                  </h3>
                  <div className="text-sm font-semibold text-purple-600 dark:text-purple-400 mt-2">
                    {plan.planCode || "IDP-LEGACY"}
                  </div>
                  <div className="inline-flex mt-2">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-purple-100/50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-800/50">
                      หมวดหมู่: {plan.devCategory}
                    </span>
                  </div>
                </div>

                <div className="mt-auto pt-5 border-t border-slate-100 dark:border-purple-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-purple-900/50 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-slate-400 dark:text-slate-500">ผู้กำกับดูแลแผน</span>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300 line-clamp-1">{plan.supervisorName}</span>
                    </div>
                  </div>
                  <Link href={`/idp/${plan.id}`} className="w-full sm:w-auto">
                    <Button variant="outline" size="sm" className="rounded-xl border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/50 font-bold transition-all shadow-sm w-full">
                      ดูรายละเอียด
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
