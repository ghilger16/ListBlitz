import React, { useState, useRef, useMemo, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Svg, { G, Path, Text as SvgText } from "react-native-svg";

import * as d3 from "d3-shape";
import LottieView from "lottie-react-native";

import { Player, playerIcons } from "@Context";
import { playTapSound } from "@Utils";
import { FlashingText } from "components/shared/flashing-text";

const RADIUS = 160;
const INNER_RADIUS = 110;
const BORDER_RADIUS = 175;
const CENTER_RADIUS = 60;
const SECTIONS_COUNT = 5;

interface IGameplayCounterProps {
  score: number;
  currentPlayer: Player;
  onIncrement: () => void;
  onDecrement: () => void;
  onStart: () => void;
}

export const ChillCounter: React.FC<IGameplayCounterProps> = ({
  score,
  currentPlayer,
  onIncrement,
  onDecrement,
}) => {
  const [fillAngle, setFillAngle] = useState(0);
  const [isPlayerStartVisible, setIsPlayerStartVisible] = useState(true);
  const lottieRef = useRef<LottieView>(null);

  const iconIndex = currentPlayer.iconIndex;

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

  const dummyArcData: d3.DefaultArcObject = {
    innerRadius: 0,
    outerRadius: 0,
    startAngle: 0,
    endAngle: 0,
  };

  const arcPath = useMemo(
    () => arcGenerator(dummyArcData) ?? "",
    [arcGenerator]
  );

  const borderArcPaths = useMemo(
    () => borderArcGenerator.map((gen) => gen(dummyArcData) ?? ""),
    [borderArcGenerator]
  );

  const sectionArcPaths = useMemo(
    () =>
      Array.from({ length: SECTIONS_COUNT }).map(
        (_, index) => sectionArcGenerator(index)(dummyArcData) ?? ""
      ),
    [sectionArcGenerator]
  );

  const handleIncrement = () => {
    playTapSound();
    onIncrement();
  };

  useEffect(() => {
    if (score > 0) {
      setIsPlayerStartVisible(false);
    }
  }, [score]);

  return (
    <View style={styles.container} pointerEvents="box-none">
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
            d={borderArcPaths[0]}
            fill="none"
            stroke={currentPlayer.startColor}
            strokeWidth={5}
          />
          <Path
            d={borderArcPaths[1]}
            fill="none"
            stroke={currentPlayer.startColor}
            strokeWidth={5}
          />
          <Path d={arcPath} fill={currentPlayer.startColor} />
          {sectionArcPaths.map((d, index) => (
            <Path key={index} d={d} fill="none" stroke="#fff" strokeWidth={2} />
          ))}
        </G>
      </Svg>

      <TouchableOpacity
        onPress={handleIncrement}
        onLongPress={onDecrement}
        activeOpacity={0.9}
        style={[
          styles.tapButton,
          {
            borderColor: currentPlayer.startColor,
            top: RADIUS - CENTER_RADIUS + 40,
          },
        ]}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <LottieView
          ref={lottieRef}
          source={playerIcons[iconIndex]}
          autoPlay
          loop
          style={styles.lottie}
        />
      </TouchableOpacity>

      <View style={styles.tapTextWrapper}>
        {isPlayerStartVisible && <FlashingText>Tap to Score</FlashingText>}
      </View>
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
    height: 40,
    marginTop: -35,
    marginLeft: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});
