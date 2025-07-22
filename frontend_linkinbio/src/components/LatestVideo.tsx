import Image from "next/image";
import { motion } from "framer-motion";
import { LatestVideo as LatestVideoType } from "@/lib/types";
import { PlayButtonIcon } from "./icons/UIIcons";

interface LatestVideoProps {
  video: LatestVideoType;
}

export default function LatestVideo({ video }: LatestVideoProps) {
  const formatViewCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M views`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}K views`;
    }
    return `${count} views`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full"
    >
      <h2 className="text-sm font-medium text-muted-foreground mb-3">Latest Video</h2>
      <a
        href={video.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block group"
      >
        <div className="relative rounded-lg overflow-hidden bg-secondary aspect-video">
          <Image
            src={video.thumbnail}
            alt={video.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 400px"
          />
          <motion.div
            className="absolute inset-0 bg-black/20 flex items-center justify-center"
            whileHover={{ backgroundColor: "rgba(0,0,0,0.4)" }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <PlayButtonIcon className="w-16 h-16" />
            </motion.div>
          </motion.div>
          {video.duration && (
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
              {video.duration}
            </div>
          )}
        </div>
        <div className="mt-3 space-y-1">
          <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {video.title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {formatViewCount(video.viewCount)}
          </p>
        </div>
      </a>
    </motion.div>
  );
}