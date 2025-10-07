import React, { useState, useEffect, useRef, useMemo } from "react";
import { View, Animated, Easing, StyleSheet } from "react-native";
import Svg, { G, Path as SvgPath, Text as SvgText } from "react-native-svg";
import * as d3 from "d3-shape";
import { Player } from "@Context";
import { useResponsiveStyles } from "@Hooks";

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
  const styles = useResponsiveStyles(BASE_STYLES, (device) => {
    if (device.isLargeTablet) {
      return {
        svgBox: { width: 420, height: 540 },
        radiusBox: { width: 140 },
        strokeBox: { borderWidth: 24 },
        timeText: { fontSize: 110 },
      };
    }
    if (device.isTablet) {
      return {
        svgBox: { width: 350, height: 450 },
        radiusBox: { width: 115 },
        strokeBox: { borderWidth: 20 },
        timeText: { fontSize: 100 },
      };
    }
    if (device.isLargePhone) {
      return {
        svgBox: { width: 340, height: 390 },
        radiusBox: { width: 82 },
        strokeBox: { borderWidth: 14 },
        timeText: { fontSize: 70 },
      };
    }
    if (device.isSmallPhone) {
      return {
        svgBox: { width: 260, height: 285 },
        radiusBox: { width: 60 },
        strokeBox: { borderWidth: 10 },
        timeText: { fontSize: 40 },
      };
    }
    return {
      svgBox: { width: 320, height: 375 },
      radiusBox: { width: 75 },
      strokeBox: { borderWidth: 12 },
      timeText: { fontSize: 60 },
    };
  });

  const timer = 10;

  const containerWidth = (styles as any).svgBox.width as number;
  const containerHeight = (styles as any).svgBox.height as number;
  const radius = (styles as any).radiusBox.width as number;
  const strokeWidth = (styles as any).strokeBox.borderWidth as number;
  const timeFontSize = (styles as any).timeText.fontSize as number;

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
            fontSize={timeFontSize}
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

const BASE_STYLES = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  svgBox: { width: 320, height: 375 },
  radiusBox: { width: 75, height: 75 },
  strokeBox: { borderWidth: 12 },
  timeText: {
    fontSize: 60,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    fontFamily: "LuckiestGuy",
  },
});
