import Image from "next/image";
import { ProfileData } from "@/lib/types";

interface ProfileProps {
  profile: ProfileData;
}

export default function Profile({ profile }: ProfileProps) {
  return (
    <div className="flex flex-col items-center space-y-4 animate-fade-in">
      <div className="relative w-[120px] h-[120px]">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full animate-pulse" />
        <div className="absolute inset-[3px] bg-background rounded-full" />
        <Image
          src={profile.avatar}
          alt={profile.name}
          width={114}
          height={114}
          className="absolute inset-[3px] rounded-full object-cover"
          priority
        />
      </div>
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-foreground">{profile.name}</h1>
        <p className="text-muted-foreground text-sm max-w-xs mx-auto">
          {profile.bio}
        </p>
      </div>
    </div>
  );
}