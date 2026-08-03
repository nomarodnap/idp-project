export type PlanStatus = 
  | "รออนุมัติ" 
  | "กำลังดำเนินการ" 
  | "รอประเมินผล" 
  | "สำเร็จ" 
  | "ไม่สำเร็จ"
  | "แบบร่าง"; // For phase 1 edge cases if needed

export function getDerivedPlanStatus(
  phase: number, 
  selfEvaluationResult: string | null,
  planFiscalYear?: number,
  currentFiscalYear?: number
): string {
  // If the plan has already been evaluated, lock its status regardless of the current phase
  if (selfEvaluationResult === "Success" || selfEvaluationResult === "สำเร็จ") {
    return "สำเร็จ";
  }
  if (selfEvaluationResult === "Fail" || selfEvaluationResult === "ไม่สำเร็จ") {
    return "ไม่สำเร็จ";
  }

  // If the plan belongs to a previous fiscal year and wasn't explicitly marked "Success", it auto-fails.
  if (planFiscalYear && currentFiscalYear && planFiscalYear !== currentFiscalYear) {
    return "ไม่สำเร็จ";
  }

  // Phase 1, 2 & 3: All plans are in progress
  if (phase === 1 || phase === 2 || phase === 3) {
    return "กำลังดำเนินการ";
  }
  
  // Phase 4: Evaluation
  if (phase === 4) {
    return "รอประเมินผล";
  }
  
  return "รออนุมัติ";
}
