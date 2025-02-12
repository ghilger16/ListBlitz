import React, { useState, useEffect, useRef, useMemo } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import Svg, { G, Path } from "react-native-svg";
import * as d3 from "d3-shape";
import LottieView from "lottie-react-native";
import * as Styled from "./ChillCounter.styled";
import { FlashingText } from "@Components";
import { useGetIcons } from "@Services";
import { Audio } from "expo-av"; // Import Audio from expo-av

// Constants
const RADIUS = 160;
const INNER_RADIUS = 110;
const BORDER_RADIUS = 175;
const CENTER_RADIUS = 60; // Slightly larger to fit Lottie
const SECTIONS_COUNT = 5; // Total sections

// Colors
export const COLORS = ["#f6c212", "#f4770c"]; // Gradient for filled arc

interface IGameplayCounterProps {
  score: number;
  currentPlayerIndex: number; // <-- Determines icon
  onIncrement: () => void;
  onStart: () => void;
}

export const ChillCounter: React.FC<IGameplayCounterProps> = ({
  score,
  currentPlayerIndex,
  onIncrement,
  onStart,
}) => {
  const { data: ICONS = [] } = useGetIcons();
  const [fillAngle, setFillAngle] = useState(0);
  const [isPlayerStartVisible, setIsPlayerStartVisible] = useState(true); // State to control text visibility
  const lottieRef = useRef<LottieView>(null); // Ref for Lottie animation
  const soundRef = useRef<Audio.Sound | null>(null); // Ref for sound effect

  // Ensure we always get a valid icon index (cycling within available icons)
  const iconIndex = currentPlayerIndex % ICONS.length;

  // Load the sound effect
  useEffect(() => {
    const loadSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require("@Assets/sounds/tap.mp3")
      );
      soundRef.current = sound;
    };

    loadSound();

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    };
  }, []);

  // Play the sound effect
  const playSound = async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.replayAsync();
      } catch (error) {
        console.error("Error playing sound:", error);
      }
    }
  };

  // Update the arc fill angle based on the score
  useEffect(() => {
    const percentage = Math.min(score / SECTIONS_COUNT, 1); // Max 100%
    setFillAngle(percentage * Math.PI); // Convert to radians (half-circle)
  }, [score]);

  // Arc generator for dynamic fill
  const arcGenerator = useMemo(
    () =>
      d3
        .arc()
        .innerRadius(INNER_RADIUS)
        .outerRadius(RADIUS)
        .startAngle(-Math.PI / 2)
        .endAngle(-Math.PI / 2 + fillAngle),
    [fillAngle]
  );

  // Adjust the arc generator to create a gap in the middle of the donut
  const borderArcGenerator = useMemo(() => {
    const gap = 0.15; // Adjust this value to control the size of the gap

    // First arc section: before the gap
    const arc1 = d3
      .arc()
      .innerRadius(RADIUS + 10)
      .outerRadius(BORDER_RADIUS)
      .startAngle(-Math.PI / 2)
      .endAngle(-Math.PI / 2 + Math.PI / 2 - gap); // Ends before the gap

    // Second arc section: after the gap
    const arc2 = d3
      .arc()
      .innerRadius(RADIUS + 10)
      .outerRadius(BORDER_RADIUS)
      .startAngle(-Math.PI / 2 + Math.PI / 2 + gap) // Starts after the gap
      .endAngle(Math.PI / 2); // Ends at the top

    return [arc1, arc2];
  }, []);

  // Section generator for each slice's outline
  const sectionArcGenerator = useMemo(
    () => (index: number) => {
      const startAngle = -Math.PI / 2 + (Math.PI / SECTIONS_COUNT) * index;
      const endAngle = -Math.PI / 2 + (Math.PI / SECTIONS_COUNT) * (index + 1);

      return d3
        .arc()
        .innerRadius(INNER_RADIUS)
        .outerRadius(RADIUS)
        .startAngle(startAngle)
        .endAngle(endAngle);
    },
    []
  );

  // Handle tap (increment score and play sound)
  const handleIncrement = () => {
    playSound(); // Play the tap sound
    onIncrement(); // Increment the score
  };

  // Hide "Player Start" text when score > 0
  useEffect(() => {
    if (score > 0) {
      setIsPlayerStartVisible(false); // Hide the player start text
    }
  }, [score]);

  return (
    <Styled.Container>
      {/* SVG Donut */}
      <Svg width={RADIUS * 2 + 40} height={RADIUS + 120}>
        <G x={RADIUS + 20} y={RADIUS + 20}>
          {/* Outer Border */}
          <Styled.Score>{score}</Styled.Score>
          <Path
            d={borderArcGenerator[0]({} as any) || ""}
            fill="none"
            stroke="#f6c212"
            strokeWidth={5}
          />
          <Path
            d={borderArcGenerator[1]({} as any) || ""}
            fill="none"
            stroke="#f6c212"
            strokeWidth={5}
          />
          {/* Dynamic Fill */}
          <Path d={arcGenerator({} as any) || ""} fill={COLORS[1]} />

          {/* Section Outlines */}
          {Array.from({ length: SECTIONS_COUNT }).map((_, index) => (
            <Path
              key={index}
              d={sectionArcGenerator(index)({} as any)}
              fill="none"
              stroke="#fff"
              strokeWidth={2}
            />
          ))}
        </G>
      </Svg>

      {/* Tapable Circle Button (Lottie replaces button) */}
      <TouchableOpacity
        onPress={handleIncrement} // Only increment score
        style={{
          position: "absolute",
          width: CENTER_RADIUS * 2,
          height: CENTER_RADIUS * 2,
          borderRadius: CENTER_RADIUS,
          alignItems: "center",
          justifyContent: "center",
          top: RADIUS - CENTER_RADIUS + 10,
          borderWidth: 5,
          borderColor: "#f6c212",
          backgroundColor: "#fff",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 5,
        }}
      >
        <LottieView
          ref={lottieRef}
          source={ICONS[iconIndex] ?? ICONS[0]} // Based on player, not score
          autoPlay
          loop={false} // Only play when tapped
          style={{
            width: CENTER_RADIUS * 2,
            height: CENTER_RADIUS * 2,
          }}
        />
      </TouchableOpacity>

      {/* Show "Player Start" text if score is 0 */}
      {isPlayerStartVisible && (
        <Styled.TextWrapper>
          <FlashingText>Tap to Score</FlashingText>
        </Styled.TextWrapper>
      )}
    </Styled.Container>
  );
};
