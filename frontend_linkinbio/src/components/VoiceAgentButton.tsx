import { motion } from "framer-motion";
import { useState } from "react";

interface VoiceAgentButtonProps {
  onClick?: () => void;
}

export default function VoiceAgentButton({ onClick }: VoiceAgentButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      className="fixed bottom-8 right-8 w-14 h-14 bg-primary hover:bg-primary/90 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 group"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      aria-label="Voice Assistant"
    >
      <svg
        className="w-6 h-6 text-primary-foreground"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
        />
      </svg>
      
      {/* Pulse animation */}
      <motion.div
        className="absolute inset-0 bg-primary rounded-full"
        initial={{ scale: 1, opacity: 0.4 }}
        animate={isHovered ? { scale: 1.5, opacity: 0 } : {}}
        transition={{ duration: 1, repeat: isHovered ? Infinity : 0 }}
      />
      
      {/* Tooltip */}
      <motion.div
        className="absolute bottom-full mb-2 px-3 py-1 bg-foreground text-background text-sm rounded-md whitespace-nowrap pointer-events-none"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
        transition={{ duration: 0.2 }}
      >
        Voice Assistant (Coming Soon)
      </motion.div>
    </motion.button>
  );
}