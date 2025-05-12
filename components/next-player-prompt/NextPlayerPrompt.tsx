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
  return (
    <TouchableOpacity onPress={onNextPlayerClick} activeOpacity={0.9}>
      <View
        style={[
          styles.container,
          { backgroundColor: nextPlayer.startColor || "#000" },
        ]}
      >
        <View style={styles.iconContainer}>
          <LottieView
            source={iconSource}
            autoPlay={false}
            style={styles.icon}
          />
        </View>
        <Text style={styles.text}>Start Player {nextPlayer.id}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create<{
  container: ViewStyle;
  iconContainer: ViewStyle;
  icon: ViewStyle;
  text: TextStyle;
}>({
  container: {
    width: 300,
    height: 40,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 5,
    paddingRight: 5,
    marginTop: 5,
  },
  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 25,
    height: 25,
  },
  text: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginTop: 10,
    marginLeft: 30,
    fontFamily: "LuckiestGuy",
  },
});
