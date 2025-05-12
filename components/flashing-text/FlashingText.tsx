import React, { useEffect, useState } from "react";
import { Animated, StyleSheet } from "react-native";

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

const styles = StyleSheet.create({
  animatedText: {
    fontSize: 14,
    color: "#fff",
    position: "absolute",
    textAlign: "center",
  },
});
