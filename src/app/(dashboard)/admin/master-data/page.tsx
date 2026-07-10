

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { getCompetencyCategories, getTrainingCourses } from "@/actions/master-data";

export default async function MasterDataPage() {
  const categories = await getCompetencyCategories();
  const courses = await getTrainingCourses();


  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#2e1065] dark:text-purple-50 tracking-tight">จัดการข้อมูลพื้นฐาน</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">ตั้งค่าหมวดหมู่ หลักสูตร และตัวเลือกในฟอร์ม IDP</p>
        </div>
      </div>

      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md bg-slate-100 dark:bg-purple-900/30 p-1 rounded-xl">
          <TabsTrigger value="categories" className="rounded-lg font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-[#150a29] data-[state=active]:text-[#2e1065] dark:data-[state=active]:text-purple-300">หมวดหมู่สมรรถนะ</TabsTrigger>
          <TabsTrigger value="courses" className="rounded-lg font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-[#150a29] data-[state=active]:text-[#2e1065] dark:data-[state=active]:text-purple-300">หลักสูตรฝึกอบรม</TabsTrigger>
        </TabsList>
        
        <TabsContent value="categories" className="mt-6">
          <Card className="shadow-lg border-slate-100 dark:border-purple-900/50 rounded-3xl overflow-hidden bg-white dark:bg-[#1a0b2e]">
            <div className="p-6 border-b border-slate-100 dark:border-purple-900/50 bg-slate-50/50 dark:bg-[#150926]/50 flex justify-between items-center">
              <CardTitle className="text-lg font-bold text-[#2e1065] dark:text-purple-100">รายการหมวดหมู่สมรรถนะ</CardTitle>
              <Button size="sm" className="rounded-xl font-bold bg-[#4c1d95] text-white hover:bg-[#5b21b6]">
                <Plus className="w-4 h-4 mr-2" /> เพิ่มหมวดหมู่
              </Button>
            </div>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50 dark:bg-purple-950/30">
                  <TableRow className="border-slate-100 dark:border-purple-900/50">
                    <TableHead className="font-bold text-[#2e1065] dark:text-purple-200 px-6 h-12">รหัส</TableHead>
                    <TableHead className="font-bold text-[#2e1065] dark:text-purple-200">ชื่อหมวดหมู่</TableHead>
                    <TableHead className="font-bold text-[#2e1065] dark:text-purple-200">ประเภทบุคลากร</TableHead>
                    <TableHead className="text-right font-bold text-[#2e1065] dark:text-purple-200 px-6">จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((c) => (
                    <TableRow key={c.id} className="border-slate-100 dark:border-purple-900/30">
                      <TableCell className="font-medium text-slate-500 px-6">{c.code}</TableCell>
                      <TableCell className="font-bold text-slate-700 dark:text-purple-100">{c.name}</TableCell>
                      <TableCell className="text-slate-600 dark:text-slate-400">{c.employeeType}</TableCell>
                      <TableCell className="text-right px-6">
                        <Button variant="ghost" size="icon" className="text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30"><Edit2 className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"><Trash2 className="w-4 h-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="mt-6">
          <Card className="shadow-lg border-slate-100 dark:border-purple-900/50 rounded-3xl overflow-hidden bg-white dark:bg-[#1a0b2e]">
            <div className="p-6 border-b border-slate-100 dark:border-purple-900/50 bg-slate-50/50 dark:bg-[#150926]/50 flex justify-between items-center">
              <CardTitle className="text-lg font-bold text-[#2e1065] dark:text-purple-100">รายการหลักสูตรมาตรฐาน</CardTitle>
              <Button size="sm" className="rounded-xl font-bold bg-[#4c1d95] text-white hover:bg-[#5b21b6]">
                <Plus className="w-4 h-4 mr-2" /> เพิ่มหลักสูตร
              </Button>
            </div>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50 dark:bg-purple-950/30">
                  <TableRow className="border-slate-100 dark:border-purple-900/50">
                    <TableHead className="font-bold text-[#2e1065] dark:text-purple-200 px-6 h-12">ชื่อหลักสูตร</TableHead>
                    <TableHead className="font-bold text-[#2e1065] dark:text-purple-200">หน่วยงานที่จัด</TableHead>
                    <TableHead className="font-bold text-[#2e1065] dark:text-purple-200">ระยะเวลา</TableHead>
                    <TableHead className="text-right font-bold text-[#2e1065] dark:text-purple-200 px-6">จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((c) => (
                    <TableRow key={c.id} className="border-slate-100 dark:border-purple-900/30">
                      <TableCell className="font-bold text-slate-700 dark:text-purple-100 px-6">{c.title}</TableCell>
                      <TableCell className="text-slate-600 dark:text-slate-400">{c.provider}</TableCell>
                      <TableCell className="text-slate-600 dark:text-slate-400">{c.duration}</TableCell>
                      <TableCell className="text-right px-6">
                        <Button variant="ghost" size="icon" className="text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30"><Edit2 className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"><Trash2 className="w-4 h-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
