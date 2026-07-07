export const dynamic = 'force-dynamic';
import { Metadata } from "next";
import { LoginForm } from "@/components/LoginForm";
import { Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "เข้าสู่ระบบ - ระบบจัดทำแผนพัฒนารายบุคคล (IDP)",
  description: "เข้าสู่ระบบด้วยรหัสบัตรประชาชน (DPIS) เพื่อจัดทำแผนพัฒนารายบุคคล",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-50 dark:bg-[#0f0720] transition-colors duration-500 selection:bg-purple-500/30">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {/* Decorative Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-[120px] mix-blend-multiply dark:mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-amber-400/20 blur-[120px] mix-blend-multiply dark:mix-blend-screen pointer-events-none" />
      </div>

      {/* Theme Toggle at top right */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="relative z-10 w-full max-w-5xl flex flex-col lg:flex-row items-center justify-center p-4 sm:p-6 lg:p-8 gap-8 lg:gap-16">
        
        {/* Left Section: Branding & Welcome */}
        <div className="hidden lg:flex flex-col w-full max-w-xl text-[#2e1065] dark:text-purple-50 space-y-10 animate-in fade-in slide-in-from-left-8 duration-1000">
          
          <div className="space-y-8">
            <div className="flex items-center gap-5">
              {/* กรมประมง Logo - Desktop */}
              <div className="w-24 h-24 rounded-full bg-white/90 dark:bg-white/10 shadow-xl p-1 border border-amber-200/60 dark:border-amber-500/30 overflow-hidden relative group shrink-0">
                <img src="/logo-fisheries.png" alt="โลโก้กรมประมง" className="w-full h-full object-contain rounded-full transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-amber-600 dark:text-amber-400 font-extrabold tracking-widest uppercase text-xs mb-1">Department of Fisheries</span>
                <span className="text-2xl font-black text-[#2e1065] dark:text-white tracking-tight">กรมประมง</span>
              </div>
            </div>

            <div className="space-y-5">
              <h1 className="text-[2.75rem] font-black tracking-tighter leading-[1.2] text-[#2e1065] dark:text-white">
                ระบบจัดทำแผนพัฒนา<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-purple-500 dark:from-purple-400 dark:to-purple-200">
                  รายบุคคล (IDP)
                </span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-purple-200/80 font-medium max-w-md leading-relaxed border-l-4 border-amber-400 pl-5">
                ยกระดับศักยภาพบุคลากร ด้วยระบบบริหารจัดการแผนพัฒนาที่ทันสมัยและมีประสิทธิภาพ
              </p>
            </div>
          </div>

          <div className="pt-6 mt-4 border-t border-purple-100/50 dark:border-purple-900/50">
            <div className="flex items-center gap-5 bg-white/40 dark:bg-[#1a0b2e]/50 backdrop-blur-sm rounded-2xl p-4 border border-white/60 dark:border-purple-800/30 shadow-sm w-fit">
              {/* DPIS Logo */}
              <div className="bg-white dark:bg-white/10 rounded-xl p-2 shadow-sm border border-slate-100 dark:border-amber-500/30 transition-transform hover:scale-105 shrink-0">
                <img src="/logo-dpis.png" alt="โลโก้ DPIS" className="h-12 w-auto object-contain" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">System Integration</span>
                </div>
                <span className="text-slate-600 dark:text-purple-100 font-medium text-sm">เชื่อมต่อข้อมูลบุคลากรอัตโนมัติผ่าน <span className="text-[#2e1065] dark:text-white font-extrabold">DPIS 6</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Login Form */}
        <div className="w-full max-w-[420px] lg:max-w-md">
          <div className="relative group">
            {/* Soft backdrop blur card */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-amber-500 rounded-3xl blur opacity-20 dark:opacity-30 group-hover:opacity-30 dark:group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
            
            <div className="relative bg-white/90 dark:bg-[#150a29]/90 backdrop-blur-xl border border-white/50 dark:border-purple-800/50 p-8 sm:p-10 rounded-3xl shadow-2xl overflow-hidden">
              {/* Premium Top border accent */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 via-purple-600 to-amber-400" />
              
              <div className="lg:hidden flex flex-col items-center text-center mb-8">
                {/* กรมประมง Logo - Mobile */}
                <div className="h-20 w-20 bg-white dark:bg-white/10 rounded-full flex items-center justify-center shadow-xl border border-amber-200/50 dark:border-amber-500/30 p-1 mb-5">
                  <img src="/logo-fisheries.png" alt="โลโก้กรมประมง" className="w-full h-full object-contain rounded-full" />
                </div>
                <h2 className="text-3xl font-black text-[#2e1065] dark:text-white mb-2 tracking-tight">เข้าสู่ระบบ</h2>
                <p className="text-slate-500 dark:text-purple-200/70 text-sm mb-6 font-medium">ระบบจัดทำแผนพัฒนารายบุคคล (IDP)</p>
                
                {/* DPIS Mobile Badge */}
                <div className="bg-slate-50 dark:bg-[#1a0b2e] border border-slate-100 dark:border-purple-900/50 rounded-xl p-3 flex items-center justify-center gap-3 w-full shadow-sm">
                  <img src="/logo-dpis.png" alt="โลโก้ DPIS" className="h-8 w-auto object-contain bg-white dark:bg-white/10 rounded border border-transparent dark:border-amber-500/30 p-0.5" />
                  <div className="text-left">
                    <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Powered by</div>
                    <div className="text-xs font-bold text-[#2e1065] dark:text-purple-200">HRMS DPIS 6</div>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block mb-8">
                <h2 className="text-3xl font-black text-[#2e1065] dark:text-white mb-2">เข้าสู่ระบบ</h2>
                <p className="text-slate-500 dark:text-purple-200/70 font-medium">ลงชื่อเข้าใช้งานด้วยบัญชีผู้ใช้ DPIS ของท่าน</p>
              </div>

              <LoginForm />
            </div>
          </div>
          
          <div className="mt-8 text-center text-sm text-slate-500 font-medium">
            &copy; {new Date().getFullYear()} กรมประมง (Department of Fisheries).
          </div>
          
          {/* Debug Block */}
          <div className="mt-8 p-4 bg-black/80 rounded-xl text-xs text-green-400 font-mono break-all text-left overflow-x-auto w-full">
            <h3 className="text-white font-bold mb-2">=== Vercel Environment Variables Debug ===</h3>
            <p><strong>DPIS_DOMAIN:</strong> {process.env.DPIS_DOMAIN || "UNDEFINED"}</p>
            <p><strong>DPIS_API_USER:</strong> {process.env.DPIS_API_USER ? "SET" : "UNDEFINED"}</p>
            <p><strong>DPIS_API_PASS:</strong> {process.env.DPIS_API_PASS ? "SET" : "UNDEFINED"}</p>
            <p><strong>DATABASE_URL:</strong> {process.env.DATABASE_URL ? "SET (Starts with: " + process.env.DATABASE_URL.substring(0, 15) + "...)" : "UNDEFINED"}</p>
            <p><strong>BETTER_AUTH_SECRET:</strong> {process.env.BETTER_AUTH_SECRET ? "SET" : "UNDEFINED"}</p>
            <p><strong>BETTER_AUTH_URL:</strong> {process.env.BETTER_AUTH_URL || "UNDEFINED"}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
