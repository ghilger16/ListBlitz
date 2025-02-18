import React, { useState, useEffect, useRef, useMemo } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import Svg, { G, Path } from "react-native-svg";
import * as d3 from "d3-shape";
import LottieView from "lottie-react-native";
import * as Styled from "./BlitzCounter.styled";
import { FlashingText } from "@Components";
import { useGetIcons } from "@Services";
import { Audio } from "expo-av"; // Import Audio from expo-av

// Constants
const RADIUS = 125;
const INNER_RADIUS = 80;
const BORDER_RADIUS = 140;
const CENTER_RADIUS = 60;
const SECTIONS_COUNT = 20;
const MISSING_ANGLE = Math.PI * 0.4; // 15% missing
const TOTAL_TIME = 10; // Countdown duration in seconds

// Colors
export const COLORS = ["#f6c212", "#f4770c"]; // Gradient for filled arc

interface IGameplayCounterProps {
  score: number;
  currentPlayerIndex: number;
  onIncrement: () => void;
  onStart: () => void;
  timer: number;
}

export const BlitzCounter: React.FC<IGameplayCounterProps> = ({
  score,
  currentPlayerIndex,
  onIncrement,
  onStart,
  timer,
}) => {
  const { data: ICONS = [] } = useGetIcons();
  const [fillAngle, setFillAngle] = useState(0);
  const [isPlayerStartVisible, setIsPlayerStartVisible] = useState(true);
  const lottieRef = useRef<LottieView>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  const iconIndex = currentPlayerIndex % ICONS.length;

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

  const playSound = async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.replayAsync();
      } catch (error) {
        console.error("Error playing sound:", error);
      }
    }
  };

  // Update fillAngle based on timer
  useEffect(() => {
    const timeElapsed = TOTAL_TIME - timer;
    const percentage = Math.min(timeElapsed / TOTAL_TIME, 1);
    setFillAngle(percentage * (Math.PI * 2 - MISSING_ANGLE));
  }, [timer]);

  // Arc generator for dynamic fill (based on timer)
  const arcGenerator = useMemo(
    () =>
      d3
        .arc()
        .innerRadius(INNER_RADIUS)
        .outerRadius(RADIUS)
        .startAngle(-Math.PI / 1 + MISSING_ANGLE / 2)
        .endAngle(-Math.PI / 1 + MISSING_ANGLE / 2 + fillAngle),
    [fillAngle]
  );

  // Border arc generator (single arc, 15% missing)
  const borderArcGenerator = useMemo(() => {
    return d3
      .arc()
      .innerRadius(RADIUS + 10)
      .outerRadius(BORDER_RADIUS)
      .startAngle(-Math.PI / 1 + MISSING_ANGLE / 2)
      .endAngle(Math.PI * 1 - MISSING_ANGLE / 2);
  }, []);

  // Section generator (slices for the outline, with 15% missing)
  const sectionArcGenerator = useMemo(
    () => (index: number) => {
      const totalAngle = Math.PI * 2 - MISSING_ANGLE;
      const startAngle =
        -Math.PI / 1 +
        MISSING_ANGLE / 2 +
        (totalAngle / SECTIONS_COUNT) * index;
      const endAngle = startAngle + totalAngle / SECTIONS_COUNT;

      return d3
        .arc()
        .innerRadius(INNER_RADIUS)
        .outerRadius(RADIUS)
        .startAngle(startAngle)
        .endAngle(endAngle);
    },
    []
  );

  const handleIncrement = () => {
    playSound();
    onIncrement();
  };

  useEffect(() => {
    if (score > 0) {
      setIsPlayerStartVisible(false);
    }
  }, [score]);

  return (
    <Styled.Container>
      {/* SVG Donut */}
      <Svg width={RADIUS * 2 + 40} height={RADIUS + 200}>
        <G x={RADIUS + 20} y={RADIUS + 20}>
          {/* Outer Border Arc (No Gaps) */}
          <Path
            d={borderArcGenerator({} as any) || ""}
            fill="none"
            stroke="#f6c212"
            strokeWidth={5}
          />

          {/* Dynamic Fill Arc */}
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

      {/* Timer Countdown Display in Center */}
      <TouchableOpacity
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: [{ translateX: -20 }, { translateY: 15 }],
        }}
        onPress={onStart}
      >
        <Text style={{ fontSize: 32, fontWeight: "bold", color: "#fff" }}>
          {timer}
        </Text>
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
