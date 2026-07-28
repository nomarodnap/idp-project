"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { evaluateIDPPlan } from "@/actions/idp";
import { Loader2, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

interface SelfEvaluateButtonProps {
  planId: string;
  initialStatus: string | null;
}

export default function SelfEvaluateButton({ planId, initialStatus }: SelfEvaluateButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [confirmResult, setConfirmResult] = useState<string | null>(null);
  const router = useRouter();

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setTimeout(() => setConfirmResult(null), 300); // clear after animation
    }
  };

  const handleEvaluate = async (result: string) => {
    setIsEvaluating(true);
    try {
      const response = await evaluateIDPPlan(planId, result);
      if (response.error) {
        alert("Error: " + response.error);
      } else {
        setIsOpen(false);
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      alert("Failed to evaluate plan");
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger render={
        <Button 
          variant={initialStatus ? "outline" : "default"} 
          className={`rounded-xl font-bold transition-all shadow-sm ${
            initialStatus 
              ? "border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30" 
              : "text-white shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] hover:-translate-y-0.5 bg-gradient-to-r from-emerald-600 to-emerald-800 border-none"
          }`}
        >
          {isEvaluating ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <CheckCircle className="w-4 h-4 mr-2" />
          )}
          {initialStatus ? `ประเมินผลแล้ว: ${initialStatus === "Success" ? "สำเร็จ" : "ไม่สำเร็จ"}` : "ประเมินผล (ด้วยตัวเอง)"}
        </Button>
      } />
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-[#1a0b2e] border-slate-100 dark:border-purple-800/50 rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-[#2e1065] dark:text-purple-50">ประเมินผลการพัฒนา</DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-slate-400">
            กรุณาประเมินผลการดำเนินการตามแผนพัฒนาบุคลากรรายบุคคล (IDP) นี้ ว่าท่านดำเนินการสำเร็จหรือไม่
          </DialogDescription>
        </DialogHeader>
        
        {confirmResult ? (
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col items-center text-center gap-4 py-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800 p-6">
              <AlertTriangle className="w-12 h-12 text-amber-500" />
              <div>
                <h4 className="text-lg font-bold text-amber-700 dark:text-amber-400 mb-2">
                  ยืนยันการประเมินผล
                </h4>
                <p className="text-sm text-amber-600 dark:text-amber-500">
                  คุณต้องการประเมินผลแผนพัฒนานี้เป็น <strong className="text-lg text-amber-800 dark:text-amber-300">"{confirmResult === 'Success' ? 'สำเร็จ' : 'ไม่สำเร็จ'}"</strong> ใช่หรือไม่?<br/><br/>
                  <span className="font-bold underline">หมายเหตุ:</span> หากกดยืนยันแล้วจะไม่สามารถกลับมาแก้ไขได้อีก
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 w-full">
              <Button 
                onClick={() => setConfirmResult(null)} 
                variant="outline"
                className="flex-1 h-12 rounded-xl"
                disabled={isEvaluating}
              >
                ย้อนกลับ
              </Button>
              <Button 
                onClick={() => handleEvaluate(confirmResult)} 
                className={`flex-1 h-12 rounded-xl font-bold text-white shadow-sm ${
                  confirmResult === 'Success' 
                    ? 'bg-emerald-600 hover:bg-emerald-700' 
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
                disabled={isEvaluating}
              >
                {isEvaluating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                ยืนยันการประเมิน
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 py-6">
            <Button 
              onClick={() => setConfirmResult("Success")} 
              disabled={isEvaluating}
              className="h-14 rounded-xl font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 border-none text-lg"
            >
              <CheckCircle className="w-6 h-6 mr-2" />
              สำเร็จตามเป้าหมาย
            </Button>
            <Button 
              onClick={() => setConfirmResult("Fail")} 
              disabled={isEvaluating}
              variant="outline"
              className="h-14 rounded-xl font-bold text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-all text-lg shadow-sm"
            >
              <XCircle className="w-6 h-6 mr-2" />
              ไม่สำเร็จ / ยังไม่บรรลุเป้าหมาย
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
