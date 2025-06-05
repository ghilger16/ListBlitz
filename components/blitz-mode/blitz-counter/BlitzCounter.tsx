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
import { Player } from "@Context";
import { playSound, playTapSound } from "components/utils";
import { timerSound, winnerSound } from "@Assets";
import { playerIcons } from "@Services";
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

const RADIUS = 110;
const CENTER_RADIUS = 60;
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

  useEffect(() => {
    if (isGameStarted) {
      animatedTimer.setValue(timer);
      Animated.timing(animatedTimer, {
        toValue: 0,
        duration: timer * 1000,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
      playSound(timerSound, true);
    } else {
      playSound(winnerSound);
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
  }, [fillAngle, isGameStarted]);

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
    <View style={styles.container}>
      <Svg width={320} height={375}>
        <G x={320 / 2} y={320 / 2}>
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
                  transform: [{ translateX: 114 }, { translateY: 75 }],
                }}
              />
            </G>
          )}
          <AnimatedSvgPath
            d={borderArcGenerator.fillArc({} as any) || ""}
            fill="none"
            stroke={isGameStarted ? "#FFF" : currentPlayer.startColor}
            strokeWidth={12}
            strokeLinecap="round"
          />
          <AnimatedSvgPath
            d={borderArcGenerator.animatedFillArc({} as any) || ""}
            fill="none"
            stroke={isGameStarted ? currentPlayer.startColor : "transparent"}
            strokeWidth={12}
            strokeLinecap="round"
          />
          <SvgText
            x="0"
            y="70"
            fontSize="60"
            fontWeight="bold"
            fill="#fff"
            fontFamily="LuckiestGuy"
            textAnchor="middle"
          >
            {score}
          </SvgText>
          <SvgText
            x="0"
            y="115"
            fontSize="24"
            fontWeight="bold"
            fill="#fff"
            textAnchor="middle"
          >
            {formatTime(displayTime)}
          </SvgText>
          {!isGameStarted && (
            <SvgText
              x="0"
              y="150"
              fontSize="20"
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
          style={[styles.animatedPill, { backgroundColor: animatedColor }]}
        >
          <TouchableOpacity activeOpacity={1} onPress={handleIncrement}>
            <Text style={styles.pillText}>
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
    height: "100%",
    borderRadius: 20,
  },
  pillText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginTop: 12,
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
