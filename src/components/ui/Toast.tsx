"use client";
import { useEffect } from "react";

type ToastProps = {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  message: string;
  durationMs?: number;
};

export function Toast({ open, onOpenChange, message, durationMs = 1500 }: ToastProps) {
  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => onOpenChange?.(false), durationMs);
    return () => clearTimeout(id);
  }, [open, onOpenChange, durationMs]);

  if (!open) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 rounded-md bg-black text-white dark:bg-white dark:text-black px-3 py-2 shadow-md text-sm"
    >
      {message}
    </div>
  );
}


