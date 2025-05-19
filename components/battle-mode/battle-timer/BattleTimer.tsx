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
import { playSound } from "components/utils";
import { tapSound } from "@Assets";
import { useGetIcons } from "@Services";
import LottieView from "lottie-react-native";

interface BattleTimerProps {
  score: number;
  currentPlayer: Player;
  onIncrement: () => void;
  onStart: () => void;
  isGameStarted: boolean;
  isCountdownActive: boolean;
  onTimeOut: () => void;
}

const RADIUS = 75;
const CENTER_RADIUS = 30;

const AnimatedSvgPath = Animated.createAnimatedComponent(SvgPath);

export const BattleTimer: React.FC<BattleTimerProps> = ({
  score,
  currentPlayer,
  onIncrement,
  onStart,
  isGameStarted,
  isCountdownActive,
  onTimeOut,
}) => {
  const { data: ICONS = [] } = useGetIcons();
  const lottieRef = useRef<LottieView>(null);
  const timer = 10;
  const animatedTimer = useRef(new Animated.Value(timer)).current;
  const flashAnim = useRef(new Animated.Value(0)).current;
  const [displayTime, setDisplayTime] = useState(timer);
  const [fillAngle, setFillAngle] = useState(Math.PI * 2);

  const iconIndex = currentPlayer.id - 1;

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
  }, [isCountdownActive, isGameStarted, score]);

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

  // Animate fill arc from white to player color when game starts
  const fillStrokeColor = isGameStarted ? animatedColor : "transparent";

  const borderArcGenerator = useMemo(() => {
    const fillArc = d3
      .arc()
      .innerRadius(RADIUS)
      .outerRadius(RADIUS + 10)
      .startAngle(0)
      .endAngle(Math.PI * 2);
    const animatedFillArc = d3
      .arc()
      .innerRadius(RADIUS)
      .outerRadius(RADIUS + 10)
      .startAngle(0)
      .endAngle(fillAngle);
    return { fillArc, animatedFillArc };
  }, [fillAngle]);

  const handleIncrement = () => {
    if (isGameStarted) {
      onIncrement();
      triggerFlash();
      playSound(tapSound);
    } else {
      onStart();
    }
  };

  return (
    <View style={styles.container}>
      <Svg width={320} height={375}>
        <G x={320 / 2} y={320 / 2}>
          <AnimatedSvgPath
            d={borderArcGenerator.fillArc({} as any) || ""}
            fill="none"
            stroke="#FFF"
            strokeWidth={12}
            strokeLinecap="round"
          />
          <AnimatedSvgPath
            d={borderArcGenerator.animatedFillArc({} as any) || ""}
            fill="none"
            stroke={fillStrokeColor}
            strokeWidth={12}
            strokeLinecap="round"
          />
          <SvgText
            x="0"
            y="20"
            fontSize="60"
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
    width: 320,
    height: 375,
  },
});
