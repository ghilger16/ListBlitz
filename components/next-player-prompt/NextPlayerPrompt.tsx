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
  const playerBackgroundColor = { backgroundColor: nextPlayer.startColor };

  return (
    <TouchableOpacity onPress={onNextPlayerClick} activeOpacity={0.9}>
      <View style={[styles.nextPlayerContainer, playerBackgroundColor]}>
        <View style={styles.nextPlayerIconContainer}>
          <LottieView source={iconSource} style={styles.nextPlayerIcon} />
        </View>
        <Text style={styles.nextPlayerText}>Start Player {nextPlayer.id}</Text>
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
    width: 300,
    height: 40,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 5,
    paddingRight: 5,
    marginTop: 5,
  },
  nextPlayerIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  nextPlayerIcon: {
    width: 25,
    height: 25,
  },
  nextPlayerText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#000",
    marginTop: 8,
    marginLeft: 30,
    fontFamily: "LuckiestGuy",
  },
});
