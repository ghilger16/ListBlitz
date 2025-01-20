import React, { useEffect, useState } from "react";
import { Animated } from "react-native";
import * as Styled from "./FlashingText.styled";

interface FlashingTextProps {
  children: React.ReactNode;
  duration?: number;
}

export const FlashingText: React.FC<FlashingTextProps> = ({
  children,
  duration = 800, // Default duration for the flashing effect
}) => {
  const fadeAnim = useState(new Animated.Value(1))[0]; // Initial opacity is 1 (fully visible)

  useEffect(() => {
    // Step 1: Animate the opacity for the flashing effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0, // Fade out
          duration,
          useNativeDriver: true, // Native driver for performance
        }),
        Animated.timing(fadeAnim, {
          toValue: 1, // Fade in
          duration,
          useNativeDriver: true, // Native driver for performance
        }),
      ])
    ).start();
  }, [fadeAnim, duration]);

  return (
    <Styled.AnimatedText style={{ opacity: fadeAnim }}>
      {children}
    </Styled.AnimatedText>
  );
};
