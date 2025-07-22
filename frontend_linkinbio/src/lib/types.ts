export type LinkType = "video" | "podcast" | "shop" | "talk" | "default";

export interface ProfileData {
  name: string;
  bio: string;
  avatar: string;
  links: LinkItem[];
  socials: SocialLink[];
  latestVideo?: LatestVideo;
  expandableSections?: ExpandableSection[];
}

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  type: LinkType;
  icon?: string;
  description?: string;
}

export interface SocialLink {
  platform: "twitter" | "github" | "linkedin" | "instagram" | "youtube";
  url: string;
  username?: string;
}

export interface LatestVideo {
  id: string;
  title: string;
  thumbnail: string;
  viewCount: number;
  url: string;
  duration?: string;
}

export interface ExpandableSection {
  id: string;
  title: string;
  content: LinkItem[];
  defaultExpanded?: boolean;
}

// Voice integration types
export interface Voice {
  id: string;
  name: string;
  description?: string;
  language?: string;
}

export interface TokenResult {
  identity: string;
  accessToken: string;
}