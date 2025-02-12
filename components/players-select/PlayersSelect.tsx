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
} from "react-native-svg";
import LottieView from "lottie-react-native";
import * as d3 from "d3-shape";
import { useGetIcons } from "@Services";
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

  const handleRangeSelection = (endIndex: number) => {
    const newSelection = new Set<number>([0]);
    for (let i = 0; i <= endIndex; i++) {
      newSelection.add(i);
    }

    // Check if a new slice was added or removed
    const added = [...newSelection].filter((x) => !selectedSlices.has(x));
    const removed = [...selectedSlices].filter((x) => !newSelection.has(x));

    // Play sound only for changes
    if (added.length > 0 || removed.length > 0) {
      playClickSound();
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
          {index + 1}
        </Text>
        <View
          style={{
            position: "absolute",
            left: x - 30,
            top: y - 30,
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
            style={{ width: 75, height: 75 }}
          />
        </View>
      </G>
    );
  };

  return (
    <View>
      <GestureDetector gesture={panGesture}>
        <Svg width={RADIUS * 2 + 20} height={RADIUS * 2 + 20}>
          <Defs>
            {COLORS.map(([startColor, endColor], index) => (
              <LinearGradient key={`grad-${index}`} id={`grad-${index}`}>
                <Stop offset="0%" stopColor={startColor} />
                <Stop offset="100%" stopColor={endColor} />
              </LinearGradient>
            ))}
          </Defs>
          <G x={RADIUS + 10} y={RADIUS + 10}>
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
