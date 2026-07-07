"use client";

import { useUser } from "@/components/UserProvider";
import { User, Mail, Briefcase, Camera, Check, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { updateAvatar } from "@/actions/user";
import { useTransition, useRef } from "react";

const STYLES = [
  "avataaars", "big-smile", "fun-emoji", "bottts", 
  "adventurer", "personas", "pixel-art", "micah", 
  "lorelei", "notionists", "miniavs", "open-peeps",
  "big-ears", "croodles", "shapes"
];
const COLORS = [
  "f3e8ff", "e0e7ff", "fce7f3", "dcfce7", "ffedd5", "fef08a", "ffdfbf", "e2e8f0", "cffafe", "fef9c3", "ffed4a", "ff7e67"
];

// สร้าง Avatar 300 แบบ
const AVATAR_OPTIONS = Array.from({ length: 300 }).map((_, i) => {
  const style = STYLES[i % STYLES.length];
  const color = COLORS[i % COLORS.length];
  // ใส่ accessories หรือลูกเล่นแบบสุ่ม (อิงตาม Index เพื่อไม่ให้ Hydration Error)
  let extra = "";
  if (style === "avataaars" && i % 3 === 0) extra = "&accessories=sunglasses";
  if (style === "avataaars" && i % 4 === 0) extra = "&facialHair=beardLight";
  if (style === "bottts" && i % 2 === 0) extra = "&texture=camo";
  if (style === "bottts" && i % 3 === 0) extra = "&eyes=bulging";
  if (style === "adventurer" && i % 2 === 0) extra = "&glasses=variant02";
  
  return `https://api.dicebear.com/7.x/${style}/svg?seed=Fisheries${i}&backgroundColor=${color}${extra}`;
});

export default function ProfileClient({ user }: { user: any }) {
  const { avatarUrl, setAvatarUrl } = useUser();
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarSelect = (url: string) => {
    // Optimistic update
    setAvatarUrl(url);
    
    // Save to DB in background
    startTransition(() => {
      updateAvatar(url).catch(err => {
        console.error("Failed to update avatar", err);
      });
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_SIZE = 200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        const base64String = canvas.toDataURL("image/webp", 0.8);
        handleAvatarSelect(base64String);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    
    // Reset input so the same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-black tracking-tight text-[#2e1065] dark:text-white">ข้อมูลส่วนบุคคล</h1>
        <p className="text-slate-500 dark:text-purple-200/70 font-medium">จัดการข้อมูลส่วนตัวและตั้งค่าบัญชีของคุณ</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Avatar Selection */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white dark:bg-[#150a29] rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-purple-800/50 flex flex-col items-center text-center">
            <div className="relative mb-6 group">
              <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-purple-50 dark:border-purple-900/50 shadow-inner">
                <img src={avatarUrl} alt="Current Avatar" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept="image/*" 
                className="hidden" 
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-amber-500 text-white p-2 rounded-full shadow-lg border-2 border-white dark:border-[#150a29] hover:bg-amber-400 transition-colors cursor-pointer"
                title="อัปโหลดรูปโปรไฟล์"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
            
            <h2 className="text-lg font-bold text-[#2e1065] dark:text-purple-100">{user.name}</h2>
            <p className="text-sm text-slate-500 dark:text-purple-200/70 font-medium mb-6">
              {user.employeeType === "ข้าราชการพลเรือนสามัญ" 
                ? `${user.position || ""}${user.level || ""}`
                : user.position || "-"}
            </p>

            <div className="w-full">
              <p className="text-sm font-bold text-slate-700 dark:text-purple-200 mb-3 text-left flex items-center gap-2">
                เลือกรูปโปรไฟล์ (อวาตาร์) {isPending && <span className="text-xs font-normal text-amber-500 animate-pulse">กำลังบันทึก...</span>}
              </p>
              
              <div className="h-80 overflow-y-auto pr-2 custom-scrollbar">
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 pb-2">
                  {AVATAR_OPTIONS.map((url, idx) => {
                    const isSelected = avatarUrl === url;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleAvatarSelect(url)}
                        className={cn(
                          "relative aspect-square rounded-2xl overflow-hidden transition-all duration-300 border-2",
                          isSelected 
                            ? "border-amber-500 shadow-md scale-105" 
                            : "border-transparent hover:border-purple-200 dark:hover:border-purple-800 hover:scale-105 hover:shadow-sm opacity-70 hover:opacity-100 bg-slate-50 dark:bg-purple-900/10"
                        )}
                        title={`อวาตาร์แบบที่ ${idx + 1}`}
                      >
                        <img src={url} alt={`Avatar option ${idx + 1}`} className="w-full h-full object-cover" />
                        {isSelected && (
                          <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center">
                            <div className="bg-amber-500 rounded-full p-1 shadow-sm">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Personal Info Form */}
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-[#150a29] rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-purple-800/50 space-y-6">
            <h2 className="text-xl font-bold text-[#2e1065] dark:text-purple-100 flex items-center gap-2 border-b border-slate-100 dark:border-purple-900/50 pb-4">
              <User className="w-5 h-5 text-amber-500" />
              ข้อมูลพื้นฐาน
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-purple-200">ชื่อ-นามสกุล</label>
                <div className="h-11 px-4 bg-slate-50 dark:bg-[#1a0b2e] border border-slate-200 dark:border-purple-900/50 rounded-xl flex items-center text-slate-700 dark:text-slate-300 font-medium">
                  {user.name}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-purple-200">ประเภทบุคลากร</label>
                <div className="h-11 px-4 bg-slate-50 dark:bg-[#1a0b2e] border border-slate-200 dark:border-purple-900/50 rounded-xl flex items-center text-slate-700 dark:text-slate-300 font-medium gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  {user.employeeType}
                </div>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-bold text-slate-700 dark:text-purple-200">ตำแหน่ง</label>
                <div className="h-11 px-4 bg-slate-50 dark:bg-[#1a0b2e] border border-slate-200 dark:border-purple-900/50 rounded-xl flex items-center text-slate-700 dark:text-slate-300 font-medium gap-2">
                  <Briefcase className="w-4 h-4 text-slate-400" />
                  {user.employeeType === "ข้าราชการพลเรือนสามัญ" 
                    ? `${user.position || ""}${user.level || ""}`
                    : user.position || "-"}
                </div>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-bold text-slate-700 dark:text-purple-200">สังกัด</label>
                <div className="py-2.5 px-4 bg-slate-50 dark:bg-[#1a0b2e] border border-slate-200 dark:border-purple-900/50 rounded-xl flex flex-col justify-center gap-1.5 min-h-[44px]">
                  <div className="flex items-start text-slate-700 dark:text-slate-300 font-medium gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span className="leading-5">{user.department || "-"}</span>
                  </div>
                  {user.division && (
                    <div className="flex items-start text-slate-500 dark:text-purple-200/70 font-medium gap-2 ml-6 text-sm">
                      <span className="leading-5">{user.division}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button className="bg-slate-200 dark:bg-purple-900/30 text-slate-500 dark:text-purple-200/50 font-bold py-3 px-6 rounded-xl cursor-not-allowed w-full sm:w-auto">
                ข้อมูลถูกซิงค์จากระบบ DPIS ไม่สามารถแก้ไขได้
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
