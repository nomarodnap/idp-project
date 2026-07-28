import { format } from "date-fns";
import { th } from "date-fns/locale";

/**
 * Formats a date into Thai Buddhist Era (พ.ศ.)
 * By default uses "dd/MM/yyyy" which will output e.g. "10/07/2569"
 */
export function formatThaiDate(date: Date | string | number | null | undefined, formatStr: string = "dd/MM/yyyy"): string {
  if (!date) return "-";
  
  const d = new Date(date);
  // Check if date is valid
  if (isNaN(d.getTime())) return "-";
  
  // Create a new date object so we don't mutate the original if it was passed by reference
  const thaiDate = new Date(d.getTime());
  
  // Add 543 years for Buddhist Era
  thaiDate.setFullYear(thaiDate.getFullYear() + 543);
  
  return format(thaiDate, formatStr, { locale: th });
}

/**
 * Calculates the current Thai Fiscal Year (ปีงบประมาณ)
 * Fiscal year starts on October 1st.
 * Example: Oct 1, 2026 (2569 BE) -> Fiscal Year 2570
 */
export function getCurrentFiscalYear(date: Date = new Date()): number {
  const currentMonth = date.getMonth(); // 0 = Jan, 9 = Oct
  const gregorianYear = date.getFullYear();
  const isNewFiscalYear = currentMonth >= 9;
  return gregorianYear + 543 + (isNewFiscalYear ? 1 : 0);
}
