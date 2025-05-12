import React, { useState, useRef, useMemo, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import Svg, { G, Path, Text as SvgText } from "react-native-svg";
import * as d3 from "d3-shape";
import LottieView from "lottie-react-native";
import { useGetIcons } from "@Services";
import { Player } from "@Context";
import { FlashingText } from "components/flashing-text";

import { playSound } from "components/utils";
import { tapSound } from "@Assets";

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

  const iconIndex = (currentPlayer.id - 1) % ICONS.length;

  const playSoundEffect = () => {
    playSound(tapSound);
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
    playSoundEffect();
    onIncrement();
  };

  useEffect(() => {
    if (score > 0) {
      setIsPlayerStartVisible(false);
    }
  }, [score]);

  return (
    <View style={styles.container}>
      <Svg width={RADIUS * 2 + 40} height={RADIUS + 140}>
        <G x={RADIUS + 20} y={RADIUS + 50}>
          <SvgText
            x=""
            y="-175"
            fontSize="45"
            fontWeight="bold"
            fill="#fff"
            textAnchor="middle"
            fontFamily="LuckiestGuy"
          >
            {score}
          </SvgText>
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
            fill={currentPlayer.startColor}
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
        activeOpacity={0.9}
        style={[
          styles.tapButton,
          {
            borderColor: currentPlayer.startColor,
            top: RADIUS - CENTER_RADIUS + 40,
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
