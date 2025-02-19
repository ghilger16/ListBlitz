import React, { useState, useEffect, useRef, useMemo } from "react";
import { View, TouchableOpacity, Text, Animated } from "react-native";
import Svg, { G, Path } from "react-native-svg";
import * as d3 from "d3-shape";
import * as Styled from "./BlitzCounter.styled";
import { FlashingText } from "@Components";
import { useGetIcons } from "@Services";
import { Audio } from "expo-av";

// Constants
const RADIUS = 125;
const INNER_RADIUS = 80;
const BORDER_RADIUS = 140;
const CENTER_RADIUS = 60;
const MISSING_ANGLE = Math.PI * 0.4; // 15% missing
const TOTAL_TIME = 60; // Timer duration in seconds

export const BlitzCounter: React.FC = ({
  score,
  currentPlayerIndex,
  onIncrement,
  onStart,
  isGameStarted,
}) => {
  const [fillAngle, setFillAngle] = useState(
    Math.PI * 1 - MISSING_ANGLE / 2 // Start full
  );
  const [displayTime, setDisplayTime] = useState(TOTAL_TIME);

  const animatedTimer = useRef(new Animated.Value(TOTAL_TIME)).current;

  useEffect(() => {
    if (isGameStarted) {
      animatedTimer.setValue(TOTAL_TIME);
      Animated.timing(animatedTimer, {
        toValue: 0,
        duration: TOTAL_TIME * 1000,
        easing: Animated.Easing.linear,
        useNativeDriver: false,
      }).start();
    }
  }, [isGameStarted]);

  useEffect(() => {
    const listenerId = animatedTimer.addListener(({ value }) => {
      setDisplayTime(Math.ceil(value));
      setFillAngle(
        -Math.PI / 1 +
          MISSING_ANGLE / 2 +
          (value / TOTAL_TIME) * (Math.PI * 2 - MISSING_ANGLE)
      );
    });

    return () => {
      animatedTimer.removeListener(listenerId);
    };
  }, []);

  const arcGenerator = useMemo(
    () =>
      d3
        .arc()
        .innerRadius(INNER_RADIUS)
        .outerRadius(RADIUS)
        .startAngle(-Math.PI / 1 + MISSING_ANGLE / 2)
        .endAngle(fillAngle),
    [fillAngle]
  );

  const borderArcGenerator = useMemo(() => {
    const gap = 0.3; // Adjust this value to control the size of the gap

    // First arc section: before the gap
    const arc1 = d3
      .arc()
      .innerRadius(RADIUS + 10)
      .outerRadius(BORDER_RADIUS)
      .startAngle(-Math.PI / 1 + MISSING_ANGLE / 2)
      .endAngle(-Math.PI / 2 + Math.PI / 2 - gap);

    // Second arc section: after the gap
    const arc2 = d3
      .arc()
      .innerRadius(RADIUS + 10)
      .outerRadius(BORDER_RADIUS)
      .startAngle(-Math.PI / 2 + Math.PI / 2 + gap) // Starts after the gap
      .endAngle(Math.PI / 1 - MISSING_ANGLE / 2); // Ends at the top

    return [arc1, arc2];
  }, []);

  // **📌 Calculate pill position at the gap (adjusted for better alignment)**
  const gapAngle =
    -Math.PI / 1 + MISSING_ANGLE / 2 + (Math.PI * 2 - MISSING_ANGLE);
  const pillOffset = RADIUS + 30; // Push outside the donut
  const pillX = pillOffset * Math.cos(gapAngle);
  const pillY = pillOffset * Math.sin(gapAngle);

  return (
    <Styled.Container>
      {/* SVG Donut */}
      <Svg width={RADIUS * 2 + 40} height={RADIUS + 200}>
        <G x={RADIUS + 20} y={RADIUS + 20}>
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
          <Path d={arcGenerator({} as any) || ""} fill="#f4770c" />
        </G>
      </Svg>

      {/* Timer Countdown Display in Center */}
      <View
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: [{ translateX: -20 }, { translateY: 15 }],
        }}
      >
        <Text style={{ fontSize: 32, fontWeight: "bold", color: "#fff" }}>
          {displayTime}
        </Text>
      </View>

      {/* 📌 Pill Component at the Missing Arc Section (Better Alignment) */}
      <View
        style={{
          position: "absolute",
          width: 280, // Larger pill width
          height: 40, // Taller pill
          backgroundColor: "#ffcc00",
          borderRadius: 20,
          alignItems: "center",
          justifyContent: "center",
          left: `50%`, // Center pill horizontally
          top: `50%`, // Center pill vertically
          transform: [
            { translateX: pillX - 15 }, // Center it correctly
            { translateY: pillY - 20 },
          ],
        }}
      >
        <Text style={{ fontWeight: "bold", color: "#000", fontSize: 18 }}>
          +10s
        </Text>
      </View>
    </Styled.Container>
  );
};
