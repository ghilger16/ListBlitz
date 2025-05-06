import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Dimensions,
} from "react-native";
import Svg, { Defs, G, LinearGradient, Path, Stop } from "react-native-svg";
import * as d3 from "d3-shape";
import LottieView from "lottie-react-native";
import { useGetIcons } from "@Services";
import { Audio } from "expo-av";
import { Player } from "@Context";
import { FlashingText } from "components/flashing-text";

const RADIUS = 160;
const INNER_RADIUS = 110;
const BORDER_RADIUS = 175;
const CENTER_RADIUS = 60;
const SECTIONS_COUNT = 5;

interface IGameplayCounterProps {
  score: number;
  currentPlayer: Player;
  onIncrement: () => void;
  onStart: () => void;
}

export const ChillCounter: React.FC<IGameplayCounterProps> = ({
  score,
  currentPlayer,
  onIncrement,
  onStart,
}) => {
  const { data: ICONS = [] } = useGetIcons();
  const [fillAngle, setFillAngle] = useState(0);
  const [isPlayerStartVisible, setIsPlayerStartVisible] = useState(true);
  const lottieRef = useRef<LottieView>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  const iconIndex = (currentPlayer.id - 1) % ICONS.length;

  useEffect(() => {
    const loadSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require("@Assets/sounds/tap.mp3")
      );
      soundRef.current = sound;
    };
    loadSound();

    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  const playSound = async () => {
    try {
      await soundRef.current?.replayAsync();
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  useEffect(() => {
    const percentage = Math.min(score / SECTIONS_COUNT, 1);
    setFillAngle(percentage * Math.PI);
  }, [score]);

  const arcGenerator = useMemo(
    () =>
      d3
        .arc()
        .innerRadius(INNER_RADIUS)
        .outerRadius(RADIUS)
        .startAngle(-Math.PI / 2)
        .endAngle(-Math.PI / 2 + fillAngle),
    [fillAngle]
  );

  const borderArcGenerator = useMemo(() => {
    const gap = 0.15;
    const arc1 = d3
      .arc()
      .innerRadius(RADIUS + 10)
      .outerRadius(BORDER_RADIUS)
      .startAngle(-Math.PI / 2)
      .endAngle(-Math.PI / 2 + Math.PI / 2 - gap);

    const arc2 = d3
      .arc()
      .innerRadius(RADIUS + 10)
      .outerRadius(BORDER_RADIUS)
      .startAngle(-Math.PI / 2 + Math.PI / 2 + gap)
      .endAngle(Math.PI / 2);

    return [arc1, arc2];
  }, []);

  const sectionArcGenerator = useMemo(
    () => (index: number) => {
      const startAngle = -Math.PI / 2 + (Math.PI / SECTIONS_COUNT) * index;
      const endAngle = startAngle + Math.PI / SECTIONS_COUNT;
      return d3
        .arc()
        .innerRadius(INNER_RADIUS)
        .outerRadius(RADIUS)
        .startAngle(startAngle)
        .endAngle(endAngle);
    },
    []
  );

  const handleIncrement = () => {
    playSound();
    onIncrement();
  };

  useEffect(() => {
    if (score > 0) {
      setIsPlayerStartVisible(false);
    }
  }, [score]);

  return (
    <View style={styles.container}>
      <Svg width={RADIUS * 2 + 40} height={RADIUS + 120}>
        <Defs>
          <LinearGradient
            id={`grad-${currentPlayer.id}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <Stop offset="0%" stopColor={currentPlayer.startColor} />
            <Stop offset="100%" stopColor={currentPlayer.endColor} />
          </LinearGradient>
        </Defs>
        <G x={RADIUS + 20} y={RADIUS + 20}>
          <Text style={styles.scoreText}>{score}</Text>
          <Path
            d={borderArcGenerator[0]({} as any) || ""}
            fill="none"
            stroke={currentPlayer.startColor}
            strokeWidth={5}
          />
          <Path
            d={borderArcGenerator[1]({} as any) || ""}
            fill="none"
            stroke={currentPlayer.startColor}
            strokeWidth={5}
          />
          <Path
            d={arcGenerator({} as any) || ""}
            fill={`url(#grad-${currentPlayer.id})`}
          />
          {Array.from({ length: SECTIONS_COUNT }).map((_, index) => (
            <Path
              key={index}
              d={sectionArcGenerator(index)({} as any)}
              fill="none"
              stroke="#fff"
              strokeWidth={2}
            />
          ))}
        </G>
      </Svg>

      <TouchableOpacity
        onPress={handleIncrement}
        style={[
          styles.tapButton,
          {
            borderColor: currentPlayer.startColor,
            top: RADIUS - CENTER_RADIUS + 10,
          },
        ]}
      >
        <LottieView
          ref={lottieRef}
          source={ICONS[iconIndex] ?? ICONS[0]}
          autoPlay
          loop={false}
          style={styles.lottie}
        />
      </TouchableOpacity>

      {isPlayerStartVisible && (
        <View style={styles.tapTextWrapper}>
          <FlashingText>Tap to Score</FlashingText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  scoreText: {
    position: "absolute",
    top: -20,
    fontFamily: "LuckiestGuy",
    fontSize: 45,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  tapButton: {
    position: "absolute",
    width: CENTER_RADIUS * 2,
    height: CENTER_RADIUS * 2,
    borderRadius: CENTER_RADIUS,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 5,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  lottie: {
    width: CENTER_RADIUS * 2,
    height: CENTER_RADIUS * 2,
  },
  tapTextWrapper: {
    marginTop: -35,
    marginLeft: -80,
  },
});
