import { useRef } from "react";
import { Animated } from "react-native";

export const useRoundOverAnimation = () => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const trigger = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -250,
        duration: 1100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1.1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return { slideAnim, scaleAnim, trigger };
};
