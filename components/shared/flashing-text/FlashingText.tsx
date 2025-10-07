import React, { useEffect, useState } from "react";
import { Animated } from "react-native";
import { useResponsiveStyles } from "@Hooks";

interface FlashingTextProps {
  children: React.ReactNode;
  duration?: number;
  style?: any;
}

export const FlashingText: React.FC<FlashingTextProps> = ({
  children,
  duration = 800,
  style,
}) => {
  const fadeAnim = useState(new Animated.Value(1))[0];

  const styles = useResponsiveStyles(BASE_STYLES, (device) => ({
    animatedText: {
      fontSize: device.isLargeTablet
        ? 30
        : device.isTablet
        ? 25
        : device.isLargePhone
        ? 22
        : device.isSmallPhone
        ? 15
        : 20,
    },
  }));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim, duration]);

  return (
    <Animated.Text style={[styles.animatedText, style, { opacity: fadeAnim }]}>
      {children}
    </Animated.Text>
  );
};

const BASE_STYLES = {
  animatedText: {
    color: "#fff",
    textAlign: "center",
  },
} as const;
