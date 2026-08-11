"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { logout } from "@/actions/auth";

export function AutoLogout() {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // 60 minutes = 60 * 60 * 1000 ms
    timeoutRef.current = setTimeout(async () => {
      toast.error("เซสชันหมดอายุเนื่องจากไม่มีการใช้งานเกิน 1 ชั่วโมง");
      await logout();
      window.location.href = "/login";
    }, 60 * 60 * 1000);
  };

  useEffect(() => {
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
    let lastActive = Date.now();

    const handleActivity = () => {
      const now = Date.now();
      // Throttle resetting the timer to at most once per second for performance
      if (now - lastActive > 1000) {
        lastActive = now;
        resetTimer();
      }
    };

    // Initial setup
    resetTimer();

    events.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, []);

  return null;
}
