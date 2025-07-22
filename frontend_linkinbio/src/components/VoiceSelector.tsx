import { motion, AnimatePresence } from "framer-motion";
import { Settings, X } from "lucide-react";
import { useState } from "react";

interface Voice {
  id: string;
  user_id: string | null;
  is_public: boolean;
  name: string;
  description: string;
  created_at: Date;
  embedding: number[];
}

interface VoiceSelectorProps {
  voices: Voice[];
  currentVoiceId: string;
  onSelectVoice: (voiceId: string) => void;
}

export default function VoiceSelector({
  voices,
  currentVoiceId,
  onSelectVoice,
}: VoiceSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Settings button - Mobile optimized */}
      <button
        onClick={() => setIsOpen(true)}
        className="absolute top-4 left-4 md:top-6 md:left-6 p-4 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 transition-colors z-10 touch-manipulation"
        style={{ minWidth: '44px', minHeight: '44px' }}
        aria-label="Voice settings"
      >
        <Settings className="w-5 h-5 md:w-6 md:h-6 text-white" />
      </button>

      {/* Voice selection panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                damping: 30,
                stiffness: 300,
              }}
              className="fixed right-0 top-0 h-full bg-black/90 backdrop-blur-xl z-50 
                         w-full max-w-[80vw] md:max-w-sm border-l border-white/10"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <h2 className="text-white text-lg font-semibold">Select Voice</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    aria-label="Close voice selector"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>

                {/* Voice list */}
                <div className="flex-1 overflow-y-auto">
                  {voices.length > 0 ? (
                    <div className="p-4 space-y-2">
                      {voices.map((voice) => (
                        <button
                          key={voice.id}
                          onClick={() => {
                            onSelectVoice(voice.id);
                            setIsOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 min-h-[44px] rounded-lg transition-all
                            ${
                              voice.id === currentVoiceId
                                ? "bg-white text-black font-medium"
                                : "bg-white/5 text-white hover:bg-white/10"
                            }`}
                        >
                          <div className="font-medium">{voice.name}</div>
                          {voice.description && (
                            <div className="text-sm opacity-70 mt-0.5">
                              {voice.description}
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-white/50 text-center">
                      No voices available
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}