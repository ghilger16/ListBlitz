import React, { useState } from "react";
import { View } from "react-native";
import Svg, { Defs, G, LinearGradient, Path, Stop, Text } from "react-native-svg";
import * as d3 from "d3-shape";
import { COLORS } from "@Components/constants";

const radius = 185; // Radius of the outer circle

const outerCircleRadius = 100; // Radius of the new outer circle

export const PlayersSelect: React.FC<any> = ({ onGameStart }) => {
  const [counter, setCounter] = useState(0); // Counter for the next number to assign
  const [sliceValues, setSliceValues] = useState<Record<number, number>>({}); // Map of slice index to its value

  const sections = Array.from({ length: 12 }, (_, i) => i + 1); // Create 12 sections

  // Generate arc paths using D3
  const arcGenerator = d3.arc().outerRadius(radius).innerRadius(0); // Define arc size
  const outerArcGenerator = d3.arc().outerRadius(outerCircleRadius).innerRadius(radius); // Define the outer circle size
  const pieGenerator = d3.pie<number>().sort(null).value(1); // Equal spacing for 12 sections

  const arcs = pieGenerator(sections);

  const handlePress = (index: number) => {
    setSliceValues((prev) => {
      const updatedValues = { ...prev };

      if (updatedValues[index] === counter) {
        // If the slice has the latest number, remove it
        delete updatedValues[index];
        setCounter((prev) => prev - 1);
      } else if (!updatedValues[index]) {
        // If the slice is unselected, assign the next number
        setCounter((prev) => prev + 1);
        updatedValues[index] = counter + 1;
      }

      return updatedValues;
    });
  };

  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <pre>{counter}</pre>
      <Svg width={radius * 2} height={radius * 2}>
        <Defs>
          {/* Create gradient definitions for each color pair */}
          {COLORS.map(([startColor, endColor], index) => (
            <LinearGradient
              key={`grad-${index}`}
              id={`grad-${index}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <Stop offset="0%" stopColor={startColor} />
              <Stop offset="100%" stopColor={endColor} />
            </LinearGradient>
          ))}
        </Defs>

        <G x={radius} y={radius}>
          {/* Render each arc */}
          {arcs.map((arc, index) => {
            const path = arcGenerator(arc as any) || "";
            const [labelX, labelY] = arcGenerator.centroid(arc as any);
            const offsetFactor = 0.9; // Adjust label position
            const adjustedX = labelX * offsetFactor;
            const adjustedY = labelY * offsetFactor;

            return (
              <G key={index}>
                {/* Touchable arc */}
                <Path
                  d={path}
                  fill={`url(#grad-${index % COLORS.length})`} // Apply gradient fill
                  stroke="#000"
                  strokeWidth={3}
                  onPress={() => handlePress(index)} // Handle arc press
                />
                {/* Display the assigned value if the slice has been clicked */}
                {sliceValues[index] && (
                  <Text
                    x={adjustedX}
                    y={adjustedY}
                    fontSize={16}
                    fill="#000"
                    textAnchor="middle"
                    alignmentBaseline="middle"
                  >
                    {sliceValues[index]}
                  </Text>
                )}
              </G>
            );
          })}

          <Path
            d={
              outerArcGenerator({
                innerRadius: radius,
                outerRadius: outerCircleRadius, // Define inner and outer radius
                startAngle: 0,
                endAngle: 2 * Math.PI, // Full circle
              }) || ""
            }
            fill="none" // Transparent fill
            stroke="#000" // Outer circle stroke
            strokeWidth={3}
          />

          {/* Add split middle circle */}
          <Path
            d={
              d3.arc()({
                innerRadius: 0,
                outerRadius: 60,
                startAngle: 0,
                endAngle: Math.PI,
              }) || ""
            }
            fill="#FFD700"
            stroke="#000"
            strokeWidth={3}
            onPress={() => onGameStart("chill", counter)} // Start Chill Mode
          />
          <Path
            d={
              d3.arc()({
                innerRadius: 0,
                outerRadius: 60,
                startAngle: Math.PI,
                endAngle: 2 * Math.PI,
              }) || ""
            }
            fill="#1E90FF"
            stroke="#000"
            strokeWidth={3}
            onPress={() => onGameStart("blitz", counter)} // Start Blitz Mode
          />

          {/* Add Blitz text */}
          <Text
            x={-30} // Position to the left
            y={0}
            fontSize={14}
            fill="#000"
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            Blitz
          </Text>

          {/* Add Chill text */}
          <Text
            x={30} // Position to the right
            y={0}
            fontSize={14}
            fill="#000"
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            Chill
          </Text>
        </G>
      </Svg>
    </View>
  );
};
