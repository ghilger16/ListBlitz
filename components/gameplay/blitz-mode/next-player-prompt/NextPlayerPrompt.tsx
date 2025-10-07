// NextPlayerPrompt.tsx
import React from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import LottieView from "lottie-react-native";
import { Player } from "@Context";
import { useResponsiveStyles } from "@Hooks";

interface NextPlayerPromptProps {
  onNextPlayerClick: () => void;
  iconSource: any;
  nextPlayer: Player;
}

export const NextPlayerPrompt: React.FC<NextPlayerPromptProps> = ({
  onNextPlayerClick,
  iconSource,
  nextPlayer,
}) => {
  const styles = useResponsiveStyles(BASE_STYLES, (device) => {
    const fs = (base: number) => {
      if (device.isLargeTablet) return Math.round(base * 1.8);
      if (device.isTablet) return Math.round(base * 1.5);
      if (device.isLargePhone) return Math.round(base * 1.08);
      if (device.isSmallPhone) return Math.round(base * 0.9);
      return base;
    };

    const containerSize = device.isLargeTablet
      ? { width: 560, height: 72, radius: 34, padL: 12 }
      : device.isTablet
      ? { width: 500, height: 60, radius: 30, padL: 10 }
      : device.isSmallPhone
      ? { width: 250, height: 35, radius: 18, padL: 6 }
      : { width: 300, height: 40, radius: 20, padL: 8 };

    const iconSize = device.isLargeTablet
      ? 56
      : device.isTablet
      ? 45
      : device.isSmallPhone
      ? 25
      : 30;

    const textSize = fs(25);
    const textLeft = device.isLargeTablet
      ? 60
      : device.isTablet
      ? 50
      : device.isSmallPhone
      ? 20
      : 30;

    return {
      nextPlayerContainer: {
        width: containerSize.width,
        height: containerSize.height,
        borderRadius: containerSize.radius,
        paddingLeft: containerSize.padL,
      },
      nextPlayerIconContainer: {
        width: iconSize,
        height: iconSize,
        borderRadius: iconSize / 2,
      },
      nextPlayerIcon: {
        width: iconSize - 5,
        height: iconSize - 5,
      },
      nextPlayerText: {
        fontSize: textSize,
        marginLeft: textLeft,
      },
    } as const;
  });

  return (
    <TouchableOpacity onPress={onNextPlayerClick} activeOpacity={0.9}>
      <View
        style={[
          styles.nextPlayerContainer,
          { backgroundColor: nextPlayer.startColor },
        ]}
      >
        <View style={styles.nextPlayerIconContainer}>
          <LottieView source={iconSource} style={styles.nextPlayerIcon} />
        </View>
        <Text style={styles.nextPlayerText}>Start Player {nextPlayer.id}</Text>
      </View>
    </TouchableOpacity>
  );
};

const BASE_STYLES = StyleSheet.create<{
  nextPlayerContainer: ViewStyle;
  nextPlayerIconContainer: ViewStyle;
  nextPlayerIcon: ViewStyle;
  nextPlayerText: TextStyle;
}>({
  nextPlayerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 5,
    marginTop: 5,
    // defaults (phone)
    width: 300,
    height: 40,
    borderRadius: 20,
    paddingLeft: 5,
  },
  nextPlayerIconContainer: {
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  nextPlayerIcon: {
    width: 25,
    height: 25,
  },
  nextPlayerText: {
    fontWeight: "bold",
    color: "#000",
    marginTop: 8,
    fontFamily: "LuckiestGuy",
    fontSize: 25,
    marginLeft: 30,
  },
});
