import React from "react";
import { View } from "react-native";
import Svg, { G, Circle, Path, Text } from "react-native-svg";
import * as d3 from "d3-shape";

const radius = 185; // Radius of the outer circle

export const PlayersSelect: React.FC<any> = ({ onStartClick }) => {
  const sections = Array.from({ length: 12 }, (_, i) => i + 1); // Create 12 sections

  // Generate arc paths using D3
  const arcGenerator = d3.arc().outerRadius(radius).innerRadius(0); // Define arc size
  const pieGenerator = d3.pie<number>().sort(null).value(1); // Equal spacing for 12 sections

  const arcs = pieGenerator(sections);

  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <Svg width={radius * 2} height={radius * 2}>
        <G x={radius} y={radius}>
          {/* Render each arc */}
          {arcs.map((arc, index) => {
            const path = arcGenerator(arc) || "";
            const [labelX, labelY] = arcGenerator.centroid(arc);
            const offsetFactor = 0.9;
            const adjustedX = labelX * offsetFactor;
            const adjustedY = labelY * offsetFactor;
            return (
              <G key={index}>
                <Path
                  d={path}
                  fill={`hsl(${(index / sections.length) * 360}, 80%, 70%)`}
                  stroke="#000"
                  strokeWidth={3}
                />
                <Text
                  x={adjustedX}
                  y={adjustedY}
                  fontSize={16}
                  fill="#000"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                >
                  {index + 1}
                </Text>
              </G>
            );
          })}
          {/* Add center circle */}
          <Circle cx={0} cy={0} r={60} fill="#29b6f6" />
          <Circle
            cx={0}
            cy={0}
            r={100}
            stroke="#000"
            strokeWidth={2}
            fill="none"
          />

          <Text
            x={0}
            y={0}
            fontSize={14}
            fill="#fff"
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            Select Players
          </Text>
        </G>
      </Svg>
    </View>
  );
};
