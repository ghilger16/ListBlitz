import React, { useState, useEffect, useRef, useMemo } from "react";
import { View, TouchableOpacity, Text, Animated, Easing } from "react-native";
import Svg, {
  Defs,
  G,
  LinearGradient,
  Stop,
  Path as SvgPath,
} from "react-native-svg";
import * as d3 from "d3-shape";
import LottieView from "lottie-react-native";
import * as Styled from "./BlitzCounter.styled";
import { useGetIcons } from "@Services";
import { COLORS, Player } from "@Context";

interface BlitzCounterProps {
  score: number;
  currentPlayer: Player;
  onIncrement: () => void;
  onStart: () => void;
  isGameStarted: boolean;
  timer: number;
}

// Constants
const RADIUS = 125;
const INNER_RADIUS = 80;
const BORDER_RADIUS = 140;
const CENTER_RADIUS = 60;
const MISSING_ANGLE = Math.PI * 0.4; // 15% missing

const AnimatedSvgPath = Animated.createAnimatedComponent(SvgPath);

export const BlitzCounter: React.FC<BlitzCounterProps> = ({
  score,
  currentPlayer,
  onIncrement,
  onStart,
  isGameStarted,
  timer,
}) => {
  const { data: ICONS = [] } = useGetIcons();
  const lottieRef = useRef<LottieView>(null);
  const animatedTimer = useRef(new Animated.Value(timer)).current;
  const flashAnim = useRef(new Animated.Value(0)).current; // Flash animation
  const [displayTime, setDisplayTime] = useState(timer);
  const [fillAngle, setFillAngle] = useState(
    Math.PI * 1 - MISSING_ANGLE / 2 // Start full
  );

  // Format timer into MM:SS (1:00, 0:59, etc.)
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Ensure valid icon index
  const iconIndex = currentPlayer.id + (1 % ICONS.length);

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
    outputRange: ["#f6c212", "#ffffff"], // Flashing effect (orange to white)
  });

  // Arc generator for dynamic fill
  const arcGenerator = useMemo(
    () =>
      d3
        .arc()
        .innerRadius(INNER_RADIUS)
        .outerRadius(RADIUS)
        .startAngle(-Math.PI / 1 + MISSING_ANGLE / 2)
        .endAngle(fillAngle),
    [fillAngle]
  );

  const borderArcGenerator = useMemo(() => {
    const gap = 0.3; // Adjust this value to control the size of the gap

    // First arc section: before the gap
    const arc1 = d3
      .arc()
      .innerRadius(RADIUS + 10)
      .outerRadius(BORDER_RADIUS)
      .startAngle(-Math.PI / 1 + MISSING_ANGLE / 2)
      .endAngle(-Math.PI / 2 + Math.PI / 2 - gap);

    // Second arc section: after the gap
    const arc2 = d3
      .arc()
      .innerRadius(RADIUS + 10)
      .outerRadius(BORDER_RADIUS)
      .startAngle(-Math.PI / 2 + Math.PI / 2 + gap) // Starts after the gap
      .endAngle(Math.PI / 1 - MISSING_ANGLE / 2); // Ends at the top

    return [arc1, arc2];
  }, []);

  // **📌 Calculate pill position at the missing arc**
  const gapAngle =
    -Math.PI / 1 + MISSING_ANGLE / 2 + (Math.PI * 2 - MISSING_ANGLE);
  const pillOffset = RADIUS + 30; // Push outside the donut
  const pillX = pillOffset * Math.cos(gapAngle);
  const pillY = pillOffset * Math.sin(gapAngle);

  return (
    <Styled.Container>
      {/* SVG Donut */}
      <Svg width={RADIUS * 2 + 40} height={RADIUS + 200}>
        <G x={RADIUS + 20} y={RADIUS + 20}>
          <Defs>
            <LinearGradient
              id={`grad-${currentPlayer.id}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <Stop offset="0%" stopColor={currentPlayer.startColor} />
              <Stop offset="100%" stopColor={currentPlayer.endColor} />
            </LinearGradient>
          </Defs>
          <Styled.Score>
            {ICONS.length > 0 && (
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
                  width: CENTER_RADIUS,
                  height: CENTER_RADIUS,
                }}
              />
            )}
          </Styled.Score>
          <AnimatedSvgPath
            d={borderArcGenerator[0]({} as any) || ""}
            fill="none"
            stroke={animatedColor}
            strokeWidth={5}
          />
          <AnimatedSvgPath
            d={borderArcGenerator[1]({} as any) || ""}
            fill="none"
            stroke={animatedColor}
            strokeWidth={5}
          />

          {/* Dynamic Fill */}
          <AnimatedSvgPath
            d={arcGenerator({} as any) || ""}
            fill={`url(#grad-${currentPlayer.id})`}
          />
        </G>
      </Svg>
      <Styled.Score2>{score}</Styled.Score2>
      <View
        style={{
          position: "absolute",
          width: CENTER_RADIUS,
          height: CENTER_RADIUS,
          alignItems: "center",
          justifyContent: "center",
          top: RADIUS - CENTER_RADIUS + 30,
        }}
      >
        <Styled.TimerText>{formatTime(displayTime)}</Styled.TimerText>
      </View>
      <Styled.PillButton>
        <Animated.View
          style={{
            backgroundColor: animatedColor,
            width: "100%",
            height: "100%",
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              triggerFlash(); // Flash effect
              isGameStarted ? onIncrement() : onStart(); // ✅ Calls onStart first, then onIncrement
            }}
          >
            <Styled.PillButtonText>
              {isGameStarted ? "Tap to Score" : `Start ${currentPlayer.name}`}
            </Styled.PillButtonText>
          </TouchableOpacity>
        </Animated.View>
      </Styled.PillButton>
    </Styled.Container>
  );
};
