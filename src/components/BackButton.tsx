"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function BackButton() {
  const router = useRouter();
  
  return (
    <Button 
      variant="ghost" 
      onClick={() => router.back()}
      className="text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30"
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      ย้อนกลับ
    </Button>
  );
}
