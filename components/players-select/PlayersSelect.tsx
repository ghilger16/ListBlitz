import React, { useEffect, useRef, useState } from "react";
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
import { playerIcons } from "@Services";
import { PLAYER_COLORS } from "../../context/constants";
import { Audio } from "expo-av";

const RADIUS = 185;
const OUTER_CIRCLE_RADIUS = 100;
const SECTIONS_COUNT = 10;

const calculateSliceIndex = (
  x: number,
  y: number,
  radius: number,
  sectionsCount: number
) => {
  const angle = Math.atan2(y, x);

  let theta = angle + Math.PI / 2;

  if (theta < 0) {
    theta += 2 * Math.PI;
  }
  const sliceAngle = (2 * Math.PI) / sectionsCount;
  let index = Math.floor(theta / sliceAngle);

  if (index < 0) index = 0;
  if (index >= sectionsCount) index = sectionsCount - 1;
  return index;
};

interface PlayersSelectProps {
  onPlayerCountChange: (players: { id: number; iconIndex: number }[]) => void;
}

export const PlayersSelect: React.FC<PlayersSelectProps> = ({
  onPlayerCountChange,
}) => {
  const [playerAssignments, setPlayerAssignments] = useState<
    { sliceIndex: number; playerNumber: number }[]
  >([]);

  const arcGenerator = d3.arc().outerRadius(RADIUS).innerRadius(0);
  const pieGenerator = d3.pie<number>().sort(null).value(1);

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

  const playClickSound = async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.replayAsync();
      } catch (error) {
        console.error("Error playing sound:", error);
      }
    }
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
        let nextNumber = 1;
        while (assignedNumbers.includes(nextNumber)) {
          nextNumber++;
        }
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
    await playClickSound();
  };

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

    const iconSource = playerIcons[index];

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
          fill={`url(#grad-${index % PLAYER_COLORS.length})`}
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

  const onStartShouldSetResponder = () => true;

  const onResponderRelease = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    const svgOffsetX = RADIUS + 10;
    const svgOffsetY = RADIUS + 25;
    const x = locationX - svgOffsetX;
    const y = locationY - svgOffsetY;

    const tappedIndex = calculateSliceIndex(x, y, RADIUS, SECTIONS_COUNT);

    handleSliceTap(tappedIndex);
  };

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
        <G x={RADIUS + 10} y={RADIUS + 25}>
          <Circle cx={0} cy={0} r={RADIUS} fill="#192c43" />

          <Circle cx={0} cy={0} r={RADIUS} fill="#192c43" />

          <G transform="rotate(165)">
            <Defs>
              <Path
                id="text-curve"
                d={`M 135,145 A 200,200 0 0,1 -135,145`}
                fill="none"
              />
            </Defs>
            <Text
              fill="white"
              fontSize="15"
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
