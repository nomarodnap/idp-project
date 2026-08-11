"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { getAnnouncements } from "@/actions/announcements";

export default function AnnouncementPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const checkAnnouncement = async () => {
      const hasSeen = sessionStorage.getItem("hasSeenAnnouncement");
      if (hasSeen) return;

      const announcements = await getAnnouncements();
      const validImages = announcements.filter((img) => img !== null) as string[];

      if (validImages.length > 0) {
        setImages(validImages);
        setIsOpen(true);
      } else {
        // If no announcements, mark as seen to prevent checking again and again in the same session
        sessionStorage.setItem("hasSeenAnnouncement", "true");
      }
    };

    checkAnnouncement();
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("hasSeenAnnouncement", "true");
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const [progress, setProgress] = useState(0);

  // Auto-play feature: change image every 10 seconds with progress bar
  useEffect(() => {
    if (images.length <= 1 || !isOpen) return;

    setProgress(0);

    const intervalTime = 50; // ms
    const totalTime = 10000; // 10s
    const increment = (intervalTime / totalTime) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextImage();
          return 0;
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [currentIndex, images.length, isOpen]);

  if (images.length === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-4xl p-0 overflow-hidden border-none bg-transparent shadow-2xl [&>button]:hidden">
        <DialogTitle className="sr-only">ประกาศข่าวสาร</DialogTitle>
        <DialogDescription className="sr-only">รูปภาพประกาศข่าวสารจากผู้ดูแลระบบ</DialogDescription>
        
        <div className="relative flex flex-col items-center justify-center bg-transparent sm:rounded-xl overflow-hidden w-full max-h-[90vh]">
          <img
            src={images[currentIndex]}
            alt={`Announcement ${currentIndex + 1}`}
            className="w-full h-auto max-h-[90vh] object-contain animate-in fade-in duration-500 rounded-xl shadow-2xl"
            key={currentIndex}
          />

          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors z-20 backdrop-blur-md shadow-lg"
          >
            <X className="w-5 h-5" />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors z-10 backdrop-blur-md shadow-lg"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors z-10 backdrop-blur-md shadow-lg"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10 bg-black/60 px-3 py-2 rounded-full backdrop-blur-md shadow-lg">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentIndex ? "bg-amber-500 w-6" : "bg-white/70 hover:bg-white"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Timebar Progress */}
          {images.length > 1 && (
            <div className="absolute bottom-0 left-0 h-1.5 bg-amber-500 z-30 transition-all duration-75 ease-linear shadow-[0_0_8px_rgba(245,158,11,0.8)]" style={{ width: `${progress}%` }} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
