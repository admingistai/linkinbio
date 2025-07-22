import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle } from "lucide-react";
import { useVoiceAssistant, useLocalParticipant, useRoomInfo, useConnectionState } from "@livekit/components-react";
import { ConnectionState } from "livekit-client";
import { useEffect, useState, useCallback } from "react";
import { useMultibandTrackVolume } from "@/hooks/useTrackVolume";
import { AgentMultibandAudioVisualizer } from "@/components/visualization/AgentMultibandAudioVisualizer";
import VoiceSelector from "@/components/VoiceSelector";

interface VoiceAgentOverlayProps {
  onClose: () => void;
}

interface Voice {
  id: string;
  user_id: string | null;
  is_public: boolean;
  name: string;
  description: string;
  created_at: Date;
  embedding: number[];
}

export default function VoiceAgentOverlay({ onClose }: VoiceAgentOverlayProps) {
  const { agent, state, agentAttributes, audioTrack: agentAudioTrack } = useVoiceAssistant();
  const { localParticipant } = useLocalParticipant();
  const roomInfo = useRoomInfo();
  const roomState = useConnectionState();
  
  // Voice state management
  const [voices, setVoices] = useState<Voice[]>([]);
  const [currentVoiceId, setCurrentVoiceId] = useState<string>("");
  const [connectionTimeout, setConnectionTimeout] = useState(false);
  
  // Agent readiness check (using correct property from working frontend)
  const isAgentReady = agentAudioTrack !== undefined;
  const isLoading = roomState === ConnectionState.Connected && !isAgentReady;
  
  // Connection timeout handler
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setConnectionTimeout(true);
      }, 30000); // 30 second timeout
      
      return () => clearTimeout(timer);
    } else {
      setConnectionTimeout(false);
    }
  }, [isLoading]);
  
  // Enable microphone when connected and prevent scroll
  useEffect(() => {
    if (roomState === ConnectionState.Connected) {
      localParticipant.setMicrophoneEnabled(true);
    }
  }, [localParticipant, roomState]);

  // Prevent body scroll when overlay is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, []);
  
  // Load voices from agent attributes
  useEffect(() => {
    if (agentAttributes?.voices) {
      try {
        const parsedVoices = JSON.parse(agentAttributes.voices);
        setVoices(parsedVoices);
      } catch (e) {
        console.error("Failed to parse voices:", e);
      }
    }
  }, [agentAttributes?.voices]);
  
  // Load saved voice from localStorage
  useEffect(() => {
    const savedVoiceId = localStorage.getItem("selectedVoiceId");
    if (savedVoiceId) {
      setCurrentVoiceId(savedVoiceId);
    }
  }, []);
  
  // Handle voice selection
  const onSelectVoice = useCallback(
    (voiceId: string) => {
      setCurrentVoiceId(voiceId);
      localStorage.setItem("selectedVoiceId", voiceId);
      localParticipant.setAttributes({
        voice: voiceId,
      });
    },
    [localParticipant]
  );
  
  // Get agent audio track for visualization (FIXED: added .publication)
  console.log("🎵 Debug - agentAudioTrack:", agentAudioTrack);
  console.log("🎵 Debug - agentAudioTrack?.publication?.track:", agentAudioTrack?.publication?.track);
  
  const frequencies = useMultibandTrackVolume(agentAudioTrack?.publication?.track, 5);
  console.log("🎵 Debug - frequencies from useMultibandTrackVolume:", frequencies);

  // Convert Float32Array to number array for visualization
  const frequencyArrays = frequencies.map(band => Array.from(band));
  console.log("🎵 Debug - frequencyArrays after conversion:", frequencyArrays);
  
  // Add default volumes like main frontend (ensures bars always show)
  const defaultVolumes = Array.from({ length: 5 }, () => [0.01]); // Small positive values for visible bars
  const safeFrequencyArrays = frequencyArrays.length > 0 && frequencyArrays.some(arr => arr.length > 0) 
    ? frequencyArrays 
    : defaultVolumes;
  console.log("🎵 Debug - safeFrequencyArrays (final data):", safeFrequencyArrays);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center"
      >
        {/* Voice selector */}
        <VoiceSelector
          voices={voices}
          currentVoiceId={currentVoiceId}
          onSelectVoice={onSelectVoice}
        />
        
        {/* Close button - Mobile optimized */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:top-6 md:right-6 p-4 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 transition-colors touch-manipulation"
          style={{ minWidth: '44px', minHeight: '44px' }}
          aria-label="Close voice agent"
        >
          <X className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center gap-6 md:gap-8 p-6 md:p-8 w-full max-w-sm">
          {/* State indicator */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-white/70 text-sm md:text-base font-medium tracking-wide uppercase text-center"
          >
            {connectionTimeout && (
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle className="w-4 h-4" />
                Connection timeout
              </div>
            )}
            {!connectionTimeout && roomState === ConnectionState.Connecting && "Connecting..."}
            {!connectionTimeout && isLoading && "Initializing..."}
            {!connectionTimeout && state === "listening" && isAgentReady && "Listening..."}
            {!connectionTimeout && state === "thinking" && isAgentReady && "Thinking..."}
            {!connectionTimeout && state === "speaking" && isAgentReady && "Speaking..."}
            {state === "disconnected" && "Disconnected"}
          </motion.div>

          {/* Audio Visualizer - Mobile optimized */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="relative"
          >
            <AgentMultibandAudioVisualizer
              state={state}
              barWidth={6} // Smaller for mobile
              minBarHeight={16} // Smaller for mobile
              maxBarHeight={80} // Smaller for mobile
              frequencies={safeFrequencyArrays} // Now using safe default data
              gap={4} // Tighter spacing for mobile
              accentColor="rgb(139, 92, 246)" // Purple gradient theme
            />
            
            {/* Enhanced glow effect */}
            {(state === "listening" || state === "speaking" || state === "thinking") && isAgentReady && (
              <div className="absolute inset-0 blur-xl opacity-20 pointer-events-none">
                <AgentMultibandAudioVisualizer
                  state={state}
                  barWidth={6}
                  minBarHeight={16}
                  maxBarHeight={80}
                  frequencies={safeFrequencyArrays} // Now using safe default data
                  gap={4}
                  accentColor="rgb(139, 92, 246)"
                />
              </div>
            )}
          </motion.div>

          {/* Agent name */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-white text-lg md:text-xl font-semibold text-center"
          >
            Talk to Marques
          </motion.div>

          {/* Instructions */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/50 text-xs md:text-sm text-center max-w-xs px-2"
          >
            {connectionTimeout && (
              <div className="text-red-400">
                Connection failed. Please try again or check your network connection.
              </div>
            )}
            {!connectionTimeout && roomState === ConnectionState.Connecting && "Setting up the voice connection..."}
            {!connectionTimeout && isLoading && "Waiting for voice agent to join..."}
            {!connectionTimeout && state === "listening" && isAgentReady && "Say something to start a conversation"}
            {!connectionTimeout && state === "thinking" && isAgentReady && "Processing your request..."}
            {!connectionTimeout && state === "speaking" && isAgentReady && "Listen to the response"}
            
            {/* Retry button for timeout */}
            {connectionTimeout && (
              <button
                onClick={() => {
                  setConnectionTimeout(false);
                  window.location.reload(); // Simple retry by refreshing
                }}
                className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
              >
                Retry Connection
              </button>
            )}
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}