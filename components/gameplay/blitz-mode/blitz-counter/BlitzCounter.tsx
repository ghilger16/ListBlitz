import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  View,
  TouchableOpacity,
  Animated,
  Easing,
  StyleSheet,
  Text,
} from "react-native";
import Svg, { G, Path as SvgPath, Text as SvgText } from "react-native-svg";
import * as d3 from "d3-shape";
import { Player, playerIcons } from "@Context";
import { playSound, playTapSound, stopSound, useScreenInfo } from "@Utils";
import { blitzTimerSound } from "@Assets";

import LottieView from "lottie-react-native";
import { useResponsiveStyles } from "@Hooks";

interface BlitzCounterProps {
  score: number;
  currentPlayer: Player;
  onIncrement: () => void;
  onStart: () => void;
  isGameStarted: boolean;
  timer: number;
  isCountdownActive: boolean;
}

const BASE_RADIUS = 110;
const BASE_CENTER_RADIUS = 60;
const MISSING_ANGLE = Math.PI * 0.3;

const AnimatedSvgPath = Animated.createAnimatedComponent(SvgPath);

export const BlitzCounter: React.FC<BlitzCounterProps> = ({
  score,
  currentPlayer,
  onIncrement,
  onStart,
  isGameStarted,
  timer,
  isCountdownActive,
}) => {
  const { device } = useScreenInfo();

  const responsive = useMemo(() => {
    let svgWidth = 365;
    let svgHeight = 425;
    let scale = 1.15;
    let pillHeight = 40;
    let pillFontSize = 25;
    let pillMarginTop = 10;

    if (device.isLargeTablet) {
      svgWidth = 660; // ~20% larger than tablet
      svgHeight = 750;
      scale = 2.1; // ~20% larger than tablet scale
      pillHeight = 60;
      pillFontSize = 45;
      pillMarginTop = 15;
    } else if (device.isTablet) {
      svgWidth = 550;
      svgHeight = 625;
      scale = 1.75;
      pillHeight = 50;
      pillFontSize = 38;
      pillMarginTop = 12;
    } else if (device.isLargePhone) {
      svgWidth = 352; // 10% larger than 320
      svgHeight = 412; // 10% larger than 375
      scale = 1.1; // 10% increase
      pillHeight = 38.5; // 10% larger than 35
      pillFontSize = 24; // ~10% larger than 22
      pillMarginTop = 10;
    } else if (device.isSmallPhone) {
      svgWidth = 270;
      svgHeight = 325;
      scale = 0.85;
      pillHeight = 30;
      pillFontSize = 20;
      pillMarginTop = 7;
    }

    const RADIUS = BASE_RADIUS * scale;
    const CENTER_RADIUS = BASE_CENTER_RADIUS * scale;
    const strokeW = 12 * scale;
    const scoreFont = 60 * scale;
    const timeFont = 24 * scale;
    const nameFont = 20 * scale;
    const iconTranslateX = 114 * scale;
    const iconTranslateY = 75 * scale;
    const scoreY = 70 * scale;
    const timeY = 115 * scale;
    const nameY = 150 * scale;

    return {
      svgWidth,
      svgHeight,
      RADIUS,
      CENTER_RADIUS,
      strokeW,
      scoreFont,
      timeFont,
      nameFont,
      iconTranslateX,
      iconTranslateY,
      scoreY,
      timeY,
      nameY,
      pillHeight,
      pillFontSize,
      pillMarginTop,
      pillBorderRadius: pillHeight / 2,
    } as const;
  }, [device]);

  const styles = useResponsiveStyles(BASE_STYLES, () => ({} as const));

  const lottieRef = useRef<LottieView>(null);
  const animatedTimer = useRef(new Animated.Value(timer)).current;
  const flashAnim = useRef(new Animated.Value(0)).current;
  const [displayTime, setDisplayTime] = useState(timer);
  const [fillAngle, setFillAngle] = useState(Math.PI * 1 - MISSING_ANGLE / 2);

  const iconIndex = currentPlayer.iconIndex;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  useEffect(() => {
    if (isGameStarted) {
      animatedTimer.setValue(timer);
      Animated.timing(animatedTimer, {
        toValue: 0,
        duration: timer * 1000,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
      playSound(blitzTimerSound);
    } else {
      stopSound();
    }
  }, [isGameStarted]);

  useEffect(() => {
    const listenerId = animatedTimer.addListener(({ value }) => {
      setDisplayTime(Math.ceil(value));
      setFillAngle(
        -Math.PI / 1 +
          MISSING_ANGLE / 2 +
          (value / timer) * (Math.PI * 2 - MISSING_ANGLE)
      );
    });
    return () => {
      animatedTimer.removeListener(listenerId);
    };
  }, []);

  const triggerFlash = () => {
    flashAnim.setValue(1);
    Animated.timing(flashAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };

  const animatedColor = flashAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [`${currentPlayer.startColor}`, "#ffffff"],
  });

  const borderArcGenerator = useMemo(() => {
    const endAngle = Math.PI * 1 - MISSING_ANGLE / 2;
    const fillArc = d3
      .arc()
      .innerRadius(responsive.RADIUS)
      .outerRadius(responsive.RADIUS + 10)
      .startAngle(-Math.PI / 1 + MISSING_ANGLE / 2)
      .endAngle(endAngle);
    const animatedFillArc = d3
      .arc()
      .innerRadius(responsive.RADIUS)
      .outerRadius(responsive.RADIUS + 10)
      .startAngle(fillAngle)
      .endAngle(endAngle);
    return { fillArc, animatedFillArc };
  }, [fillAngle, isGameStarted, responsive.RADIUS]);

  const handleIncrement = () => {
    if (isCountdownActive) return;
    if (isGameStarted) {
      onIncrement();
      triggerFlash();
      playTapSound();
    } else {
      onStart();
    }
  };

  return (
    <View
      style={[
        styles.container,
        { width: responsive.svgWidth, height: responsive.svgHeight },
      ]}
    >
      <Svg width={responsive.svgWidth} height={responsive.svgHeight}>
        <G x={responsive.svgWidth / 2} y={responsive.svgWidth / 2}>
          {playerIcons.length > 0 && (
            <G>
              <LottieView
                ref={lottieRef}
                source={playerIcons[iconIndex]}
                autoPlay
                loop
                style={{
                  borderWidth: 5,
                  borderColor: currentPlayer.startColor,
                  backgroundColor: "#fff",
                  borderRadius: responsive.CENTER_RADIUS,
                  width: responsive.CENTER_RADIUS * 1.5,
                  height: responsive.CENTER_RADIUS * 1.5,
                  transform: [
                    { translateX: responsive.iconTranslateX },
                    { translateY: responsive.iconTranslateY },
                  ],
                }}
              />
            </G>
          )}
          <AnimatedSvgPath
            d={borderArcGenerator.fillArc({} as any) || ""}
            fill="none"
            stroke={isGameStarted ? "#FFF" : currentPlayer.startColor}
            strokeWidth={responsive.strokeW}
            strokeLinecap="round"
          />
          <AnimatedSvgPath
            d={borderArcGenerator.animatedFillArc({} as any) || ""}
            fill="none"
            stroke={isGameStarted ? currentPlayer.startColor : "transparent"}
            strokeWidth={responsive.strokeW}
            strokeLinecap="round"
          />
          <SvgText
            x="0"
            y={responsive.scoreY}
            fontSize={responsive.scoreFont}
            fontWeight="bold"
            fill="#fff"
            fontFamily="LuckiestGuy"
            textAnchor="middle"
          >
            {score}
          </SvgText>
          <SvgText
            x="0"
            y={responsive.timeY}
            fontSize={responsive.timeFont}
            fontWeight="bold"
            fill="#fff"
            textAnchor="middle"
          >
            {formatTime(displayTime)}
          </SvgText>
          {!isGameStarted && (
            <SvgText
              x="0"
              y={responsive.nameY}
              fontSize={responsive.nameFont}
              fontWeight="bold"
              fill="#fff"
              textAnchor="middle"
              fontFamily="LuckiestGuy"
            >
              {currentPlayer.name}
            </SvgText>
          )}
        </G>
      </Svg>
      {/* <Text style={styles.playerNameText}>{currentPlayer.name}</Text> */}
      <View style={styles.pillWrapper}>
        <Animated.View
          style={[
            styles.animatedPill,
            {
              backgroundColor: animatedColor,
              height: responsive.pillHeight,
              borderRadius: responsive.pillBorderRadius,
            },
          ]}
        >
          <TouchableOpacity activeOpacity={1} onPress={handleIncrement}>
            <Text
              style={[
                styles.pillText,
                {
                  fontSize: responsive.pillFontSize,
                  marginTop: responsive.pillMarginTop,
                },
              ]}
            >
              {isGameStarted ? "Tap to Score" : `Start`}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

const BASE_STYLES = StyleSheet.create({
  container: {
    alignItems: "center",
    width: 320,
    height: 375,
  },
  pillWrapper: {
    position: "absolute",
    bottom: "5%",
    width: "105%",
    height: 40,
    alignItems: "center",
  },
  animatedPill: {
    width: "90%",
    // height and borderRadius are set dynamically
  },
  pillText: {
    // fontSize and marginTop are set dynamically
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    fontFamily: "LuckiestGuy",
  },
  playerNameText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginTop: -10,
    marginBottom: 10,
    fontFamily: "LuckiestGuy",
    zIndex: 2,
  },
});
