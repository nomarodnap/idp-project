"use client";

import { useState, useRef, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, Trash2, Image as ImageIcon } from "lucide-react";
import { saveAnnouncement, deleteAnnouncement } from "@/actions/announcements";
import { toast } from "sonner";

interface Props {
  initialAnnouncements: (string | null)[];
}

export default function AnnouncementManager({ initialAnnouncements }: Props) {
  const [announcements, setAnnouncements] = useState<(string | null)[]>(initialAnnouncements);
  const [isPending, startTransition] = useTransition();
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleImageUpload = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Resize logic (max 800px width/height)
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        const maxDim = 800;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const base64Data = canvas.toDataURL("image/webp", 0.8);

          startTransition(async () => {
            const result = await saveAnnouncement(index, base64Data);
            if (result.success) {
              const newAnnouncements = [...announcements];
              newAnnouncements[index] = base64Data;
              setAnnouncements(newAnnouncements);
              toast.success(`อัปโหลดรูปภาพที่ ${index + 1} สำเร็จ`);
            } else {
              toast.error(result.error || "เกิดข้อผิดพลาดในการอัปโหลด");
            }
            // Reset input
            if (fileInputRefs.current[index]) {
              fileInputRefs.current[index]!.value = "";
            }
          });
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = (index: number) => {
    if (!confirm("คุณต้องการลบรูปภาพนี้ใช่หรือไม่?")) return;

    startTransition(async () => {
      const result = await deleteAnnouncement(index);
      if (result.success) {
        const newAnnouncements = [...announcements];
        newAnnouncements[index] = null;
        setAnnouncements(newAnnouncements);
        toast.success(`ลบรูปภาพที่ ${index + 1} สำเร็จ`);
      } else {
        toast.error(result.error || "เกิดข้อผิดพลาดในการลบ");
      }
    });
  };

  return (
    <Card className="border-slate-200 dark:border-purple-900/50 shadow-sm mt-8">
      <CardHeader className="border-b border-slate-100 dark:border-purple-900/30 bg-slate-50/50 dark:bg-[#150a29]/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg text-purple-600 dark:text-purple-400">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-xl text-[#2e1065] dark:text-purple-100">
              ประกาศข่าวสาร (Popup)
            </CardTitle>
            <CardDescription className="mt-1">
              อัปโหลดรูปภาพเพื่อแสดงใน Popup หลังจากที่ผู้ใช้เข้าสู่ระบบ (สูงสุด 4 รูป)
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="flex flex-col gap-3">
              <span className="text-sm font-bold text-slate-700 dark:text-purple-300">
                รูปภาพที่ {index + 1}
              </span>
              
              <div className="aspect-[4/3] w-full rounded-xl border-2 border-dashed border-slate-200 dark:border-purple-900/50 flex flex-col items-center justify-center overflow-hidden relative bg-slate-50 dark:bg-[#1a0b2e]/50">
                {announcements[index] ? (
                  <img 
                    src={announcements[index]!} 
                    alt={`Announcement ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-4">
                    <ImageIcon className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      ยังไม่มีรูปภาพ
                    </p>
                  </div>
                )}
              </div>

              {announcements[index] ? (
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={() => handleDelete(index)}
                  disabled={isPending}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  ลบรูปภาพ
                </Button>
              ) : (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={(el) => { fileInputRefs.current[index] = el }}
                    onChange={(e) => handleImageUpload(index, e)}
                  />
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => fileInputRefs.current[index]?.click()}
                    disabled={isPending}
                  >
                    {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                    อัปโหลดรูป
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
