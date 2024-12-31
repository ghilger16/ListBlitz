import React, { useState, useRef, useEffect } from "react";
import { View } from "react-native";
import Svg, {
  G,
  Path,
  Text,
  Circle,
  LinearGradient,
  Stop,
  Defs,
} from "react-native-svg";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import * as d3 from "d3-shape";
import { COLORS } from "@Components/constants";

// Constants
const RADIUS = 150;
const OUTER_CIRCLE_RADIUS = 75;
const INNER_CIRCLE_RADIUS = 50;
const SECTIONS_COUNT = 10;

interface IGameplayCounterProps {
  isGameStarted: boolean;
  onIncrement: () => void;
  onStart: () => void;
}

// Utility function to calculate which slice is tapped
const calculateSliceIndex = (
  x: number,
  y: number,
  radius: number,
  sectionsCount: number
): number | null => {
  const touchX = x - radius;
  const touchY = y - radius;

  // Calculate distance from center
  const distance = Math.sqrt(touchX * touchX + touchY * touchY);

  // Ignore touches within the center button
  if (distance < OUTER_CIRCLE_RADIUS) return null;

  const angle = Math.atan2(touchY, touchX);
  const normalizedAngle = angle >= 0 ? angle : 2 * Math.PI + angle;
  const adjustedAngle = (normalizedAngle + Math.PI) % (2 * Math.PI);

  return Math.floor((adjustedAngle / (2 * Math.PI)) * sectionsCount);
};

export const GameplayCounter: React.FC<IGameplayCounterProps> = ({
  isGameStarted,
  onIncrement,
  onStart,
}) => {
  const [selectedSlices, setSelectedSlices] = useState<Set<number>>(new Set());
  const currentSliceRef = useRef<number | null>(null);

  // Create arcs for pie slices
  const arcGenerator = d3
    .arc()
    .outerRadius(RADIUS)
    .innerRadius(OUTER_CIRCLE_RADIUS);
  const pieGenerator = d3
    .pie<number>()
    .sort(null)
    .value(1)
    .startAngle(-Math.PI / 2); // Start at 12 o'clock

  const arcs = pieGenerator(
    Array.from({ length: SECTIONS_COUNT }, (_, i) => i + 1)
  );

  // Handle slice selection
  const handleSliceSelection = (endIndex: number) => {
    const newSelection = new Set<number>();
    for (let i = 0; i <= endIndex; i++) {
      newSelection.add(i);
    }
    setSelectedSlices(newSelection);
  };

  // Gesture handling
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
      handleSliceSelection(sliceIndex);
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
      handleSliceSelection(sliceIndex);
    })
    .onEnd(() => {
      currentSliceRef.current = null;
    });

  // Render individual slices
  const renderSlice = (arc: any, index: number) => {
    const path = arcGenerator(arc) || "";
    const isSelected = selectedSlices.has(index);

    return (
      <G key={`arc-${index}`}>
        <Path
          d={path}
          fill={`url(#grad-${index % COLORS.length})`}
          stroke={isSelected ? "#FFF" : "#000"}
          strokeWidth={2}
        />
      </G>
    );
  };

  // Render the center button
  const renderCenterButton = () => (
    <G>
      <Circle
        cx={0}
        cy={0}
        r={INNER_CIRCLE_RADIUS}
        fill={isGameStarted ? "#32CD32" : "#3498db"}
        stroke="#000"
        strokeWidth={2}
        onPress={isGameStarted ? onIncrement : onStart}
      />
      <Text
        x={0}
        y={0}
        fontSize={14}
        fill="#FFF"
        textAnchor="middle"
        alignmentBaseline="middle"
      >
        {isGameStarted ? "✔️" : "Start"}
      </Text>
    </G>
  );

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
            {renderCenterButton()}
          </G>
        </Svg>
      </GestureDetector>
    </View>
  );
};
