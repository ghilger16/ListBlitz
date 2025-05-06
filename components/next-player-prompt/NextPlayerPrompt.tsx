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
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

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
    <TouchableOpacity onPress={onNextPlayerClick}>
      <View style={styles.container}>
        <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient
              id="nextPlayerGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <Stop offset="0%" stopColor={nextPlayer.startColor} />
              <Stop offset="100%" stopColor={nextPlayer.endColor} />
            </LinearGradient>
          </Defs>
          <Rect
            width="100%"
            height="100%"
            fill="url(#nextPlayerGradient)"
            rx="30"
            ry="30"
          />
        </Svg>

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
    height: 75,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 30,
    overflow: "hidden", // Ensures gradient stays rounded
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 30,
    height: 30,
  },
  text: {
    color: "#192c43",
    fontFamily: "SourGummy",
    fontSize: 30,
    textAlign: "center",
    marginLeft: 10,
  },
});
