import React, { useCallback, useMemo, useLayoutEffect } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import { useNavigation, router } from "expo-router";

import { GameSettings } from "@Context";

export const usePlayerSelectHeader = (gameSettings: GameSettings) => {
  const navigation = useNavigation();

  const handleBackPress = useCallback(() => {
    router.back();
  }, []);

  const headerOptions = useMemo(
    () => ({
      animation: "none",
      headerTransparent: true,
      headerTitle: () => (
        <Text style={styles.headerTitle}>✨ {gameSettings.blitzPackTitle}</Text>
      ),
      headerStyle: {
        backgroundColor: "#192c43",
      },
      headerLeft: () => (
        <TouchableOpacity
          onPress={handleBackPress}
          style={styles.headerLeftTouchable}
        >
          <Text style={styles.headerLeftText}>←</Text>
        </TouchableOpacity>
      ),
    }),
    [gameSettings.blitzPackTitle, handleBackPress]
  );

  useLayoutEffect(() => {
    navigation.setOptions(headerOptions);
  }, [navigation, headerOptions]);
};

const styles = StyleSheet.create({
  headerTitle: {
    fontFamily: "SourGummy",
    fontSize: 15,
    textTransform: "uppercase",
    color: "#fff",
    backgroundColor: "#0B3D91",
    paddingHorizontal: 25,
    paddingBottom: 5,
    borderRadius: 20,
    overflow: "hidden",
    textAlign: "center",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    letterSpacing: 1.5,
    borderWidth: 2,
    borderColor: "#61D4FF",
  },
  headerLeftTouchable: {
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  headerLeftText: {
    fontSize: 30,
    color: "#fff",
    fontWeight: "700",
  },
});
