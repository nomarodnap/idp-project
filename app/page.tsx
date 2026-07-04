import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle, Clock, FileText, MoreHorizontal } from "lucide-react";

const stats = [
  { title: "แผนทั้งหมด", value: "12", icon: FileText, color: "text-blue-500" },
  { title: "กำลังดำเนินการ", value: "4", icon: Clock, color: "text-amber-500" },
  { title: "รอการอนุมัติ", value: "2", icon: BookOpen, color: "text-purple-500" },
  { title: "เสร็จสิ้น", value: "6", icon: CheckCircle, color: "text-green-500" },
];

const recentPlans = [
  { id: 1, name: "หลักสูตรการเพาะเลี้ยงสัตว์น้ำเชิงพาณิชย์", format: "อบรมเชิงปฏิบัติการ", date: "15 ส.ค. 2569", status: "อนุมัติแล้ว", statusColor: "bg-green-100 text-green-700" },
  { id: 2, name: "การใช้เทคโนโลยีเพื่อการจัดการประมง", format: "สัมมนาออนไลน์", date: "02 ก.ย. 2569", status: "รออนุมัติ", statusColor: "bg-amber-100 text-amber-700" },
  { id: 3, name: "หลักสูตรความปลอดภัยในการออกเรือ", format: "อบรมทางไกล", date: "20 ก.ค. 2569", status: "เสร็จสิ้น", statusColor: "bg-blue-100 text-blue-700" },
  { id: 4, name: "กฎหมายและระเบียบที่เกี่ยวข้องกับการทำประมง", format: "ศึกษาด้วยตนเอง", date: "10 ก.ย. 2569", status: "กำลังดำเนินการ", statusColor: "bg-purple-100 text-purple-700" },
];

export default function Home() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          ยินดีต้อนรับสู่ระบบจัดทำแผนพัฒนารายบุคคล (IDP)
        </h1>
        <p className="text-gray-500 mt-2">
          จัดการและติดตามความก้าวหน้าในการพัฒนาตนเองของคุณ
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-sm border-none bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress Section */}
      <Card className="shadow-sm border-none bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            ความคืบหน้าการพัฒนาสมรรถนะปี 2569
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Progress value={65} className="h-3" />
            </div>
            <span className="text-sm font-medium text-[#1e3a8a]">65%</span>
          </div>
        </CardContent>
      </Card>

      {/* Data Table Section */}
      <Card className="shadow-sm border-none bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            แผนการพัฒนาล่าสุด
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ชื่อหลักสูตร/แผนงาน</TableHead>
                <TableHead>รูปแบบการพัฒนา</TableHead>
                <TableHead>วันที่</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead className="text-right">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentPlans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">{plan.name}</TableCell>
                  <TableCell>{plan.format}</TableCell>
                  <TableCell>{plan.date}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={`${plan.statusColor} border-none font-normal`}>
                      {plan.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      ดูรายละเอียด
                    </Button>
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
