import { useEffect, useMemo, useRef } from "react";
import { Animated, Easing } from "react-native";
import { useGetBlitzPacks } from "@Services";

export const usePackLibraryAnimations = () => {
  const { data: blitzPacks = [] } = useGetBlitzPacks();
  const animatedValues = useRef<Animated.Value[]>([]).current;
  const headerFadeAnim = useRef(new Animated.Value(0)).current;

  useMemo(() => {
    if (blitzPacks.length && animatedValues.length === 0) {
      blitzPacks.forEach((_, i) => {
        animatedValues[i] = new Animated.Value(0);
      });
    }
  }, [blitzPacks]);

  useEffect(() => {
    Animated.timing(headerFadeAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    blitzPacks.forEach((_, i) => {
      if (!animatedValues[i]) {
        animatedValues[i] = new Animated.Value(0);
      }
    });

    Animated.stagger(
      150,
      animatedValues.map((val) =>
        Animated.timing(val, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        })
      )
    ).start();
  }, [blitzPacks]);

  return { animatedValues, headerFadeAnim, blitzPacks };
};
