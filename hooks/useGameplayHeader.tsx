import { useLayoutEffect } from "react";
import { TouchableOpacity, Text } from "react-native";

import { useNavigation, router } from "expo-router";

import { stopSound, setMuted } from "@Utils";
import React from "react";
import { useResponsiveStyles } from "@Hooks";

export const useGameplayHeader = (
  isMuted: boolean,
  setIsMuted: (muted: boolean) => void
) => {
  const navigation = useNavigation();
  const styles = useResponsiveStyles(BASE_STYLES, (device) => ({
    iconSize: device.isLargeTablet
      ? 50
      : device.isTablet
      ? 40
      : device.isLargePhone
      ? 34
      : device.isSmallPhone
      ? 26
      : 30,
  }));

  useLayoutEffect(() => {
    navigation.setOptions({
      animation: "none",
      headerTransparent: true,
      headerTitle: "",

      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            stopSound();
            router.back();
          }}
          style={styles.backButton}
        >
          <Text style={[styles.backText, { fontSize: styles.iconSize }]}>
            ←
          </Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            const nextMute = !isMuted;
            setIsMuted(nextMute);
            setMuted(nextMute);
          }}
          style={styles.backButton}
        >
          <Text style={[styles.backText, { fontSize: styles.iconSize }]}>
            {isMuted ? "🔇" : "🔊"}
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, isMuted, styles.iconSize]);
};

const BASE_STYLES = {
  backButton: {
    paddingHorizontal: 15,
    paddingVertical: 0,
  },
  backText: {
    color: "#fff",
    fontWeight: "700",
  },
  iconSize: 0,
} as const;
