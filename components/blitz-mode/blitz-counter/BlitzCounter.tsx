import React, { useState, useEffect, useRef, useMemo } from "react";
import { TouchableOpacity, Animated, Easing } from "react-native";
import Svg, { G, Path as SvgPath } from "react-native-svg";
import * as d3 from "d3-shape";
import LottieView from "lottie-react-native";
import * as Styled from "./BlitzCounter.styled";
import { useGetIcons } from "@Services";
import { COLORS, Player } from "@Context";
import { playSound } from "components/utils";
import { tapSound } from "@Assets";

interface BlitzCounterProps {
  score: number;
  currentPlayer: Player;
  onIncrement: () => void;
  onStart: () => void;
  isGameStarted: boolean;
  timer: number;
  isCountdownActive: boolean;
}

// Constants
const RADIUS = 110;
const INNER_RADIUS = 80;
const BORDER_RADIUS = 140;
const CENTER_RADIUS = 60;
const MISSING_ANGLE = Math.PI * 0.3; // 15% missing

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
  // const { data: ICONS = [] } = useGetIcons();
  // const lottieRef = useRef<LottieView>(null);
  const animatedTimer = useRef(new Animated.Value(timer)).current;
  const flashAnim = useRef(new Animated.Value(0)).current; // Flash animation
  const [displayTime, setDisplayTime] = useState(timer);
  const [fillAngle, setFillAngle] = useState(Math.PI * 1 - MISSING_ANGLE / 2);

  // Format timer into MM:SS (1:00, 0:59, etc.)
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Ensure valid icon index
  // const iconIndex = currentPlayer.id + (1 % ICONS.length);

  // Start animation when game starts
  useEffect(() => {
    if (isGameStarted) {
      animatedTimer.setValue(timer);
      Animated.timing(animatedTimer, {
        toValue: 0,
        duration: timer * 1000,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();
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

  // **📌 Flash Animation Triggered on onIncrement**
  const triggerFlash = () => {
    flashAnim.setValue(1);
    Animated.timing(flashAnim, {
      toValue: 0,
      duration: 300, // Quick flash effect
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };

  // Modify color based on animation
  const animatedColor = flashAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [`${currentPlayer.startColor}`, "#ffffff"], // Flashing effect (orange to white)
  });

  // Arc generator for dynamic fill
  // const arcGenerator = useMemo(
  //   () =>
  //     d3
  //       .arc()
  //       .innerRadius(INNER_RADIUS)
  //       .outerRadius(RADIUS)
  //       .startAngle(-Math.PI / 1 + MISSING_ANGLE / 2)
  //       .endAngle(fillAngle),
  //   [fillAngle]
  // );

  const borderArcGenerator = useMemo(() => {
    const gap = 0.01;
    const startAngle = -Math.PI / 1 + MISSING_ANGLE / 2; // Start at 7 o'clock (180° + 30°)
    const endAngle = Math.PI * 1 - MISSING_ANGLE / 2;

    const fillArc = d3
      .arc()
      .innerRadius(RADIUS)
      .outerRadius(RADIUS + 10) // Border thickness
      .startAngle(startAngle)
      .endAngle(endAngle); // Start full);

    const animatedFillArc = d3
      .arc()
      .innerRadius(RADIUS)
      .outerRadius(RADIUS + 10) // Border thickness
      .startAngle(fillAngle)
      .endAngle(endAngle); // Start full);

    return [fillArc, animatedFillArc];
  }, [fillAngle]);

  // **📌 Calculate pill position at the missing arc**
  const gapAngle =
    -Math.PI / 1 + MISSING_ANGLE / 2 + (Math.PI * 2 - MISSING_ANGLE);
  const pillOffset = RADIUS + 30; // Push outside the donut
  const pillX = pillOffset * Math.cos(gapAngle);
  const pillY = pillOffset * Math.sin(gapAngle);

  const handleIncrement = () => {
    if (isCountdownActive) return;
    if (isGameStarted) {
      onIncrement();
      triggerFlash();
      playSound(tapSound);
    } else {
      onStart();
    }
  };

  return (
    <Styled.Container>
      <Svg width={320} height={375}>
        <G x={320 / 2} y={320 / 2}>
          {/* {ICONS.length > 0 && (
            <G>
              <LottieView
                ref={lottieRef}
                source={ICONS[iconIndex] ?? ICONS[0]}
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
          )} */}

          <AnimatedSvgPath
            d={borderArcGenerator[0]({} as any) || ""}
            fill="none"
            stroke={"#FFF"}
            strokeWidth={12}
            strokeLinecap="round"
          />
          <AnimatedSvgPath
            d={borderArcGenerator[1]({} as any) || ""}
            fill="none"
            stroke={currentPlayer.startColor}
            strokeWidth={12}
            strokeLinecap="round"
          />

          <Styled.SvgScoreText x="0" y="70">
            {score}
          </Styled.SvgScoreText>
          <Styled.SvgTimerText x="0" y="115">
            {formatTime(displayTime)}
          </Styled.SvgTimerText>
        </G>
      </Svg>

      <Styled.PillButtonWrapper>
        <Animated.View
          style={{
            backgroundColor: animatedColor,
            width: "90%",
            height: "100%",
            borderRadius: 20,
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              handleIncrement();
            }}
          >
            <Styled.PillButtonText>
              {isGameStarted ? "Tap to Score" : `Start`}
            </Styled.PillButtonText>
          </TouchableOpacity>
        </Animated.View>
      </Styled.PillButtonWrapper>
    </Styled.Container>
  );
};
