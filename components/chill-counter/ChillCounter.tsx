import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import Svg, { G, Path } from "react-native-svg";
import * as d3 from "d3-shape";

// Constants
const RADIUS = 160;
const INNER_RADIUS = 110;
const BORDER_RADIUS = 175;
const CENTER_RADIUS = 50;
const SECTIONS_COUNT = 5; // Total sections

// Colors
export const COLORS = ["#f6c212", "#f4770c"]; // Single gradient

interface IGameplayCounterProps {
  isGameStarted: boolean;
  score: number;
  onIncrement: () => void;
  onStart: () => void;
}

export const ChillCounter: React.FC<IGameplayCounterProps> = ({
  isGameStarted,
  score,
  onIncrement,
  onStart,
}) => {
  const [fillAngle, setFillAngle] = useState(0);

  // Update the arc fill angle based on the score
  useEffect(() => {
    // Calculate fill percentage
    const percentage = Math.min(score / SECTIONS_COUNT, 1); // Max 100%
    setFillAngle(percentage * Math.PI); // Convert to radians (half-circle)
  }, [score]);

  // Arc generator for dynamic fill
  const arcGenerator = d3
    .arc()
    .innerRadius(INNER_RADIUS)
    .outerRadius(RADIUS)
    .startAngle(-Math.PI / 2) // Start from the top
    .endAngle(-Math.PI / 2 + fillAngle); // Fill dynamically

  // Border ring generator
  const borderArcGenerator = d3
    .arc()
    .innerRadius(RADIUS + 10)
    .outerRadius(BORDER_RADIUS)
    .startAngle(-Math.PI / 2)
    .endAngle(Math.PI / 2); // Full half-circle border

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      {/* SVG Donut */}
      <Svg width={RADIUS * 2 + 40} height={RADIUS + 120}>
        <G x={RADIUS + 20} y={RADIUS + 20}>
          {/* Outer Border */}
          <Path
            d={borderArcGenerator() || ""}
            fill="none"
            stroke="#fff"
            strokeWidth={5}
          />
          {/* Dynamic Fill */}
          <Path d={arcGenerator() || ""} fill={COLORS[1]} />
        </G>
      </Svg>

      {/* Tapable Circle Button */}
      <TouchableOpacity
        onPress={isGameStarted ? onIncrement : onStart}
        style={{
          position: "absolute",
          width: CENTER_RADIUS * 2,
          height: CENTER_RADIUS * 2,
          borderRadius: CENTER_RADIUS,
          backgroundColor: isGameStarted ? "#32CD32" : "#3498db",
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
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 24 }}>
          {score}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
