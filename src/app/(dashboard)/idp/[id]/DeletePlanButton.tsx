"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteIDPPlan } from "@/actions/idp";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function DeletePlanButton({ planId }: { planId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const res = await deleteIDPPlan(planId);
      if (res?.error) {
        alert("ไม่สามารถลบแผนได้: " + res.error);
        setIsDeleting(false);
      } else {
        router.push("/idp");
      }
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาดในการลบแผน");
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger render={
        <Button variant="outline" className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/50 hover:bg-red-50 dark:hover:bg-red-900/30 font-bold rounded-xl shadow-sm">
          <Trash2 className="w-4 h-4 mr-2" />
          ลบแผน
        </Button>
      } />
      <AlertDialogContent className="rounded-3xl border-slate-100 dark:border-purple-900/50 bg-white dark:bg-[#1a0b2e]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-black text-[#2e1065] dark:text-purple-50">
            ยืนยันการลบแผนพัฒนา?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-500 dark:text-slate-400 font-medium">
            การดำเนินการนี้ไม่สามารถย้อนกลับได้ แผนการพัฒนานี้จะถูกลบออกจากระบบอย่างถาวร คุณแน่ใจหรือไม่ที่จะดำเนินการต่อ?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel className="rounded-xl border-slate-200 dark:border-purple-900/50 font-bold hover:bg-slate-50 dark:hover:bg-[#150a29]">
            ยกเลิก
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isDeleting}
            className="rounded-xl font-bold bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
          >
            {isDeleting ? "กำลังลบ..." : "ยืนยันการลบ"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
