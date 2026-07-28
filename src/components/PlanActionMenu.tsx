"use client";

import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { deleteIDPPlan, evaluateIDPPlan } from "@/actions/idp";
import { useState } from "react";

export function PlanActionMenu({ planId, currentPhase }: { planId: string; currentPhase: number }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showEvaluateDialog, setShowEvaluateDialog] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const handleDelete = async () => {
    if (confirm("ยืนยันการลบแผนพัฒนานี้? การดำเนินการนี้ไม่สามารถย้อนกลับได้")) {
      setIsDeleting(true);
      try {
        const res = await deleteIDPPlan(planId);
        if (res?.error) {
          alert("ไม่สามารถลบแผนได้: " + res.error);
          setIsDeleting(false);
        } else {
          router.refresh();
        }
      } catch (err) {
        alert("เกิดข้อผิดพลาดในการลบแผน");
        setIsDeleting(false);
      }
    }
  };

  const handleEvaluate = async (result: string) => {
    setIsEvaluating(true);
    try {
      const response = await evaluateIDPPlan(planId, result);
      if (response?.error) {
        alert("Error: " + response.error);
      } else {
        setShowEvaluateDialog(false);
        router.refresh();
      }
    } catch (error) {
      alert("Failed to evaluate plan");
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger render={
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 ml-auto focus-visible:ring-0">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        } />
        <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-lg border-slate-100 dark:border-purple-900/50">
          
          {(currentPhase === 1 || currentPhase === 2) && (
            <DropdownMenuItem render={
              <Link href={`/idp/${planId}/edit`} className="cursor-pointer font-medium px-3 py-2 flex items-center">
                <Edit className="mr-2 h-4 w-4" /> แก้ไขแผน
              </Link>
            } />
          )}

          {currentPhase === 1 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={(e) => {
                  handleDelete();
                }}
                disabled={isDeleting}
                className="text-red-600 focus:text-red-700 cursor-pointer font-medium px-3 py-2 flex items-center"
              >
                <Trash2 className="mr-2 h-4 w-4" /> {isDeleting ? "กำลังลบ..." : "ลบแผน"}
              </DropdownMenuItem>
            </>
          )}

          {currentPhase === 4 && (
            <DropdownMenuItem 
              onClick={() => setShowEvaluateDialog(true)}
              className="text-emerald-600 focus:text-emerald-700 cursor-pointer font-medium px-3 py-2 flex items-center"
            >
              <CheckCircle className="mr-2 h-4 w-4" /> ประเมินผล (ด้วยตนเอง)
            </DropdownMenuItem>
          )}

        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showEvaluateDialog} onOpenChange={setShowEvaluateDialog}>
        <DialogContent className="rounded-3xl border-slate-100 dark:border-purple-900/50 bg-white dark:bg-[#1a0b2e] p-6 max-w-md w-[calc(100%-2rem)]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-[#2e1065] dark:text-purple-50">
              ประเมินผลการพัฒนา
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400 font-medium">
              โปรดระบุผลลัพธ์ที่ได้จากการดำเนินการตามแผนพัฒนานี้
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-3 mt-4">
            <Button 
              onClick={() => handleEvaluate("Success")}
              disabled={isEvaluating}
              className="w-full justify-start h-auto py-4 px-6 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 dark:border-emerald-800/50 dark:text-emerald-300 transition-all text-wrap"
            >
              <CheckCircle className="w-6 h-6 mr-3 shrink-0" />
              <div className="text-left">
                <div className="font-bold text-base">สำเร็จ (ผ่านเกณฑ์)</div>
                <div className="text-xs font-medium opacity-80 mt-0.5 line-clamp-2">ดำเนินการพัฒนาครบถ้วนและผ่านการประเมินตามที่กำหนด</div>
              </div>
            </Button>

            <Button 
              onClick={() => handleEvaluate("Fail")}
              disabled={isEvaluating}
              className="w-full justify-start h-auto py-4 px-6 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-900/20 dark:hover:bg-rose-900/40 dark:border-rose-800/50 dark:text-rose-300 transition-all text-wrap"
            >
              <XCircle className="w-6 h-6 mr-3 shrink-0" />
              <div className="text-left">
                <div className="font-bold text-base">ไม่สำเร็จ (ไม่ผ่านเกณฑ์)</div>
                <div className="text-xs font-medium opacity-80 mt-0.5 line-clamp-2">ไม่สามารถดำเนินการได้ครบถ้วน หรือไม่ผ่านการประเมิน</div>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
