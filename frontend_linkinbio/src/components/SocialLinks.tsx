import { SocialLink } from "@/lib/types";
import {
  TwitterIcon,
  GitHubIcon,
  LinkedInIcon,
  InstagramIcon,
  YouTubeIcon,
} from "./icons/SocialIcons";

interface SocialLinksProps {
  socials: SocialLink[];
}

const iconMap = {
  twitter: TwitterIcon,
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  instagram: InstagramIcon,
  youtube: YouTubeIcon,
};

export default function SocialLinks({ socials }: SocialLinksProps) {
  return (
    <div className="flex items-center justify-center gap-4 animate-fade-in animation-delay-200">
      {socials.map((social) => {
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
  );
}