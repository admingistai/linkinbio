import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon } from "./icons/UIIcons";
import { ExpandableSection as ExpandableSectionType } from "@/lib/types";
import EnhancedLinkButton from "./EnhancedLinkButton";

interface ExpandableSectionProps {
  section: ExpandableSectionType;
  onTalkClick?: () => void;
}

export default function ExpandableSection({ section, onTalkClick }: ExpandableSectionProps) {
  const [isExpanded, setIsExpanded] = useState(section.defaultExpanded || false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="w-full"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-secondary/50 hover:bg-secondary/70 rounded-lg transition-colors"
      >
        <span className="font-medium text-foreground">{section.title}</span>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDownIcon className="w-5 h-5 text-muted-foreground" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-3 space-y-3">
              {section.content.map((link, index) => (
                <EnhancedLinkButton
                  key={link.id}
                  link={link}
                  index={index}
                  onClick={link.type === "talk" ? onTalkClick : undefined}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}