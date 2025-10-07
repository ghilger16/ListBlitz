import React, { useEffect, useMemo, useRef, useState } from "react";
import { View } from "react-native";
import Svg, {
  Path,
  Text,
  Circle,
  G,
  LinearGradient,
  Defs,
  Stop,
  TextPath,
} from "react-native-svg";

import LottieView from "lottie-react-native";
import * as d3 from "d3-shape";

import { clickSound } from "@Assets";
import { PLAYER_COLORS, playerIcons } from "@Context";
import { playSound, useScreenInfo } from "@Utils";
import { useResponsiveStyles } from "@Hooks";

const BASE_STYLES = {
  root: {},
  lottieContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
} as const;

const SECTIONS_COUNT = 10;

const PlayerSelectWheel: React.FC<{
  onPlayerCountChange: (players: { id: number; iconIndex: number }[]) => void;
}> = ({ onPlayerCountChange }) => {
  const { device } = useScreenInfo();

  const styles = useResponsiveStyles(BASE_STYLES, (d) => ({
    lottieContainer: {
      ...(d.isSmallPhone ? {} : {}),
    },
  }));

  const RADIUS = device.isLargeTablet
    ? 360
    : device.isTablet
    ? 300
    : device.isSmallPhone
    ? 150
    : 185;
  const OUTER_CIRCLE_RADIUS = RADIUS * 0.54;

  const [playerAssignments, setPlayerAssignments] = useState<
    { sliceIndex: number; playerNumber: number }[]
  >([]);
  const lottieRefs = useRef<(LottieView | null)[]>([]).current;

  const calculateSliceIndex = (x: number, y: number, sectionsCount: number) => {
    const angle = Math.atan2(y, x);
    let theta = angle + Math.PI / 2;
    if (theta < 0) theta += 2 * Math.PI;
    const sliceAngle = (2 * Math.PI) / sectionsCount;
    let index = Math.floor(theta / sliceAngle);
    return Math.max(0, Math.min(index, sectionsCount - 1));
  };

  const arcGenerator = d3.arc().outerRadius(RADIUS).innerRadius(0);
  const pieGenerator = d3.pie<number>().sort(null).value(1);

  const arcs = useMemo(
    () => pieGenerator(Array.from({ length: SECTIONS_COUNT }, (_, i) => i + 1)),
    []
  );

  const highlightArcs = arcs.map((arc, index) => {
    const assignment = playerAssignments.find((p) => p.sliceIndex === index);
    return assignment ? { ...arc } : null;
  });

  const getNextPlayerNumber = (assignedNumbers: number[]): number => {
    let nextNumber = 1;
    while (assignedNumbers.includes(nextNumber)) {
      nextNumber++;
    }
    return nextNumber;
  };

  const handleSliceTap = async (sliceIndex: number) => {
    const existingAssignment = playerAssignments.find(
      (p) => p.sliceIndex === sliceIndex
    );
    if (existingAssignment) {
      setPlayerAssignments((prev) => {
        const updated = prev.filter((p) => p.sliceIndex !== sliceIndex);
        onPlayerCountChange(
          updated.map(({ playerNumber, sliceIndex }) => ({
            id: playerNumber,
            iconIndex: sliceIndex,
          }))
        );
        return updated;
      });
    } else {
      setPlayerAssignments((prev) => {
        const assignedNumbers = prev.map((p) => p.playerNumber);
        const nextNumber = getNextPlayerNumber(assignedNumbers);
        const updated = [...prev, { sliceIndex, playerNumber: nextNumber }];
        onPlayerCountChange(
          updated.map(({ playerNumber, sliceIndex }) => ({
            id: playerNumber,
            iconIndex: sliceIndex,
          }))
        );
        return updated;
      });
    }
    await playSound(clickSound);
  };

  const controlLottieAnimation = (
    isSelected: boolean,
    ref: LottieView | null
  ) => {
    if (isSelected && ref) {
      ref.play();
    } else if (!isSelected && ref) {
      ref.reset();
    }
  };

  const transformToSVGCoordinates = (labelX: number, labelY: number) => ({
    x: RADIUS + labelX * 1.5,
    y: RADIUS + labelY * 1.5,
  });

  const renderSlice = (arc: any, index: number) => {
    const path = arcGenerator(arc) || "";
    const [labelX, labelY] = arcGenerator.centroid(arc);
    const { x, y } = transformToSVGCoordinates(labelX, labelY);
    const assignment = playerAssignments.find((p) => p.sliceIndex === index);
    const isSelected = !!assignment;
    const playerNumber = assignment?.playerNumber;

    const iconSource = playerIcons[index];
    let iconSize;
    if (index === 3) {
      iconSize = device.isLargeTablet
        ? { width: 210, height: 210 }
        : device.isTablet
        ? { width: 180, height: 180 }
        : device.isSmallPhone
        ? { width: 93, height: 90 }
        : { width: 110, height: 110 };
    } else if (index === 6) {
      iconSize = device.isLargeTablet
        ? { width: 150, height: 210 }
        : device.isTablet
        ? { width: 130, height: 180 }
        : device.isSmallPhone
        ? { width: 65, height: 90 }
        : { width: 80, height: 110 };
    } else {
      iconSize = device.isLargeTablet
        ? { width: 190, height: 190 }
        : device.isTablet
        ? { width: 160, height: 160 }
        : device.isSmallPhone
        ? { width: 75, height: 75 }
        : { width: 95, height: 95 };
    }

    useEffect(() => {
      controlLottieAnimation(isSelected, lottieRefs[index]);
    }, [isSelected]);

    return (
      <G key={`arc-${index}`}>
        <Path
          d={path}
          fill={`url(#grad-${index % PLAYER_COLORS.length})`}
          stroke={isSelected ? "#FFF" : "#000"}
          strokeWidth={2}
          opacity={isSelected ? 1 : 0.5}
        />
        <Text
          x={labelX * 0.9}
          y={labelY * 0.9}
          fontSize={
            device.isLargeTablet
              ? 30
              : device.isTablet
              ? 25
              : device.isSmallPhone
              ? 15
              : 18
          }
          fontWeight="bold"
          fill={isSelected ? "#FFF" : "#000"}
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          {playerNumber ?? ""}
        </Text>
        {iconSource && (
          <View
            style={[
              styles.lottieContainer,
              {
                left:
                  x -
                  (device.isLargeTablet
                    ? 85
                    : device.isTablet
                    ? 70
                    : device.isSmallPhone
                    ? 30
                    : 40),
                top:
                  y -
                  (device.isLargeTablet
                    ? 70
                    : device.isTablet
                    ? 55
                    : device.isSmallPhone
                    ? 15
                    : 25),
                opacity: isSelected ? 1 : 0.5,
              },
            ]}
          >
            <LottieView
              ref={(ref) => {
                lottieRefs[index] = ref;
              }}
              source={iconSource}
              autoPlay={isSelected}
              loop={isSelected}
              style={iconSize}
            />
          </View>
        )}
      </G>
    );
  };

  const onStartShouldSetResponder = () => true;

  const onResponderRelease = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    const svgOffsetX = RADIUS + 10;
    const svgOffsetY = RADIUS + 25;
    const x = locationX - svgOffsetX;
    const y = locationY - svgOffsetY;

    const tappedIndex = calculateSliceIndex(x, y, SECTIONS_COUNT);

    handleSliceTap(tappedIndex);
  };
  const size = device.isLargeTablet
    ? RADIUS + 60
    : device.isTablet
    ? RADIUS + 50
    : device.isSmallPhone
    ? RADIUS + 25
    : RADIUS + 38;
  return (
    <View
      onStartShouldSetResponder={onStartShouldSetResponder}
      onResponderRelease={onResponderRelease}
    >
      <Svg width={RADIUS * 2 + 20} height={RADIUS * 2 + 35}>
        <Defs>
          {PLAYER_COLORS.map(([startColor, endColor], index) => (
            <LinearGradient key={`grad-${index}`} id={`grad-${index}`}>
              <Stop offset="0%" stopColor={startColor} />
              <Stop offset="100%" stopColor={endColor} />
            </LinearGradient>
          ))}
        </Defs>
        <G x={RADIUS + 10} y={RADIUS + 30}>
          <Circle cx={0} cy={0} r={RADIUS} fill="#192c43" />

          <G transform="rotate(165)">
            <Defs>
              <Path
                id="text-curve"
                d={`M ${size * 0.7},${size * 0.6} A ${size},${size} 0 0,1 -${
                  size * 0.7
                },${size * 0.6}`}
                fill="none"
              />
            </Defs>
            <Text
              fill="white"
              fontSize={
                device.isLargeTablet
                  ? 24
                  : device.isTablet
                  ? 22
                  : device.isSmallPhone
                  ? 12
                  : 15
              }
              fontWeight="bold"
              letterSpacing="1"
              textAnchor="middle"
            >
              <TextPath href="#text-curve" startOffset="50%" textLength="200%">
                Assign An Icon To Each Player →
              </TextPath>
            </Text>
          </G>

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
    </View>
  );
};

export default PlayerSelectWheel;
