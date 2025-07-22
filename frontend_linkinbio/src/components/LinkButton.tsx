import { LinkItem } from "@/lib/types";
import { motion } from "framer-motion";

interface LinkButtonProps {
  link: LinkItem;
  index: number;
}

export default function LinkButton({ link, index }: LinkButtonProps) {
  return (
    <motion.a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="w-full bg-secondary hover:bg-secondary/80 border border-border hover:border-primary/50 rounded-lg px-6 py-4 transition-all duration-200 group">
        <span className="text-foreground font-medium group-hover:text-primary transition-colors">
          {link.title}
        </span>
      </div>
    </motion.a>
  );
}