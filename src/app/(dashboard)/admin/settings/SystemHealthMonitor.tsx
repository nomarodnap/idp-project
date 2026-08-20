"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  Database, 
  HardDrive, 
  Users, 
  FileText, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Image as ImageIcon,
  Cpu
} from "lucide-react";
import { getSystemMetrics, type SystemMetrics } from "@/actions/monitoring";
import { toast } from "sonner";

interface Props {
  initialMetrics?: SystemMetrics | null;
}

export default function SystemHealthMonitor({ initialMetrics }: Props) {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(initialMetrics || null);
  const [isPending, startTransition] = useTransition();

  const handleRefresh = () => {
    startTransition(async () => {
      const res = await getSystemMetrics();
      if (res.data) {
        setMetrics(res.data);
        toast.success("อัปเดตข้อมูลสถานะระบบเรียบร้อย");
      } else {
        toast.error(res.error || "ไม่สามารถโหลดข้อมูลระบบได้");
      }
    });
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const parts = [];
    if (days > 0) parts.push(`${days} วัน`);
    if (hours > 0) parts.push(`${hours} ชม.`);
    if (minutes > 0) parts.push(`${minutes} นาที`);
    parts.push(`${secs} วินาที`);
    return parts.join(" ");
  };

  // Calculate table size percentage relative to top table
  const maxTableBytes = metrics?.database.tables[0]?.totalBytes || 1;

  return (
    <Card className="border-slate-200 dark:border-purple-900/50 shadow-sm mt-8 overflow-hidden">
      <CardHeader className="border-b border-slate-100 dark:border-purple-900/30 bg-slate-50/50 dark:bg-[#150a29]/50 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-purple-500 to-purple-800 rounded-xl text-white shadow-md shadow-purple-500/20">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <CardTitle className="text-xl text-[#2e1065] dark:text-purple-100 font-bold">
                  สถานะและการทำงานของระบบ (System Health)
                </CardTitle>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 gap-1.5 py-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                  Live
                </Badge>
              </div>
              <CardDescription className="mt-1">
                ติดตามประสิทธิภาพฐานข้อมูล พื้นที่จัดเก็บ และสถานะเซิร์ฟเวอร์แบบ Real-time
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isPending}
              className="border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/50 shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isPending ? "animate-spin text-purple-600" : ""}`} />
              {isPending ? "กำลังตรวจสอบ..." : "รีเฟรชสถานะ"}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* KPI Top Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Database Latency */}
          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-purple-900/40 bg-white dark:bg-[#1a0b2e]/60 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500 dark:text-purple-300 text-xs font-medium">
              <span>Database Latency</span>
              <Database className="w-4 h-4 text-purple-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-800 dark:text-white">
                {metrics?.database.latencyMs ?? "--"}
              </span>
              <span className="text-xs text-slate-400">ms</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px]">
              {(metrics?.database.latencyMs ?? 999) < 100 ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">ตอบสนองรวดเร็วมาก</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-amber-600 dark:text-amber-400 font-medium">ความเร็วปานกลาง</span>
                </>
              )}
            </div>
          </div>

          {/* Database Total Size */}
          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-purple-900/40 bg-white dark:bg-[#1a0b2e]/60 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500 dark:text-purple-300 text-xs font-medium">
              <span>Database Size</span>
              <HardDrive className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-800 dark:text-white">
                {metrics?.database.totalSize ?? "--"}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              ขนาดพื้นที่ฐานข้อมูลปัจจุบัน
            </div>
          </div>

          {/* Total Users & Active Sessions */}
          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-purple-900/40 bg-white dark:bg-[#1a0b2e]/60 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500 dark:text-purple-300 text-xs font-medium">
              <span>ผู้ใช้งานในระบบ</span>
              <Users className="w-4 h-4 text-blue-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-800 dark:text-white">
                {metrics?.stats.totalUsers ?? 0}
              </span>
              <span className="text-xs text-slate-400">คน</span>
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              Active Sessions: {metrics?.stats.activeSessions ?? 0} เซสชัน
            </div>
          </div>

          {/* Total IDP Plans */}
          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-purple-900/40 bg-white dark:bg-[#1a0b2e]/60 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500 dark:text-purple-300 text-xs font-medium">
              <span>แผน IDP ทั้งหมด</span>
              <FileText className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-800 dark:text-white">
                {metrics?.stats.totalIdpPlans ?? 0}
              </span>
              <span className="text-xs text-slate-400">แผน</span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              บันทึกในระบบ IDP
            </div>
          </div>
        </div>

        {/* Detailed Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Table Storage Breakdown */}
          <div className="p-5 rounded-xl border border-slate-200/80 dark:border-purple-900/40 bg-white dark:bg-[#1a0b2e]/40 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <h4 className="text-sm font-bold text-slate-800 dark:text-purple-100">
                  สัดส่วนขนาดพื้นที่ของตาราง (Tables Breakdown)
                </h4>
              </div>
              <span className="text-xs text-slate-400">Top Tables</span>
            </div>

            <div className="space-y-3">
              {metrics?.database.tables && metrics.database.tables.length > 0 ? (
                metrics.database.tables.slice(0, 5).map((table, idx) => {
                  const percent = Math.min(100, Math.round((table.totalBytes / maxTableBytes) * 100));
                  return (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono text-slate-700 dark:text-purple-200 font-medium">
                          {table.tableName}
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-white">
                          {table.totalSize}
                        </span>
                      </div>
                      <Progress value={percent} className="h-1.5 bg-slate-100 dark:bg-purple-950" />
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-slate-400">ไม่มีข้อมูลตาราง</p>
              )}
            </div>
          </div>

          {/* Announcement Storage & Server Memory */}
          <div className="space-y-4">
            {/* Announcement Images Base64 Storage */}
            <div className="p-5 rounded-xl border border-slate-200/80 dark:border-purple-900/40 bg-white dark:bg-[#1a0b2e]/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-amber-500" />
                  <h4 className="text-sm font-bold text-slate-800 dark:text-purple-100">
                    ขนาดรูปภาพประกาศข่าวสาร (Popup Base64)
                  </h4>
                </div>
                <Badge variant="secondary" className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  Base64 Text
                </Badge>
              </div>

              {metrics?.announcementsStorage && metrics.announcementsStorage.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {metrics.announcementsStorage.map((img, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-50 dark:bg-purple-950/40 border border-slate-100 dark:border-purple-900/30 flex items-center justify-between">
                      <span className="text-xs text-slate-600 dark:text-purple-300 font-medium truncate">
                        {img.key.replace("ANNOUNCEMENT_IMAGE_", "รูปที่ ")}
                      </span>
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                        {img.sizeFormatted}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">ยังไม่มีการบันทึกรูปภาพประกาศในฐานข้อมูล</p>
              )}
            </div>

            {/* Server & Node Info */}
            <div className="p-5 rounded-xl border border-slate-200/80 dark:border-purple-900/40 bg-white dark:bg-[#1a0b2e]/40 space-y-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <h4 className="text-sm font-bold text-slate-800 dark:text-purple-100">
                  ทรัพยากรเซิร์ฟเวอร์ (Server Specs)
                </h4>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-purple-950/40">
                  <span className="text-slate-400 block text-[10px]">Memory Heap Used</span>
                  <span className="font-bold text-slate-700 dark:text-purple-200">
                    {metrics?.server.heapUsed ?? "--"}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-purple-950/40">
                  <span className="text-slate-400 block text-[10px]">Memory RSS</span>
                  <span className="font-bold text-slate-700 dark:text-purple-200">
                    {metrics?.server.rss ?? "--"}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-purple-950/40">
                  <span className="text-slate-400 block text-[10px]">Uptime</span>
                  <span className="font-bold text-slate-700 dark:text-purple-200">
                    {metrics?.server.uptimeSeconds ? formatUptime(metrics.server.uptimeSeconds) : "--"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
