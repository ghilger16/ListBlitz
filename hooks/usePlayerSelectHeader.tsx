import React, { useLayoutEffect } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useNavigation, router } from "expo-router";
import { useResponsiveStyles } from "@Hooks";

const BASE_STYLES = StyleSheet.create({
  headerTitle: {
    fontFamily: "SourGummy",
    textTransform: "uppercase",
    color: "#fff",
    fontSize: 18,
  },
  headerLeftText: {
    color: "#fff",
    fontSize: 24,
  },
} as const);

export const usePlayerSelectHeader = (blitzPackTitle: string) => {
  const navigation = useNavigation();

  const styles = useResponsiveStyles(BASE_STYLES, (device) => {
    const fs = (base: number) => {
      if (device.isLargeTablet) return Math.round(base * 2);
      if (device.isTablet) return Math.round(base * 1.8);
      if (device.isLargePhone) return Math.round(base * 1.2);
      if (device.isSmallPhone) return Math.round(base * 0.9);
      return base;
    };

    return {
      headerTitle: { fontSize: fs(18) },
      headerLeftText: { fontSize: fs(24) },
    } as const;
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: blitzPackTitle,
      headerTitleAlign: "center",
      headerTitleStyle: styles.headerTitle,

      headerLeft: () => (
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.headerLeftText}>←</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, blitzPackTitle, styles]);
};
