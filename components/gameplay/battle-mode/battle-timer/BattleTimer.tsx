import React, { useState, useEffect, useRef, useMemo } from "react";
import { View, Animated, Easing, StyleSheet } from "react-native";
import Svg, { G, Path as SvgPath, Text as SvgText } from "react-native-svg";
import * as d3 from "d3-shape";
import { Player } from "@Context";
import { useScreenInfo } from "@Utils";

interface BattleTimerProps {
  currentPlayer: Player;
  onStart: () => void;
  isGameStarted: boolean;
  isCountdownActive: boolean;
  onTimeOut: () => void;
}

const AnimatedSvgPath = Animated.createAnimatedComponent(SvgPath);

export const BattleTimer: React.FC<BattleTimerProps> = ({
  currentPlayer,
  isGameStarted,
  isCountdownActive,
  onTimeOut,
}) => {
  const { isTablet, isSmallPhone } = useScreenInfo();

  const timer = 10;
  // const size = isTablet ? 400 : isSmallPhone ? 100 : 320;
  const radius = isTablet ? 150 : isSmallPhone ? 60 : 75;
  const containerWidth = isTablet ? 350 : isSmallPhone ? 260 : 320;
  const containerHeight = isTablet ? 450 : isSmallPhone ? 285 : 375;

  const strokeWidth = isTablet ? 20 : isSmallPhone ? 10 : 12;

  const animatedTimer = useRef(new Animated.Value(timer)).current;
  const flashAnim = useRef(new Animated.Value(0)).current;
  const [displayTime, setDisplayTime] = useState(timer);
  const [fillAngle, setFillAngle] = useState(Math.PI * 2);

  useEffect(() => {
    if (isGameStarted && isCountdownActive) {
      setDisplayTime(timer);
      setFillAngle(Math.PI * 2);
      animatedTimer.setValue(timer);
      Animated.timing(animatedTimer, {
        toValue: 0,
        duration: timer * 1000,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
    }
  }, [isCountdownActive, isGameStarted]);

  useEffect(() => {
    const listenerId = animatedTimer.addListener(({ value }) => {
      setDisplayTime(Math.ceil(value));
      setFillAngle((value / timer) * Math.PI * 2);

      if (value <= 0) {
        onTimeOut();
      }
    });
    return () => {
      animatedTimer.removeListener(listenerId);
    };
  }, []);

  const animatedColor = flashAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [`${currentPlayer.startColor}`, "#ffffff"],
  });

  const fillStrokeColor = isGameStarted ? animatedColor : "transparent";

  const borderArcGenerator = useMemo(() => {
    const fillArc = d3
      .arc()
      .innerRadius(radius)
      .outerRadius(radius + 10)
      .startAngle(0)
      .endAngle(Math.PI * 2);
    const animatedFillArc = d3
      .arc()
      .innerRadius(radius)
      .outerRadius(radius + 10)
      .startAngle(0)
      .endAngle(fillAngle);
    return { fillArc, animatedFillArc };
  }, [fillAngle, radius]);

  return (
    <View style={styles.container}>
      <Svg width={containerWidth} height={containerHeight}>
        <G x={containerWidth / 2} y={containerWidth / 2}>
          <AnimatedSvgPath
            d={borderArcGenerator.fillArc({} as any) || ""}
            fill="none"
            stroke={isGameStarted ? "#FFF" : currentPlayer.startColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <AnimatedSvgPath
            d={borderArcGenerator.animatedFillArc({} as any) || ""}
            fill="none"
            stroke={fillStrokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <SvgText
            x="0"
            y="20"
            fontSize={isTablet ? 100 : isSmallPhone ? 40 : 60}
            fontWeight="bold"
            fill="#fff"
            textAnchor="middle"
            fontFamily="LuckiestGuy"
          >
            {displayTime}
          </SvgText>
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
});
