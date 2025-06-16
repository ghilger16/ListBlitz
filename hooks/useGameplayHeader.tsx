import { useLayoutEffect } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

import { useNavigation, router } from "expo-router";

import { stopSound, setMuted } from "@Utils";
import React from "react";

export const useGameplayHeader = (
  isMuted: boolean,
  setIsMuted: (muted: boolean) => void
) => {
  const navigation = useNavigation();

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
          <Text style={styles.backText}>←</Text>
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
          <Text style={styles.backText}>{isMuted ? "🔇" : "🔊"}</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, isMuted]);
};

const styles = StyleSheet.create({
  backButton: {
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  backText: {
    fontSize: 30,
    color: "#fff",
    fontWeight: "700",
  },
});
