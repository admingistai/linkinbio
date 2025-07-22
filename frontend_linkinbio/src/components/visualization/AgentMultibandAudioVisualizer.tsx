import { AgentState } from "@livekit/components-react";
import { useEffect, useState } from "react";

type AgentMultibandAudioVisualizerProps = {
  state: AgentState;
  barWidth: number;
  minBarHeight: number;
  maxBarHeight: number;
  frequencies: Float32Array[] | number[][];
  gap: number;
  accentColor?: string;
};

export const AgentMultibandAudioVisualizer = ({
  state,
  barWidth,
  minBarHeight,
  maxBarHeight,
  frequencies,
  gap,
  accentColor = "rgb(139, 92, 246)", // Purple default for mobile
}: AgentMultibandAudioVisualizerProps) => {
  console.log("🎨 AgentMultibandAudioVisualizer - Rendering with props:", {
    state,
    barWidth,
    minBarHeight,
    maxBarHeight,
    frequencies,
    gap,
    accentColor
  });

  const summedFrequencies = frequencies.map((bandFrequencies) => {
    const sum = (bandFrequencies as number[]).reduce((a, b) => a + b, 0);
    return Math.sqrt(sum / bandFrequencies.length);
  });

  console.log("🎨 AgentMultibandAudioVisualizer - summedFrequencies:", summedFrequencies);

  const [thinkingIndex, setThinkingIndex] = useState(
    Math.floor(summedFrequencies.length / 2)
  );
  const [thinkingDirection, setThinkingDirection] = useState<"left" | "right">(
    "right"
  );

  useEffect(() => {
    if (state !== "thinking") {
      setThinkingIndex(Math.floor(summedFrequencies.length / 2));
      return;
    }
    const timeout = setTimeout(() => {
      if (thinkingDirection === "right") {
        if (thinkingIndex === summedFrequencies.length - 1) {
          setThinkingDirection("left");
          setThinkingIndex((prev) => prev - 1);
        } else {
          setThinkingIndex((prev) => prev + 1);
        }
      } else {
        if (thinkingIndex === 0) {
          setThinkingDirection("right");
          setThinkingIndex((prev) => prev + 1);
        } else {
          setThinkingIndex((prev) => prev - 1);
        }
      }
    }, 150); // Slightly faster for mobile

    return () => clearTimeout(timeout);
  }, [state, summedFrequencies.length, thinkingDirection, thinkingIndex]);

  return (
    <div
      className={`${
        state === "disconnected" ? "opacity-10" : ""
      } flex flex-row items-center justify-center`}
      style={{
        gap: gap + "px",
        willChange: "transform", // GPU acceleration
      }}
    >
      {summedFrequencies.map((frequency, index) => {
        const isCenter = index === Math.floor(summedFrequencies.length / 2);
        const isThinkingActive = state === "thinking" && index === thinkingIndex;
        
        // Enhanced height calculation with mobile optimization
        const baseHeight = minBarHeight + frequency * (maxBarHeight - minBarHeight);
        const thinkingBoost = isThinkingActive ? baseHeight * 0.3 : 0;
        const finalHeight = Math.min(baseHeight + thinkingBoost, maxBarHeight);
        
        console.log(`🎨 Bar ${index}: frequency=${frequency}, baseHeight=${baseHeight}, finalHeight=${finalHeight}, isCenter=${isCenter}, isThinkingActive=${isThinkingActive}`);
        
        return (
          <div
            className={`transition-all duration-200 ease-out rounded-full ${
              isCenter && state === "listening" ? "animate-pulse" : ""
            }`}
            key={"frequency-" + index}
            style={{
              height: finalHeight + "px",
              width: barWidth + "px",
              backgroundColor: accentColor,
              willChange: "height, background-color",
              boxShadow: (state === "listening" && isCenter) || isThinkingActive 
                ? `0 0 ${barWidth * 2}px ${accentColor}40` 
                : "none",
              transform: `translateZ(0)`, // Force GPU layer
            }}
          />
        );
      })}
    </div>
  );
};