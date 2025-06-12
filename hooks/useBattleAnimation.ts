import { Player } from "@Context";
import { useEffect, useRef } from "react";
import { Animated } from "react-native";

export const useSlideInAnimation = (direction: "left" | "right") => {
  const slideAnim = useRef(
    new Animated.Value(direction === "right" ? 300 : -300)
  ).current;

  useEffect(() => {
    slideAnim.setValue(direction === "right" ? 300 : -300);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [direction]);

  return slideAnim;
};

export const usePressScaleAnimation = () => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return { scaleAnim, onPressIn, onPressOut };
};

export const useBattleAnimation = (currentMatch: Player[]) => {
  const vsScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    vsScale.setValue(2.5);
    Animated.spring(vsScale, {
      toValue: 1.5,
      useNativeDriver: true,
      friction: 5,
      tension: 150,
    }).start();
  }, [currentMatch]); // <- automatically triggers when currentMatch changes

  return { vsScale };
};
