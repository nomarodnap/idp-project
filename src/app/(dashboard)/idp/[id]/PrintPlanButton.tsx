"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrintPlanButton() {
  return (
    <Button 
      variant="outline" 
      onClick={() => window.print()}
      className="text-slate-700 dark:text-slate-200 border-slate-200 dark:border-purple-800 hover:bg-slate-100 dark:hover:bg-purple-900/30 font-bold rounded-xl shadow-sm"
    >
      <Printer className="w-4 h-4 mr-2" />
      พิมพ์แบบฟอร์ม (PDF)
    </Button>
  );
}
