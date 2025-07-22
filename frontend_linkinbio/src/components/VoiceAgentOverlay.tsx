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
  
  // Load saved voice from localStorage (but allow Carson override)
  useEffect(() => {
    const savedVoiceId = localStorage.getItem("selectedVoiceId");
    console.log("💾 Checking localStorage for saved voice:", savedVoiceId);
    
    if (savedVoiceId) {
      console.log("💾 Found saved voice in localStorage:", savedVoiceId);
      setCurrentVoiceId(savedVoiceId);
    } else {
      console.log("💾 No saved voice found in localStorage");
    }
  }, []);

  // Debug function to clear localStorage (for testing)
  const clearSavedVoice = () => {
    console.log("🗑️ Clearing saved voice from localStorage");
    localStorage.removeItem("selectedVoiceId");
    setCurrentVoiceId("");
    window.location.reload();
  };

  // Force set voice function for manual testing
  const forceSetVoice = (voiceId: string) => {
    console.log("🔧 Force setting voice:", voiceId);
    const voice = voices.find(v => v.id === voiceId);
    if (voice) {
      setCurrentVoiceId(voiceId);
      localStorage.setItem("selectedVoiceId", voiceId);
      localParticipant.setAttributes({
        voice: voiceId,
      });
      console.log("✅ Force set voice:", voice.name);
    } else {
      console.error("❌ Voice not found:", voiceId);
    }
  };

  // Expose debug functions to window for manual testing
  useEffect(() => {
    (window as any).clearSavedVoice = clearSavedVoice;
    (window as any).forceSetVoice = forceSetVoice;
    (window as any).listVoices = () => {
      console.log("🎤 Available voices:");
      voices.forEach((voice, index) => {
        console.log(`  ${index + 1}. "${voice.name}" (${voice.id})`);
      });
      return voices;
    };
    console.log("🔧 Debug commands available:");
    console.log("  - window.clearSavedVoice() - Clear localStorage and reload");
    console.log("  - window.forceSetVoice('voice-id') - Force set specific voice");
    console.log("  - window.listVoices() - List all available voices");
  }, [voices, clearSavedVoice, forceSetVoice]);

  // Set Carson as default voice when voices are available and participant is connected
  useEffect(() => {
    // Only proceed if we have voices, no current voice selected, and participant is connected
    if (voices.length > 0 && !currentVoiceId && roomState === ConnectionState.Connected && localParticipant) {
      console.log("🎤 Attempting to set Carson as default voice...");
      console.log("🎤 Available voices:", voices.map(v => `"${v.name}" (${v.id})`));
      console.log("🎤 Room state:", roomState);
      console.log("🎤 Current voice ID:", currentVoiceId);
      
      // Find Carson voice by name (try multiple variations in priority order)
      console.log("🔍 Searching for Carson voice...");
      
      // Priority 1: Exact Carson match
      let carsonVoice = voices.find(voice => {
        const name = voice.name.toLowerCase();
        return name.includes('carson');
      });
      
      if (carsonVoice) {
        console.log("✅ Found exact Carson voice:", carsonVoice.name);
      } else {
        console.log("⚠️ Carson voice not found, trying male voice patterns...");
        
        // Priority 2: Common male voice patterns
        const malePatterns = ['male', 'man', 'masculine', 'deep', 'bass', 'baritone', 'tenor'];
        
        for (const pattern of malePatterns) {
          carsonVoice = voices.find(voice => {
            const name = voice.name.toLowerCase();
            return name.includes(pattern);
          });
          
          if (carsonVoice) {
            console.log(`✅ Found male voice with pattern "${pattern}":`, carsonVoice.name);
            break;
          }
        }
      }
      
      // Priority 3: Fallback to first non-female voice
      if (!carsonVoice) {
        console.log("⚠️ No explicit male voice found, looking for non-female voices...");
        carsonVoice = voices.find(voice => {
          const name = voice.name.toLowerCase();
          return !name.includes('female') && !name.includes('woman') && !name.includes('girl') && !name.includes('lady');
        });
        
        if (carsonVoice) {
          console.log("✅ Found non-female voice:", carsonVoice.name);
        }
      }
      
      if (carsonVoice) {
        console.log("✅ Found Carson voice:", carsonVoice);
        
        // Set the voice with proper error handling
        try {
          setCurrentVoiceId(carsonVoice.id);
          localStorage.setItem("selectedVoiceId", carsonVoice.id);
          
          // Set participant attributes with error handling
          localParticipant.setAttributes({
            voice: carsonVoice.id,
          });
          
          console.log("✅ Successfully set Carson as default voice");
        } catch (error) {
          console.error("❌ Error setting Carson voice:", error);
        }
      } else {
        console.warn("⚠️ Carson voice not found. Available voices:");
        voices.forEach((voice, index) => {
          console.warn(`  ${index + 1}. "${voice.name}" (${voice.id})`);
        });
        
        // Last resort: Use first available voice (even if female) to ensure something is set
        if (!carsonVoice && voices.length > 0) {
          console.log("🆘 No male voice found, using first available voice as last resort");
          carsonVoice = voices[0];
          console.log("🆘 Last resort voice:", carsonVoice.name);
        }
        
        // If still no voice, show detailed error
        if (!carsonVoice) {
          console.error("❌ CRITICAL: No voices available at all!");
          console.error("❌ Voice list was:", voices);
          return;
        }
        
        // Set the selected voice (Carson or fallback)
        console.log("🔄 Setting voice:", carsonVoice.name, carsonVoice.id);
        try {
          setCurrentVoiceId(carsonVoice.id);
          localStorage.setItem("selectedVoiceId", carsonVoice.id);
          localParticipant.setAttributes({
            voice: carsonVoice.id,
          });
          console.log("✅ Successfully set voice:", carsonVoice.name);
        } catch (error) {
          console.error("❌ Error setting voice:", error);
        }
      }
    } else {
      console.log("🎤 Waiting for conditions:", {
        hasVoices: voices.length > 0,
        noCurrentVoice: !currentVoiceId,
        isConnected: roomState === ConnectionState.Connected,
        hasParticipant: !!localParticipant
      });
    }
  }, [voices, currentVoiceId, roomState, localParticipant]);
  
  // Handle voice selection
  const onSelectVoice = useCallback(
    (voiceId: string) => {
      console.log("🎤 Manual voice selection:", voiceId);
      const selectedVoice = voices.find(v => v.id === voiceId);
      console.log("🎤 Selected voice details:", selectedVoice);
      
      try {
        setCurrentVoiceId(voiceId);
        localStorage.setItem("selectedVoiceId", voiceId);
        localParticipant.setAttributes({
          voice: voiceId,
        });
        console.log("✅ Voice selection successful");
      } catch (error) {
        console.error("❌ Error in voice selection:", error);
      }
    },
    [localParticipant, voices]
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

        {/* Content - Redesigned with separate sections */}
        <div className="flex flex-col h-full w-full max-w-2xl mx-auto">
          {/* Top Section - Status and Agent Name */}
          <div className="flex-none p-6 md:p-8 text-center">
            {/* Agent name */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-white text-2xl md:text-3xl font-bold mb-4"
            >
              Talk to Marques
            </motion.div>

            {/* State indicator */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-white/70 text-sm md:text-base font-medium tracking-wide uppercase"
            >
              {connectionTimeout && (
                <div className="flex items-center justify-center gap-2 text-red-400">
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
          </div>

          {/* Center Section - Audio Visualizer (Dedicated Space) */}
          <div className="flex-1 flex items-center justify-center min-h-[200px] px-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="relative"
            >
              <AgentMultibandAudioVisualizer
                state={state}
                barWidth={8} // Slightly larger for better visibility
                minBarHeight={24} // Increased minimum height
                maxBarHeight={120} // Increased maximum height
                frequencies={safeFrequencyArrays}
                gap={6} // Better spacing
                accentColor="rgb(139, 92, 246)"
              />
              
              {/* Enhanced glow effect */}
              {(state === "listening" || state === "speaking" || state === "thinking") && isAgentReady && (
                <div className="absolute inset-0 blur-xl opacity-30 pointer-events-none">
                  <AgentMultibandAudioVisualizer
                    state={state}
                    barWidth={8}
                    minBarHeight={24}
                    maxBarHeight={120}
                    frequencies={safeFrequencyArrays}
                    gap={6}
                    accentColor="rgb(139, 92, 246)"
                  />
                </div>
              )}

              {/* Subtle background circle for visual appeal */}
              <div className="absolute inset-0 -z-10">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-sm border border-white/5"></div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Section - Instructions */}
          <div className="flex-none p-6 md:p-8 text-center">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/60 text-sm md:text-base max-w-md mx-auto leading-relaxed"
            >
              {connectionTimeout && (
                <div className="text-red-400 space-y-4">
                  <div>Connection failed. Please try again or check your network connection.</div>
                  <button
                    onClick={() => {
                      setConnectionTimeout(false);
                      window.location.reload();
                    }}
                    className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors text-sm font-medium"
                  >
                    Retry Connection
                  </button>
                </div>
              )}
              {!connectionTimeout && roomState === ConnectionState.Connecting && "Setting up the voice connection..."}
              {!connectionTimeout && isLoading && "Waiting for voice agent to join..."}
              {!connectionTimeout && state === "listening" && isAgentReady && "Say something to start a conversation"}
              {!connectionTimeout && state === "thinking" && isAgentReady && "Processing your request..."}
              {!connectionTimeout && state === "speaking" && isAgentReady && "Listen to the response"}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}