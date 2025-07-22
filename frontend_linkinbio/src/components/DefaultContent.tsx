import LatestVideo from "./LatestVideo";
import ExpandableSection from "./ExpandableSection";
import { ProfileData } from "@/lib/types";

interface DefaultContentProps {
  profileData: ProfileData;
  onTalkClick?: () => void;
}

export default function DefaultContent({ profileData, onTalkClick }: DefaultContentProps) {
  return (
    <div className="space-y-8 py-4">
      {/* Latest Video Section */}
      {profileData.latestVideo && (
        <LatestVideo video={profileData.latestVideo} />
      )}
      
      {/* Expandable Sections */}
      {profileData.expandableSections && profileData.expandableSections.map((section) => (
        <ExpandableSection
          key={section.id}
          section={section}
          onTalkClick={onTalkClick}
        />
      ))}
      
      {/* Placeholder for future content */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">Recent Activity</h3>
        <div className="space-y-3">
          <div className="p-4 bg-secondary/30 rounded-lg">
            <p className="text-sm text-muted-foreground">
              📹 Published "The Triple Folding Phone Impressions!" • 2 days ago
            </p>
          </div>
          <div className="p-4 bg-secondary/30 rounded-lg">
            <p className="text-sm text-muted-foreground">
              🎙️ New Waveform Podcast episode available • 5 days ago  
            </p>
          </div>
          <div className="p-4 bg-secondary/30 rounded-lg">
            <p className="text-sm text-muted-foreground">
              🛍️ Limited edition gear restocked • 1 week ago
            </p>
          </div>
        </div>
      </div>
      
      {/* Bottom spacing for comfortable scrolling */}
      <div className="h-8" />
    </div>
  );
}