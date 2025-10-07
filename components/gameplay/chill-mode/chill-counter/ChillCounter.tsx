import React, { useState, useRef, useMemo, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Svg, { G, Path, Text as SvgText } from "react-native-svg";

import * as d3 from "d3-shape";
import LottieView from "lottie-react-native";

import { Player, playerIcons } from "@Context";
import { playTapSound } from "@Utils";
import { FlashingText } from "components/shared/flashing-text";
import { useResponsiveStyles } from "@Hooks";

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
  const styles = useResponsiveStyles(BASE_STYLES, (device) => {
    if (device.isLargeTablet) {
      return {
        ringBox: { width: 365 },
        innerBox: { width: 265 },
        borderBox: { width: 380 },
        centerBox: { width: 115 },
        groupOffset: { marginTop: 80 },
        scoreOffset: { marginTop: 12 },
        tapTextOffset: { marginTop: 0 },
        scoreText: { fontSize: 72 },
      } as const;
    }
    if (device.isTablet) {
      return {
        ringBox: { width: 300 },
        innerBox: { width: 220 },
        borderBox: { width: 315 },
        centerBox: { width: 95 },
        groupOffset: { marginTop: 80 },
        scoreOffset: { marginTop: 10 },
        tapTextOffset: { marginTop: 0 },
        scoreText: { fontSize: 60 },
      } as const;
    }
    if (device.isLargePhone) {
      return {
        ringBox: { width: 190 },
        innerBox: { width: 135 },
        borderBox: { width: 205 },
        centerBox: { width: 70 },
        groupOffset: { marginTop: 65 },
        scoreOffset: { marginTop: 14 },
        tapTextOffset: { marginTop: -32 },
        scoreText: { fontSize: 50 },
      } as const;
    }
    if (device.isSmallPhone) {
      return {
        ringBox: { width: 120 },
        innerBox: { width: 80 },
        borderBox: { width: 135 },
        centerBox: { width: 45 },
        groupOffset: { marginTop: 45 },
        scoreOffset: { marginTop: 10 },
        tapTextOffset: { marginTop: -45 },
        scoreText: { fontSize: 30 },
      } as const;
    }
    // default / regular phones
    return {
      ringBox: { width: 160 },
      innerBox: { width: 110 },
      borderBox: { width: 175 },
      centerBox: { width: 60 },
      groupOffset: { marginTop: 60 },
      scoreOffset: { marginTop: 15 },
      tapTextOffset: { marginTop: -35 },
      scoreText: { fontSize: 45 },
    } as const;
  });

  // derive numeric tokens from styles
  const RADIUS = (styles as any).ringBox.width as number;
  const INNER_RADIUS = (styles as any).innerBox.width as number;
  const BORDER_RADIUS = (styles as any).borderBox.width as number;
  const CENTER_RADIUS = (styles as any).centerBox.width as number;
  const GROUP_Y_OFFSET = (styles as any).groupOffset.marginTop as number;
  const scoreYOffset = (styles as any).scoreOffset.marginTop as number;
  const scoreFontSize = (styles as any).scoreText.fontSize as number;
  const tapTextMarginTop = (styles as any).tapTextOffset.marginTop as number;

  // Position the score slightly above the ring, consistent across sizes
  const scoreY = -(RADIUS + scoreYOffset);

  const [fillAngle, setFillAngle] = useState(0);
  const [isPlayerStartVisible, setIsPlayerStartVisible] = useState(true);
  const lottieRef = useRef<LottieView>(null);

  const iconIndex = currentPlayer.iconIndex;

  useEffect(() => {
    const percentage = Math.min(score / 5, 1);
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
    [fillAngle, INNER_RADIUS, RADIUS]
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
  }, [RADIUS, BORDER_RADIUS]);

  const sectionArcGenerator = useMemo(
    () => (index: number) => {
      const startAngle = -Math.PI / 2 + (Math.PI / 5) * index;
      const endAngle = startAngle + Math.PI / 5;
      return d3
        .arc()
        .innerRadius(INNER_RADIUS)
        .outerRadius(RADIUS)
        .startAngle(startAngle)
        .endAngle(endAngle);
    },
    [INNER_RADIUS, RADIUS]
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
      Array.from({ length: 5 }).map(
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
      <Svg width={RADIUS * 2 + 40} height={RADIUS + 180}>
        <G x={RADIUS + 20} y={RADIUS + GROUP_Y_OFFSET}>
          <SvgText
            x="0"
            y={scoreY}
            fontSize={scoreFontSize}
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
            width: CENTER_RADIUS * 2,
            height: CENTER_RADIUS * 2,
            borderRadius: CENTER_RADIUS,
          },
        ]}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <LottieView
          ref={lottieRef}
          source={playerIcons[iconIndex]}
          autoPlay
          loop
          style={{ width: CENTER_RADIUS * 2, height: CENTER_RADIUS * 2 }}
        />
      </TouchableOpacity>

      <View style={[styles.tapTextWrapper, { marginTop: tapTextMarginTop }]}>
        {isPlayerStartVisible && <FlashingText>Tap to Score</FlashingText>}
      </View>
    </View>
  );
};

const BASE_STYLES = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  tapButton: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 5,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  tapTextWrapper: {
    height: 40,
    marginLeft: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  // numeric tokens encoded as style props
  ringBox: { width: 160 }, // RADIUS
  innerBox: { width: 110 }, // INNER_RADIUS
  borderBox: { width: 175 }, // BORDER_RADIUS
  centerBox: { width: 60 }, // CENTER_RADIUS
  groupOffset: { marginTop: 60 }, // GROUP_Y_OFFSET
  scoreOffset: { marginTop: 15 }, // scoreYOffset
  tapTextOffset: { marginTop: -35 }, // tap text marginTop
  scoreText: { fontSize: 45 },
});
