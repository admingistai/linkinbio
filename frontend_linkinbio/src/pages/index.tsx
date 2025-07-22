import Head from "next/head";
import { useState, useCallback, useEffect } from "react";
import { ConnectionProvider, useConnection } from "@/hooks/useConnection";
import Profile from "@/components/Profile";
import SocialLinks from "@/components/SocialLinks";
import LinkGrid from "@/components/LinkGrid";
import LatestVideo from "@/components/LatestVideo";
import ExpandableSection from "@/components/ExpandableSection";
import VoiceAgentButton from "@/components/VoiceAgentButton";
import VoiceAgentOverlay from "@/components/VoiceAgentOverlay";
import Toast, { ToastType } from "@/components/Toast";
import { profileData } from "@/lib/profileData";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  StartAudio,
} from "@livekit/components-react";

export default function Home() {
  return (
    <ConnectionProvider>
      <HomeInner />
    </ConnectionProvider>
  );
}

function HomeInner() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [toastMessage, setToastMessage] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);
  
  const { shouldConnect, wsUrl, token, connect, disconnect } = useConnection();

  const handleVoiceClick = useCallback(async () => {
    try {
      setIsConnecting(true);
      if (shouldConnect) {
        await disconnect();
      } else {
        await connect();
      }
    } catch (error) {
      setToastMessage({
        message: error instanceof Error ? error.message : "Failed to connect",
        type: "error",
      });
      setIsConnecting(false);
    }
  }, [shouldConnect, connect, disconnect]);

  const pageContent = (
    <>
      <Head>
        <title>{`${profileData.name} - Links`}</title>
        <meta name="description" content={profileData.bio} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-background relative overflow-hidden">
        {/* Toast Notifications */}
        {toastMessage && (
          <Toast
            message={toastMessage.message}
            type={toastMessage.type}
            onDismiss={() => setToastMessage(null)}
          />
        )}

        {/* Background gradient */}
        <div className="absolute inset-0 gradient-background" />
        
        {/* Content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md space-y-8">
            {/* Profile Section */}
            <Profile profile={profileData} />
            
            {/* Social Links */}
            <SocialLinks socials={profileData.socials} />
            
            {/* Latest Video */}
            {profileData.latestVideo && (
              <LatestVideo video={profileData.latestVideo} />
            )}
            
            {/* Link Grid */}
            <LinkGrid 
              links={profileData.links} 
              onTalkClick={handleVoiceClick}
              isConnecting={isConnecting}
            />
            
            {/* Expandable Sections */}
            {profileData.expandableSections && profileData.expandableSections.map((section) => (
              <ExpandableSection
                key={section.id}
                section={section}
                onTalkClick={handleVoiceClick}
              />
            ))}
          </div>
        </div>
        
        {/* Voice Agent Button - Hidden when we have Talk to Me in the grid */}
        {/* <VoiceAgentButton onClick={handleVoiceClick} /> */}
      </main>
    </>
  );

  // Set connecting state based on connection status
  useEffect(() => {
    if (shouldConnect && token) {
      setIsConnecting(false);
    }
  }, [shouldConnect, token]);

  // If we're connected, wrap in LiveKitRoom
  if (shouldConnect && wsUrl && token) {
    return (
      <LiveKitRoom
        serverUrl={wsUrl}
        token={token}
        connect={shouldConnect}
        onError={(error) => {
          setToastMessage({
            message: error.message || "Connection error",
            type: "error",
          });
          disconnect();
        }}
      >
        {pageContent}
        <VoiceAgentOverlay onClose={disconnect} />
        <RoomAudioRenderer />
        <StartAudio label="Click to enable audio playback" />
      </LiveKitRoom>
    );
  }

  // Otherwise, just render the page content
  return pageContent;
}