import React, { useState, useRef } from "react";
import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Svg, {
  Circle,
  Defs,
  G,
  LinearGradient,
  Path,
  Stop,
  Text,
} from "react-native-svg";
import * as d3 from "d3-shape";
import LottieView from "lottie-react-native";

import { ModeSelect } from "./mode-select";
import { COLORS } from "../../context/constants";
import { GameMode, useGameplay } from "@Context"; // Import Enum
import { useGetIcons } from "@Services";

// Constants
const RADIUS = 185;
const OUTER_CIRCLE_RADIUS = 100;
const SECTIONS_COUNT = 12;

const calculateSliceIndex = (
  x: number,
  y: number,
  radius: number,
  sectionsCount: number
): number | null => {
  const touchX = x - radius;
  const touchY = y - radius;

  const distance = Math.sqrt(touchX * touchX + touchY * touchY);
  if (distance < OUTER_CIRCLE_RADIUS) {
    return null;
  }

  const angle = Math.atan2(touchY, touchX);
  const normalizedAngle = angle >= 0 ? angle : 2 * Math.PI + angle;
  const adjustedAngle = (normalizedAngle + Math.PI) % (2 * Math.PI);
  return Math.floor((adjustedAngle / (2 * Math.PI)) * sectionsCount);
};

interface PlayersSelectProps {
  onPlayerCountChange: (count: number) => void; // Callback to handle player count
}

export const PlayersSelect: React.FC<PlayersSelectProps> = ({
  onPlayerCountChange,
}) => {
  const { data: ICONS = [] } = useGetIcons();
  const [selectedSlices, setSelectedSlices] = useState<Set<number>>(
    new Set([0])
  );
  const currentSliceRef = useRef<number | null>(null);

  const arcGenerator = d3.arc().outerRadius(RADIUS).innerRadius(0);
  const pieGenerator = d3
    .pie<number>()
    .sort(null)
    .value(1)
    .startAngle(-Math.PI / 2);

  const arcs = pieGenerator(
    Array.from({ length: SECTIONS_COUNT }, (_, i) => i + 1)
  );

  const highlightArcs = arcs.map((arc, index) => {
    if (selectedSlices.has(index)) {
      return { ...arc };
    }
    return null;
  });

  const handleRangeSelection = (endIndex: number) => {
    const newSelection = new Set<number>([0]);
    for (let i = 0; i <= endIndex; i++) {
      newSelection.add(i);
    }
    setSelectedSlices(newSelection);
    onPlayerCountChange(newSelection.size); // Pass the player count to the parent component
  };

  const panGesture = Gesture.Pan()
    .onBegin((event) => {
      const sliceIndex = calculateSliceIndex(
        event.x,
        event.y,
        RADIUS,
        SECTIONS_COUNT
      );
      if (sliceIndex === null) return;
      currentSliceRef.current = sliceIndex;
      handleRangeSelection(sliceIndex);
    })
    .onUpdate((event) => {
      const sliceIndex = calculateSliceIndex(
        event.x,
        event.y,
        RADIUS,
        SECTIONS_COUNT
      );
      if (sliceIndex === null || currentSliceRef.current === sliceIndex) return;
      currentSliceRef.current = sliceIndex;
      handleRangeSelection(sliceIndex);
    })
    .onEnd(() => {
      currentSliceRef.current = null;
    });

  const transformToSVGCoordinates = (labelX: number, labelY: number) => {
    return {
      x: RADIUS + labelX * 1.5,
      y: RADIUS + labelY * 1.5,
    };
  };

  const renderSlice = (arc: any, index: number) => {
    const path = arcGenerator(arc) || "";
    const [labelX, labelY] = arcGenerator.centroid(arc);
    const { x, y } = transformToSVGCoordinates(labelX, labelY);
    const isSelected = selectedSlices.has(index);
    const iconSource = ICONS[index % ICONS.length];

    return (
      <G key={`arc-${index}`}>
        <Path
          d={path}
          fill={`url(#grad-${index % COLORS.length})`}
          stroke={isSelected ? "#FFF" : "#000"}
          strokeWidth={2}
          opacity={isSelected ? 1 : 0.5}
        />
        {/* Show text only when selected */}
        <Text
          x={labelX * 0.9}
          y={labelY * 0.9}
          fontSize={18}
          fontWeight="bold"
          fill={isSelected ? "#FFF" : "#000"}
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          {index + 1}
        </Text>
        {/* LottieView Icon */}
        <View
          style={{
            position: "absolute",
            left: x - 30,
            top: y - 35,
            justifyContent: "center",
            alignItems: "center",
            opacity: isSelected ? 1 : 0.5,
          }}
        >
          <LottieView
            source={iconSource}
            autoPlay={isSelected}
            loop={isSelected}
            style={{ width: 60, height: 60 }}
          />
        </View>
      </G>
    );
  };

  return (
    <View>
      <GestureDetector gesture={panGesture}>
        <Svg width={RADIUS * 2} height={RADIUS * 2}>
          <Defs>
            {COLORS.map(([startColor, endColor], index) => (
              <LinearGradient key={`grad-${index}`} id={`grad-${index}`}>
                <Stop offset="0%" stopColor={startColor} />
                <Stop offset="100%" stopColor={endColor} />
              </LinearGradient>
            ))}
          </Defs>
          <G x={RADIUS} y={RADIUS}>
            {arcs.map(renderSlice)}
            {highlightArcs.map((arc, index) =>
              arc ? (
                <Path
                  key={`highlight-${index}`}
                  d={arcGenerator(arc as any) || ""}
                  fill="none"
                  stroke="#FFF"
                  strokeWidth={4}
                />
              ) : null
            )}
            <Circle
              cx={0}
              cy={0}
              r={OUTER_CIRCLE_RADIUS}
              stroke="#000"
              strokeWidth={2}
              fill="none"
            />
          </G>
        </Svg>
      </GestureDetector>
    </View>
  );
};
