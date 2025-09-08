import React from "react";
import { Dimensions, TouchableWithoutFeedback } from "react-native";
import Svg, { Path, Text as SvgText } from "react-native-svg";

const { width: screenWidth } = Dimensions.get("window");

const isMax = screenWidth > 420;
const buttonHeight = isMax ? 65 : 50;
const buttonWidth = isMax ? 78 : 60;
const path = isMax
  ? "M0,65 L59,65 Q78,65 78,45 L78,0 Z"
  : "M0,50 L45,50 Q60,50 60,35 L60,0 Z";

const textX = isMax ? 22 : 22;
const textY = isMax ? 60 : 45;
const fontSize = isMax ? 18 : 15;

export const SkipButton: React.FC<{
  playerColor: string;
  onPress: () => void;
}> = ({ playerColor, onPress }) => (
  <TouchableWithoutFeedback onPress={onPress}>
    <Svg
      height={buttonHeight}
      width={buttonWidth}
      style={{
        position: "absolute",
        bottom: 5,
        right: 18,
      }}
    >
      <Path d={path} fill={playerColor} />
      <SvgText
        x={textX}
        y={textY}
        fill="#000"
        fontSize={fontSize}
        fontWeight="bold"
        fontFamily="LuckiestGuy"
        transform="rotate(-45, 30, 30)"
      >
        Skip
      </SvgText>
    </Svg>
  </TouchableWithoutFeedback>
);
