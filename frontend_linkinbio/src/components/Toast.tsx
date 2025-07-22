import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

export type ToastType = "error" | "success" | "info";

interface ToastProps {
  message: string;
  type: ToastType;
  onDismiss: () => void;
}

export default function Toast({ message, type, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const bgColor = {
    error: "bg-red-500",
    success: "bg-green-500",
    info: "bg-blue-500",
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
      >
        <div
          className={cn(
            "rounded-lg px-6 py-3 text-white shadow-lg flex items-center gap-3",
            bgColor[type]
          )}
        >
          <span className="text-sm font-medium">{message}</span>
          <button
            onClick={onDismiss}
            className="text-white/80 hover:text-white transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}