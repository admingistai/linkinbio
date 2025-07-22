import { ProfileData } from "./types";

export const profileData: ProfileData = {
  name: "Marques Brownlee",
  bio: "Quality Tech Videos • YouTuber • Geek • Consumer Electronics • Tech Head • Internet",
  avatar: "/Marques_Brownlee_cropped.jpg",
  latestVideo: {
    id: "latest-1",
    title: "The Triple Folding Phone Impressions!",
    thumbnail: "https://i.ytimg.com/vi/bMou1qUMHC4/maxresdefault.jpg",
    viewCount: 1234567,
    url: "https://www.youtube.com/watch?v=bMou1qUMHC4",
    duration: "12:34",
  },
  links: [
    {
      id: "1",
      title: "YouTube Channel",
      url: "https://youtube.com/@mkbhd",
      type: "video",
      description: "Tech reviews & more",
    },
    {
      id: "2",
      title: "Waveform Podcast",
      url: "https://podcasts.apple.com/us/podcast/waveform-the-mkbhd-podcast/id1474429475",
      type: "podcast",
      description: "Weekly tech podcast",
    },
    {
      id: "3",
      title: "Gear & Merch",
      url: "https://shop.mkbhd.com",
      type: "shop",
      description: "Official merchandise",
    },
    {
      id: "4",
      title: "Talk to Me",
      url: "#",
      type: "talk",
      description: "AI voice assistant",
    },
  ],
  socials: [
    {
      platform: "twitter",
      url: "https://twitter.com/mkbhd",
      username: "@mkbhd",
    },
    {
      platform: "youtube",
      url: "https://youtube.com/@mkbhd",
      username: "@mkbhd",
    },
    {
      platform: "instagram",
      url: "https://instagram.com/mkbhd",
      username: "@mkbhd",
    },
    {
      platform: "linkedin",
      url: "https://linkedin.com/in/mkbhd",
    },
  ],
  expandableSections: [
    {
      id: "more-links",
      title: "More Links",
      content: [
        {
          id: "5",
          title: "The Studio",
          url: "https://www.thestudio.com",
          type: "default",
        },
        {
          id: "6",
          title: "Auto Focus Car Channel",
          url: "https://youtube.com/@autofocus",
          type: "video",
        },
        {
          id: "7",
          title: "Threads",
          url: "https://threads.net/@mkbhd",
          type: "default",
        },
      ],
    },
  ],
};