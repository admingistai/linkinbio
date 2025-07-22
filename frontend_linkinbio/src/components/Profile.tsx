import Image from "next/image";
import { ProfileData } from "@/lib/types";
import {
  TwitterIcon,
  GitHubIcon,
  LinkedInIcon,
  InstagramIcon,
  YouTubeIcon,
} from "./icons/SocialIcons";

interface ProfileProps {
  profile: ProfileData;
}

const iconMap = {
  twitter: TwitterIcon,
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  instagram: InstagramIcon,
  youtube: YouTubeIcon,
};

export default function Profile({ profile }: ProfileProps) {
  return (
    <div className="max-w-xl mx-auto p-4 md:p-6 mb-6 md:mb-8 relative">
      <div className="flex items-center gap-4 animate-fade-in">
        {/* Avatar */}
        <div className="relative w-12 h-12 md:w-[60px] md:h-[60px] flex-shrink-0">
          <Image
            src={profile.avatar}
            alt={profile.name}
            width={60}
            height={60}
            className="rounded-full object-cover w-full h-full border-2 border-white"
            priority
          />
        </div>
        
        {/* Profile Info */}
        <div className="flex-1 min-w-0 pr-[120px] md:pr-[140px]">
          <h1 className="text-xl md:text-2xl font-bold text-foreground truncate">
            {profile.name}
          </h1>
          <p className="text-sm leading-tight mt-1" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            {profile.bio}
          </p>
        </div>
      </div>
      
      {/* Social Icons - Top Right */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6 flex items-center gap-3 z-10">
        {profile.socials.map((social) => {
          const Icon = iconMap[social.platform];
          return (
            <a
              key={social.platform}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors duration-200 hover:scale-110 transform"
              aria-label={`Visit ${social.platform}`}
            >
              <Icon className="w-6 h-6" />
            </a>
          );
        })}
      </div>
    </div>
  );
}