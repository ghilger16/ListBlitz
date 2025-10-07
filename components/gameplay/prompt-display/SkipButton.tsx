import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from "react-native";
import { useResponsiveStyles } from "@Hooks";

export const SkipButton: React.FC<{
  playerColor: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}> = ({ playerColor, onPress, style }) => {
  const BASE_STYLES = StyleSheet.create({
    button: {
      minWidth: 86,
      height: 40,
      paddingHorizontal: 14,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#FFD700",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.28,
      shadowRadius: 4.5,
      elevation: 5,
      flexDirection: "row",
      gap: 6,
      marginTop: 8,
    },
    label: {
      fontFamily: "LuckiestGuy",
      fontWeight: "bold",
      color: "#000",
      fontSize: 18,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
  });

  const styles = useResponsiveStyles(BASE_STYLES, (device) => {
    const fs = (base: number) => {
      if (device.isLargeTablet) return Math.round(base * 1.4);
      if (device.isTablet) return Math.round(base * 1.25);
      if (device.isLargePhone) return Math.round(base * 1.1);
      if (device.isSmallPhone) return Math.round(base * 0.9);
      return base;
    };

    const height = device.isLargeTablet
      ? 60
      : device.isTablet
      ? 52
      : device.isSmallPhone
      ? 34
      : 40;

    const minWidth = device.isLargeTablet
      ? 120
      : device.isTablet
      ? 110
      : device.isSmallPhone
      ? 64
      : 86;

    const padH = device.isLargeTablet
      ? 22
      : device.isTablet
      ? 18
      : device.isSmallPhone
      ? 10
      : 14;

    const radius = device.isLargeTablet
      ? 26
      : device.isTablet
      ? 22
      : device.isSmallPhone
      ? 14
      : 16;

    return {
      button: {
        height,
        minWidth,
        paddingHorizontal: padH,
        borderRadius: radius,
        backgroundColor: playerColor,
      } as ViewStyle,
      label: { fontSize: fs(20) },
    } as const;
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, style]}
      activeOpacity={0.9}
      hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
      accessibilityRole="button"
      accessibilityLabel="Skip"
    >
      <Text style={styles.label}>Skip</Text>
    </TouchableOpacity>
  );
};
