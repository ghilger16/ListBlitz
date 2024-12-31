import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import Svg, { G, Path, Line } from "react-native-svg";
import * as d3 from "d3-shape";

// Constants
const RADIUS = 160;
const INNER_RADIUS = 110;
const BORDER_RADIUS = 175;
const INNER_BORDER_RADIUS = 100;
const CENTER_RADIUS = 50;
const SECTIONS_COUNT = 3;
const POINTS_PER_SLICE = 5;

// Colors from constants
export const COLORS: ReadonlyArray<[string, string]> = [
  ["#f6c212", "#f4770c"], // Cool yellow-orange
  ["#2cddf1", "#298bde"], // Cool blue
  ["#ff6b8b", "#f73759"], // Warm pink-red
];

interface IGameplayCounterProps {
  isGameStarted: boolean;
  score: number;
  onIncrement: () => void;
  onStart: () => void;
}

export const GameplayCounter: React.FC<IGameplayCounterProps> = ({
  isGameStarted,
  score,
  onIncrement,
  onStart,
}) => {
  const [filledSlices, setFilledSlices] = useState<number[]>([]);

  // Update filled slices when score changes
  useEffect(() => {
    const newFills = Array(SECTIONS_COUNT)
      .fill(0)
      .map((_, index) => {
        const sliceScore = Math.min(
          POINTS_PER_SLICE,
          score - index * POINTS_PER_SLICE
        );
        return Math.max(0, sliceScore);
      });
    setFilledSlices(newFills);
  }, [score]);

  // Create pie slices
  const arcGenerator = d3.arc().innerRadius(INNER_RADIUS).outerRadius(RADIUS);

  const pieGenerator = d3
    .pie<number>()
    .sort(null)
    .value(1)
    .startAngle(-90 * (Math.PI / 180))
    .endAngle(90 * (Math.PI / 180));

  const arcs = pieGenerator(Array(SECTIONS_COUNT).fill(1));

  // Render slices with cooler to warmer colors
  const renderSlices = () =>
    arcs.map((arc, index) => {
      const fillPercentage = filledSlices[index] / POINTS_PER_SLICE;
      const fillColor =
        fillPercentage === 1 ? COLORS[index][1] : COLORS[index][0];

      return (
        <Path
          key={`arc-${index}`}
          d={arcGenerator(arc) || ""}
          fill={fillColor} // Dynamic fill color
        />
      );
    });

  // Outer border ring
  const outerBorderRing = () => {
    const borderArcGenerator = d3
      .arc()
      .innerRadius(RADIUS + 10)
      .outerRadius(BORDER_RADIUS);

    return arcs.map((arc, index) => (
      <Path
        key={`border-${index}`}
        d={borderArcGenerator(arc) || ""}
        fill="none"
        stroke="#fff"
        strokeWidth={5}
      />
    ));
  };

  // Inner border ring
  const innerBorderRing = () => {
    const innerBorderArcGenerator = d3
      .arc()
      .innerRadius(INNER_BORDER_RADIUS)
      .outerRadius(INNER_RADIUS - 10);

    return arcs.map((arc, index) => (
      <Path
        key={`inner-border-${index}`}
        d={innerBorderArcGenerator(arc) || ""}
        fill="none"
        stroke="#fff"
        strokeWidth={5}
      />
    ));
  };

  // Render the dial (odometer needle)
  const renderDial = () => {
    const totalPoints = SECTIONS_COUNT * POINTS_PER_SLICE;

    // Clamp progress between 0 and 1
    const progress = Math.min(1, Math.max(0, score / totalPoints));

    // Map progress to an angle (-90° at 9 o'clock to 90° at 3 o'clock)
    const angle = 180 + progress * 180;

    // Fixed length for the dial
    const DIAL_LENGTH = RADIUS - CENTER_RADIUS - 10; // Ensure fixed length

    // Calculate endpoint for the dial line
    const x = DIAL_LENGTH * Math.cos((angle * Math.PI) / 180);
    const y = DIAL_LENGTH * Math.sin((angle * Math.PI) / 180);

    return (
      <Svg
        width={RADIUS * 2}
        height={RADIUS + 120}
        style={{
          position: "absolute",
          pointerEvents: "none", // Prevents blocking taps
        }}
      >
        <Line
          // Start at the center of the button
          x1={RADIUS}
          y1={RADIUS + 15}
          // End point with fixed length
          x2={RADIUS + x}
          y2={RADIUS + 15 + y}
          stroke="#FF6F61"
          strokeWidth={4}
          strokeLinecap="round"
        />
      </Svg>
    );
  };

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      {/* SVG Donut */}
      <Svg width={RADIUS * 2 + 40} height={RADIUS + 120}>
        <G x={RADIUS + 20} y={RADIUS + 20}>
          {outerBorderRing()}
          {renderSlices()}
          {innerBorderRing()}
        </G>
      </Svg>
      {/* Render Dial ABOVE */}
      {renderDial()}

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
