import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

export const usePlayerSelectAnimations = () => {
  const glowAnim = useRef(new Animated.Value(0)).current;
  const entryAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1200,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    Animated.timing(entryAnim, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (shakeAnim) {
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 6,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -6,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [shakeAnim]);

  const glowInterpolation = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(255, 255, 255, 0.3)", "rgba(255, 255, 255, 1)"],
  });

  return { glowInterpolation, entryAnim, shakeAnim };
};
