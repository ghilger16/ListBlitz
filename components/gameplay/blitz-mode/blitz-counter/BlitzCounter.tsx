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

  // Determine device type flags (assuming they are defined somewhere in scope)
  // For this rewrite, assume isTablet and isSmallPhone are available variables.
  // If not, they should be imported or derived appropriately.
  const { isTablet, isSmallPhone } = useScreenInfo();

  // Dynamic sizing for the pill (start/tap button)
  const pillHeight = isTablet ? 50 : isSmallPhone ? 30 : 40;
  const pillFontSize = isTablet ? 38 : isSmallPhone ? 20 : 25;
  const pillBorderRadius = pillHeight / 2;
  const pillMarginTop = isTablet ? 12 : isSmallPhone ? 7 : 10;

  let svgWidth = 365;
  let svgHeight = 425;
  if (isTablet) {
    svgWidth = 550;
    svgHeight = 625;
  } else if (isSmallPhone) {
    svgWidth = 270;
    svgHeight = 325;
  }

  // Scale all drawing dimensions instead of only the SVG canvas
  const scale = isTablet ? 1.75 : isSmallPhone ? 0.85 : 1.15;
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
      .innerRadius(RADIUS)
      .outerRadius(RADIUS + 10)
      .startAngle(-Math.PI / 1 + MISSING_ANGLE / 2)
      .endAngle(endAngle);
    const animatedFillArc = d3
      .arc()
      .innerRadius(RADIUS)
      .outerRadius(RADIUS + 10)
      .startAngle(fillAngle)
      .endAngle(endAngle);
    return { fillArc, animatedFillArc };
  }, [fillAngle, isGameStarted, RADIUS]);

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
    <View style={[styles.container, { width: svgWidth, height: svgHeight }]}>
      <Svg width={svgWidth} height={svgHeight}>
        <G x={svgWidth / 2} y={svgWidth / 2}>
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
                  borderRadius: CENTER_RADIUS,
                  width: CENTER_RADIUS * 1.5,
                  height: CENTER_RADIUS * 1.5,
                  transform: [
                    { translateX: iconTranslateX },
                    { translateY: iconTranslateY },
                  ],
                }}
              />
            </G>
          )}
          <AnimatedSvgPath
            d={borderArcGenerator.fillArc({} as any) || ""}
            fill="none"
            stroke={isGameStarted ? "#FFF" : currentPlayer.startColor}
            strokeWidth={strokeW}
            strokeLinecap="round"
          />
          <AnimatedSvgPath
            d={borderArcGenerator.animatedFillArc({} as any) || ""}
            fill="none"
            stroke={isGameStarted ? currentPlayer.startColor : "transparent"}
            strokeWidth={strokeW}
            strokeLinecap="round"
          />
          <SvgText
            x="0"
            y={scoreY}
            fontSize={scoreFont}
            fontWeight="bold"
            fill="#fff"
            fontFamily="LuckiestGuy"
            textAnchor="middle"
          >
            {score}
          </SvgText>
          <SvgText
            x="0"
            y={timeY}
            fontSize={timeFont}
            fontWeight="bold"
            fill="#fff"
            textAnchor="middle"
          >
            {formatTime(displayTime)}
          </SvgText>
          {!isGameStarted && (
            <SvgText
              x="0"
              y={nameY}
              fontSize={nameFont}
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
              height: pillHeight,
              borderRadius: pillBorderRadius,
            },
          ]}
        >
          <TouchableOpacity activeOpacity={1} onPress={handleIncrement}>
            <Text
              style={[
                styles.pillText,
                { fontSize: pillFontSize, marginTop: pillMarginTop },
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

const styles = StyleSheet.create({
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
