import React from "react";
import { TouchableWithoutFeedback } from "react-native";
import Svg, { Path, Text as SvgText } from "react-native-svg";

export const SkipButton: React.FC<{
  playerColor: string;
  onPress: () => void;
}> = ({ playerColor, onPress }) => (
  <TouchableWithoutFeedback onPress={onPress}>
    <Svg
      height="50"
      width="60"
      style={{
        position: "absolute",
        bottom: 5,
        right: 18,
      }}
    >
      <Path d="M0,50 L45,50 Q60,50 60,35 L60,0 Z" fill={playerColor} />
      <SvgText
        x="22"
        y="45"
        fill="#000"
        fontSize="15"
        fontWeight="bold"
        fontFamily="LuckiestGuy"
        transform="rotate(-45, 30, 30)"
      >
        Skip
      </SvgText>
    </Svg>
  </TouchableWithoutFeedback>
);
