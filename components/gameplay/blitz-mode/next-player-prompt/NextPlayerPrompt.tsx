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
import { useScreenInfo } from "@Utils";

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
  const { isTablet, isSmallPhone } = useScreenInfo();

  const playerBackgroundColor = { backgroundColor: nextPlayer.startColor };

  const containerWidth = isTablet ? 500 : isSmallPhone ? 250 : 300;
  const containerHeight = isTablet ? 60 : isSmallPhone ? 35 : 40;
  const paddingLeft = isTablet ? 10 : 5;

  const iconSize = isTablet ? 45 : isSmallPhone ? 25 : 30;
  const fontSize = isTablet ? 40 : isSmallPhone ? 22 : 25;
  const borderRadius = isTablet ? 30 : 20;
  const marginLeft = isTablet ? 50 : isSmallPhone ? 20 : 30;

  return (
    <TouchableOpacity onPress={onNextPlayerClick} activeOpacity={0.9}>
      <View
        style={[
          styles.nextPlayerContainer,
          playerBackgroundColor,
          {
            width: containerWidth,
            height: containerHeight,
            borderRadius,
            paddingLeft,
          },
        ]}
      >
        <View
          style={[
            styles.nextPlayerIconContainer,
            { width: iconSize, height: iconSize, borderRadius: iconSize / 2 },
          ]}
        >
          <LottieView
            source={iconSource}
            style={[
              styles.nextPlayerIcon,
              { width: iconSize - 5, height: iconSize - 5 },
            ]}
          />
        </View>
        <Text style={[styles.nextPlayerText, { fontSize, marginLeft }]}>
          Start Player {nextPlayer.id}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create<{
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
  },
  nextPlayerIconContainer: {
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  nextPlayerIcon: {},
  nextPlayerText: {
    fontWeight: "bold",
    color: "#000",
    marginTop: 8,
    fontFamily: "LuckiestGuy",
  },
});
