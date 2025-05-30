import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
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
import { useGetPlayerIcons } from "@Services";
import { COLORS } from "../../context/constants";
import { Audio } from "expo-av";

const RADIUS = 185;
const OUTER_CIRCLE_RADIUS = 100;
const SECTIONS_COUNT = 10;

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
  onPlayerCountChange: (players: { id: number; iconIndex: number }[]) => void;
}

export const PlayersSelect: React.FC<PlayersSelectProps> = ({
  onPlayerCountChange,
}) => {
  const { data: ICONS = [] } = useGetPlayerIcons();
  const [playerAssignments, setPlayerAssignments] = useState<
    { sliceIndex: number; playerNumber: number }[]
  >([]);

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
    const assignment = playerAssignments.find((p) => p.sliceIndex === index);
    if (assignment) {
      return { ...arc };
    }
    return null;
  });

  // Load the sound
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    const loadSound = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
        });

        if (!soundRef.current) {
          const { sound } = await Audio.Sound.createAsync(
            require("@Assets/sounds/click.mp3")
          );
          soundRef.current = sound;
        }
      } catch (error) {
        console.error("Error setting audio mode:", error);
      }
    };

    loadSound();

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    console.log("Player Assignments:", playerAssignments);
  }, [playerAssignments]);

  const playClickSound = async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.replayAsync();
      } catch (error) {
        console.error("Error playing sound:", error);
      }
    }
  };

  const handleSliceTap = (sliceIndex: number) => {
    const existing = playerAssignments.find((p) => p.sliceIndex === sliceIndex);

    if (existing) {
      const updated = playerAssignments.filter(
        (p) => p.sliceIndex !== sliceIndex
      );
      setPlayerAssignments(updated);
      onPlayerCountChange(
        updated.map((p) => ({
          id: p.playerNumber,
          iconIndex: p.sliceIndex,
        }))
      );
      playClickSound();
    } else {
      if (playerAssignments.length >= SECTIONS_COUNT) return;
      const assignedNumber = (() => {
        for (let i = 1; i <= SECTIONS_COUNT; i++) {
          if (!playerAssignments.find((p) => p.playerNumber === i)) {
            return i;
          }
        }
        return SECTIONS_COUNT + 1;
      })();

      const updated = [
        ...playerAssignments,
        { sliceIndex, playerNumber: assignedNumber },
      ];
      setPlayerAssignments(updated);

      onPlayerCountChange(
        updated.map((p) => ({
          id: p.playerNumber,
          iconIndex: p.sliceIndex,
        }))
      );
      playClickSound();
    }
  };

  const panGesture = Gesture.Tap().onEnd((event) => {
    const sliceIndex = calculateSliceIndex(
      event.x,
      event.y,
      RADIUS,
      SECTIONS_COUNT
    );
    if (sliceIndex === null) return;
    handleSliceTap(sliceIndex);
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
    const assignment = playerAssignments.find((p) => p.sliceIndex === index);
    const isSelected = !!assignment;
    const playerNumber = assignment?.playerNumber;
    // Always show the corresponding icon for this slice's index
    const iconSource = ICONS[index % ICONS.length];

    const lottieRef = useRef<LottieView>(null);

    useEffect(() => {
      if (isSelected && lottieRef.current) {
        lottieRef.current.play();
      } else if (!isSelected && lottieRef.current) {
        lottieRef.current.reset();
      }
    }, [isSelected]);

    return (
      <G key={`arc-${index}`}>
        <Path
          d={path}
          fill={`url(#grad-${index % COLORS.length})`}
          stroke={isSelected ? "#FFF" : "#000"}
          strokeWidth={2}
          opacity={isSelected ? 1 : 0.5}
        />
        <Text
          x={labelX * 0.9}
          y={labelY * 0.9}
          fontSize={18}
          fontWeight="bold"
          fill={isSelected ? "#FFF" : "#000"}
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          {playerNumber ?? ""}
        </Text>
        {iconSource && (
          <View
            style={{
              position: "absolute",
              left: x - 35,
              top: y - 20,
              justifyContent: "center",
              alignItems: "center",
              opacity: isSelected ? 1 : 0.5,
            }}
          >
            <LottieView
              ref={lottieRef}
              source={iconSource}
              autoPlay={isSelected}
              loop={isSelected}
              style={{ width: 85, height: 85 }}
            />
          </View>
        )}
      </G>
    );
  };

  return (
    <View pointerEvents="box-none">
      <GestureDetector gesture={panGesture}>
        <Svg width={RADIUS * 2 + 20} height={RADIUS * 2 + 35}>
          <Defs>
            {COLORS.map(([startColor, endColor], index) => (
              <LinearGradient key={`grad-${index}`} id={`grad-${index}`}>
                <Stop offset="0%" stopColor={startColor} />
                <Stop offset="100%" stopColor={endColor} />
              </LinearGradient>
            ))}
          </Defs>
          <G x={RADIUS + 10} y={RADIUS + 25}>
            <Circle cx={0} cy={0} r={RADIUS} fill="#192c43" />
            {/* Background behind the wheel */}
            <Circle cx={0} cy={0} r={RADIUS} fill="#192c43" />

            <G transform="rotate(165)">
              <Defs>
                <Path
                  id="text-curve"
                  d={`M 135,145 A 200,200 0 0,1 -135,145`}
                  fill="none"
                />
              </Defs>
              {/* <Text
                fill="white"
                fontSize="15"
                fontWeight="bold"
                letterSpacing="1"
                textAnchor="middle"
              >
                <TextPath
                  href="#text-curve"
                  startOffset="50%"
                  textLength="200%"
                >
                  Assign players clockwise from you →
                </TextPath>
              </Text> */}
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
      </GestureDetector>
    </View>
  );
};
