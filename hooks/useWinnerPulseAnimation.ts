import { useRef } from "react";
import { Animated } from "react-native";

export const useWinnerPulseAnimation = () => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const trigger = () => {
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.2,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };
  return { pulseAnim, trigger };
};
