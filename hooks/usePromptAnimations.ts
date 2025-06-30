import { useEffect, useState } from "react";
import { Animated } from "react-native";

export const usePromptAnimations = (
  countdown: number | "GO!" | null,
  prompt: string
) => {
  const [bounceValue] = useState(new Animated.Value(1));
  const [fadeValue] = useState(new Animated.Value(0));
  const [scaleValue] = useState(new Animated.Value(0.8));

  const triggerBounceAnimation = () => {
    Animated.sequence([
      Animated.spring(bounceValue, {
        toValue: 1.2,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.spring(bounceValue, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    if (countdown !== null) {
      fadeValue.setValue(0);
      scaleValue.setValue(0.8);
      Animated.parallel([
        Animated.timing(fadeValue, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(scaleValue, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [countdown]);

  useEffect(() => {
    if (countdown === null) {
      triggerBounceAnimation();
    }
  }, [countdown]);

  useEffect(() => {
    triggerBounceAnimation();
  }, [prompt]);

  return { bounceValue, fadeValue, scaleValue };
};
