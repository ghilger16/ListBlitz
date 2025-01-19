import React, { useState, useEffect, useRef } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import Svg, { G, Path } from "react-native-svg";
import * as d3 from "d3-shape";
import LottieView from "lottie-react-native";
import * as Styled from "./ChillCounter.styled";

// Constants
const RADIUS = 160;
const INNER_RADIUS = 110;
const BORDER_RADIUS = 175;
const CENTER_RADIUS = 60; // Slightly larger to fit Lottie
const SECTIONS_COUNT = 5; // Total sections

// Colors
export const COLORS = ["#f6c212", "#f4770c"]; // Gradient for filled arc

// Lottie Icons Array (Each player gets a fixed icon)
const ICONS = [
  require("@Assets/icons/camera.json"),
  require("@Assets/icons/reel.json"),
  require("@Assets/icons/ticket.json"),
];

interface IGameplayCounterProps {
  isGameStarted: boolean;
  score: number;
  currentPlayerIndex: number; // <-- Determines icon
  onIncrement: () => void;
  onStart: () => void;
}

const ChillCounter: React.FC<IGameplayCounterProps> = ({
  isGameStarted,
  score,
  currentPlayerIndex,
  onIncrement,
  onStart,
}) => {
  const [fillAngle, setFillAngle] = useState(0);
  const [isPlayerStartVisible, setIsPlayerStartVisible] = useState(true); // State to control text visibility
  const lottieRef = useRef<LottieView>(null); // Ref for Lottie animation

  // Ensure we always get a valid icon index (cycling within available icons)
  const iconIndex = currentPlayerIndex % ICONS.length;

  // Update the arc fill angle based on the score
  useEffect(() => {
    const percentage = Math.min(score / SECTIONS_COUNT, 1); // Max 100%
    setFillAngle(percentage * Math.PI); // Convert to radians (half-circle)
  }, [score]);

  // Arc generator for dynamic fill
  const arcGenerator = d3
    .arc()
    .innerRadius(INNER_RADIUS)
    .outerRadius(RADIUS)
    .startAngle(-Math.PI / 2)
    .endAngle(-Math.PI / 2 + fillAngle); // Fill dynamically

  // Border ring generator
  const borderArcGenerator = d3
    .arc()
    .innerRadius(RADIUS + 10)
    .outerRadius(BORDER_RADIUS)
    .startAngle(-Math.PI / 2)
    .endAngle(Math.PI / 2); // Full half-circle border

  // Handle tap (restart animation & increment score)
  const handleIncrement = () => {
    if (lottieRef.current) {
      lottieRef.current.play(0); // Restart animation from the beginning
    }
    onIncrement();
  };

  // Hide "Player Start" text when game is started
  const handleStartGame = () => {
    setIsPlayerStartVisible(false); // Hide the player start text
    onStart();
  };

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      {/* SVG Donut */}
      <Svg width={RADIUS * 2 + 40} height={RADIUS + 120}>
        <G x={RADIUS + 20} y={RADIUS + 20}>
          {/* Outer Border */}
          <Path
            d={borderArcGenerator({} as any) || ""}
            fill="none"
            stroke="#fff"
            strokeWidth={5}
          />
          {/* Dynamic Fill */}
          <Path d={arcGenerator({} as any) || ""} fill={COLORS[1]} />
        </G>
      </Svg>

      {/* Tapable Circle Button (Lottie replaces button) */}
      <TouchableOpacity
        onPress={isGameStarted ? handleIncrement : handleStartGame} // Start game or increment score
        style={{
          position: "absolute",
          width: CENTER_RADIUS * 2,
          height: CENTER_RADIUS * 2,
          borderRadius: CENTER_RADIUS,
          alignItems: "center",
          justifyContent: "center",
          top: RADIUS - CENTER_RADIUS + 10,
          borderWidth: 5,
          borderColor: "#fff",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 5,
        }}
      >
        <LottieView
          ref={lottieRef}
          source={ICONS[iconIndex] ?? ICONS[0]} // <-- Now based on player, NOT score
          autoPlay
          loop={false} // Only play when tapped
          style={{
            width: CENTER_RADIUS * 2,
            height: CENTER_RADIUS * 2,
          }}
        />
        {!isPlayerStartVisible && (
          <Styled.PromptText>
            {"Player " + (currentPlayerIndex + 1) + " Start"}
          </Styled.PromptText>
        )}
      </TouchableOpacity>

      {/* Styled Player Start Text */}
    </View>
  );
};

export default ChillCounter;
