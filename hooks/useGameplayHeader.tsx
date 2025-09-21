import { useLayoutEffect } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

import { useNavigation, router } from "expo-router";

import { stopSound, setMuted } from "@Utils";
import React from "react";
import { useScreenInfo } from "@Utils";

export const useGameplayHeader = (
  isMuted: boolean,
  setIsMuted: (muted: boolean) => void
) => {
  const navigation = useNavigation();
  const { isTablet, isSmallPhone } = useScreenInfo();
  const iconSize = isTablet ? 40 : isSmallPhone ? 26 : 30;

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
          <Text style={[styles.backText, { fontSize: iconSize }]}>←</Text>
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
          <Text style={[styles.backText, { fontSize: iconSize }]}>
            {isMuted ? "🔇" : "🔊"}
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, isMuted, iconSize]);
};

const styles = StyleSheet.create({
  backButton: {
    paddingHorizontal: 15,
    paddingVertical: 0,
  },
  backText: {
    color: "#fff",
    fontWeight: "700",
  },
});
