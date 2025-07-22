import { LinkItem, LinkType } from "@/lib/types";
import { motion } from "framer-motion";
import { VideoPlayIcon, PodcastIcon, ShoppingBagIcon, MicrophoneIcon } from "./icons/UIIcons";
import { clsx } from "clsx";

interface EnhancedLinkButtonProps {
  link: LinkItem;
  index: number;
  onClick?: () => void;
  isLoading?: boolean;
}

const iconMap: Record<LinkType, React.ComponentType<{ className?: string }> | null> = {
  video: VideoPlayIcon,
  podcast: PodcastIcon,
  shop: ShoppingBagIcon,
  talk: MicrophoneIcon,
  default: null,
};

const styleMap: Record<LinkType, string> = {
  video: "hover:border-red-500/50 hover:bg-red-500/10 group-hover:text-red-500",
  podcast: "hover:border-purple-500/50 hover:bg-purple-500/10 group-hover:text-purple-500",
  shop: "hover:border-green-500/50 hover:bg-green-500/10 group-hover:text-green-500",
  talk: "bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 border-transparent hover:border-purple-500/50",
  default: "hover:border-primary/50 hover:bg-primary/10 group-hover:text-primary",
};

export default function EnhancedLinkButton({ link, index, onClick, isLoading }: EnhancedLinkButtonProps) {
  const Icon = iconMap[link.type];
  const isExternalLink = link.type !== "talk";
  const isDisabled = isLoading && link.type === "talk";

  const handleClick = (e: React.MouseEvent) => {
    if (!isExternalLink && onClick && !isDisabled) {
      e.preventDefault();
      onClick();
    }
  };

  const LoadingSpinner = () => (
    <svg className="animate-spin h-4 w-4 text-purple-400" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  const buttonContent = (
    <div
      className={clsx(
        "w-full border border-border rounded-lg px-4 py-3 transition-all duration-200 group flex items-center gap-3",
        styleMap[link.type],
        link.type === "talk" && "shadow-lg hover:shadow-xl",
        isDisabled && "opacity-75 cursor-not-allowed"
      )}
    >
      {isLoading && link.type === "talk" ? (
        <LoadingSpinner />
      ) : Icon ? (
        <Icon className={clsx(
          "w-5 h-5 transition-colors",
          link.type === "talk" && "text-purple-400"
        )} />
      ) : null}
      <div className="flex-1 text-left">
        <span className={clsx(
          "font-medium transition-colors",
          link.type === "talk" ? "text-white" : "text-foreground"
        )}>
          {isLoading && link.type === "talk" ? "Connecting..." : link.title}
        </span>
        {link.description && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {link.description}
          </p>
        )}
      </div>
    </div>
  );

  const motionProps = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { 
      delay: index * 0.1 + 0.3, 
      duration: 0.5,
      type: "spring",
      stiffness: 260,
      damping: 20
    },
    whileHover: { scale: 1.02, y: -2 },
    whileTap: { scale: 0.98 },
  };

  if (isExternalLink) {
    return (
      <motion.a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full"
        onClick={handleClick}
        {...motionProps}
      >
        {buttonContent}
      </motion.a>
    );
  }

  return (
    <motion.button
      className="block w-full text-left"
      onClick={handleClick}
      {...motionProps}
    >
      {buttonContent}
    </motion.button>
  );
}