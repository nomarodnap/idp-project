import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, CheckCircle2, Clock, Loader2, ClipboardList } from "lucide-react";
import { getUsers } from "@/actions/user";
import { getIDPPlans } from "@/actions/idp";
import { getCurrentFiscalYear } from "@/lib/date";
import AdminDashboardCharts from "./AdminDashboardCharts";
import AdminDashboard702010 from "./AdminDashboard702010";
import AdminDashboardSuccessRate from "./AdminDashboardSuccessRate";
import AdminDashboardFilters from "./AdminDashboardFilters";

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const allUsers = await getUsers();
  const allPlansRaw = await getIDPPlans({ fetchAll: true });

  const resolvedParams = await searchParams;
  const currentYear = getCurrentFiscalYear();
  const selectedYear = resolvedParams.year ? parseInt(resolvedParams.year as string) : currentYear;
  const selectedEmployeeType = (resolvedParams.employeeType as string) || "ทั้งหมด";

  let allPlans = allPlansRaw.filter(p => p.fiscalYear === selectedYear);

  if (selectedEmployeeType !== "ทั้งหมด") {
    allPlans = allPlans.filter(p => p.userEmployeeType === selectedEmployeeType);
  }

  const allCount = allPlans.length;
  const pendingApprovalCount = allPlans.filter(p => p.status === 'รออนุมัติ' || p.status === 'Pending').length;
  const pendingCount = allPlans.filter(p => p.status === 'รอประเมินผล').length; // Waiting for evaluation
  const completedCount = allPlans.filter(p => p.status === 'สำเร็จ').length;
  const failedCount = allPlans.filter(p => p.status === 'ไม่สำเร็จ').length;
  const totalEvaluated = completedCount + failedCount;
  const successPercentage = totalEvaluated > 0 ? Math.round((completedCount / totalEvaluated) * 100) : 0;
  const inProgressCount = allPlans.filter(p => p.status === 'กำลังดำเนินการ').length;

  const evaluatedSubtitle = [
    completedCount > 0 ? `สำเร็จ ${completedCount}` : "",
    failedCount > 0 ? `ไม่สำเร็จ ${failedCount}` : ""
  ].filter(Boolean).join(" • ");

  const statCards = [
    { title: "แผนทั้งหมด", value: allCount.toString(), icon: FileText, color: "text-blue-600", subtitle: "แผนพัฒนาสะสมทั้งหมด" },
    { title: "กำลังดำเนินการ", value: inProgressCount.toString(), icon: Loader2, color: "text-amber-500", subtitle: "อยู่ระหว่างการพัฒนา" },
    { title: "รอการประเมินผล", value: pendingCount.toString(), icon: Clock, color: "text-orange-500", subtitle: "รอประเมินผล" },
    { title: "เสร็จสิ้น", value: totalEvaluated.toString(), icon: CheckCircle2, color: "text-emerald-600", subtitle: totalEvaluated > 0 ? evaluatedSubtitle : "ยังไม่มีผลประเมิน" },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#2e1065] dark:text-purple-50 tracking-tight">Admin Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">ภาพรวมการจัดทำแผนพัฒนาบุคลากร (IDP) ประจำปี {selectedYear}</p>
        </div>
        
        <AdminDashboardFilters 
          currentYear={currentYear} 
          selectedYear={selectedYear} 
          selectedEmployeeType={selectedEmployeeType}
        />
      </div>

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

      {/* Linked Pie Charts for Category and Topic */}
      <AdminDashboardCharts plans={allPlans} />
      
      {/* 70:20:10 Popular Selections */}
      <AdminDashboard702010 plans={allPlans} />

      {/* Success vs Fail Chart */}
      <AdminDashboardSuccessRate plans={allPlans} />

    </div>
  );
}
