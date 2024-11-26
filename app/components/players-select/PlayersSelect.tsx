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
import { COLORS } from "@Components/constants";

// Constants
const RADIUS = 185;
const OUTER_CIRCLE_RADIUS = 100;
const INNER_CIRCLE_RADIUS = 60;
const SECTIONS_COUNT = 12;

// Utility function to calculate the pie slice index based on touch coordinates
const calculateSliceIndex = (
  x: number,
  y: number,
  radius: number,
  sectionsCount: number
): number => {
  const touchX = x - radius;
  const touchY = y - radius;
  const angle = Math.atan2(touchY, touchX);
  const normalizedAngle = angle >= 0 ? angle : 2 * Math.PI + angle;

  const adjustedAngle = (normalizedAngle + Math.PI) % (2 * Math.PI);
  return Math.floor((adjustedAngle / (2 * Math.PI)) * sectionsCount);
};

interface IPlayersSelectProps {
  onGameStart: (mode: string, counter: number) => void;
}

export const PlayersSelect: React.FC<IPlayersSelectProps> = ({
  onGameStart,
}) => {
  const [selectedSlices, setSelectedSlices] = useState<Set<number>>(
    new Set([0]) // Slice 1 (index 0) is always selected
  );
  const currentSliceRef = useRef<number | null>(null); // Track current slice during gestures
  const sliceRefs = useRef<(Path | null)[]>([]);

  // Create arc generators
  const arcGenerator = d3.arc().outerRadius(RADIUS).innerRadius(0);
  const pieGenerator = d3
    .pie<number>()
    .sort(null)
    .value(1)
    .startAngle(-Math.PI / 2); // Start at the top (12 o'clock)

  const arcs = pieGenerator(
    Array.from({ length: SECTIONS_COUNT }, (_, i) => i + 1)
  );

  // Handle slice selection to highlight slices from 1 to the tapped/dragged slice
  const handleRangeSelection = (endIndex: number) => {
    const newSelection = new Set<number>([0]); // Always include slice 1 (index 0)
    for (let i = 0; i <= endIndex; i++) {
      newSelection.add(i);
    }
    setSelectedSlices(newSelection);
  };

  // Gesture handlers
  const panGesture = Gesture.Pan()
    .onBegin((event) => {
      const sliceIndex = calculateSliceIndex(
        event.x,
        event.y,
        RADIUS,
        SECTIONS_COUNT
      );
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
      if (currentSliceRef.current !== sliceIndex) {
        currentSliceRef.current = sliceIndex;
        handleRangeSelection(sliceIndex);
      }
    })
    .onEnd(() => {
      currentSliceRef.current = null;
    });

  const renderSlice = (arc: any, index: number) => {
    const path = arcGenerator(arc) || "";
    const [labelX, labelY] = arcGenerator.centroid(arc);
    const isSelected = selectedSlices.has(index);

    return (
      <G key={`arc-${index}`}>
        <Path
          ref={(el) => (sliceRefs.current[index] = el)}
          d={path}
          fill={`url(#grad-${index % COLORS.length})`}
          stroke={isSelected ? "#FFF" : "#000"}
          strokeWidth={2}
        />
        <Text
          x={labelX * 0.9}
          y={labelY * 0.9}
          fontSize={16}
          fill={isSelected ? "#FFF" : "#000"}
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          {index + 1}
        </Text>
      </G>
    );
  };

  const renderCenterOptions = () => (
    <>
      <Circle
        cx={0}
        cy={0}
        r={OUTER_CIRCLE_RADIUS}
        stroke="#000"
        strokeWidth={2}
        fill="none"
      />
      <Path
        d={
          d3.arc()({
            innerRadius: 0,
            outerRadius: INNER_CIRCLE_RADIUS,
            startAngle: 0,
            endAngle: Math.PI,
          }) || ""
        }
        fill="#FFD700"
        stroke="#000"
        strokeWidth={2}
        onPress={() => onGameStart("chill", selectedSlices.size)}
      />
      <Path
        d={
          d3.arc()({
            innerRadius: 0,
            outerRadius: INNER_CIRCLE_RADIUS,
            startAngle: Math.PI,
            endAngle: 2 * Math.PI,
          }) || ""
        }
        fill="#1E90FF"
        stroke="#000"
        strokeWidth={2}
        onPress={() => onGameStart("blitz", selectedSlices.size)}
      />
      <Text
        x={-30}
        y={0}
        fontSize={14}
        fill="#000"
        textAnchor="middle"
        alignmentBaseline="middle"
      >
        Blitz
      </Text>
      <Text
        x={30}
        y={0}
        fontSize={14}
        fill="#000"
        textAnchor="middle"
        alignmentBaseline="middle"
      >
        Chill
      </Text>
    </>
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
            {renderCenterOptions()}
          </G>
        </Svg>
      </GestureDetector>
    </View>
  );
};
