import React from "react";
import { TouchableWithoutFeedback } from "react-native";
import Svg, { Path, Text as SvgText } from "react-native-svg";
import { useScreenInfo } from "@Utils";

export const SkipButton: React.FC<{
  playerColor: string;
  onPress: () => void;
}> = ({ playerColor, onPress }) => {
  const { isTablet, isSmallPhone } = useScreenInfo();

  let buttonHeight: number,
    buttonWidth: number,
    path: string,
    textX: number,
    textY: number,
    fontSize: number,
    bottom: number,
    right: number;
  if (isTablet) {
    buttonHeight = 95;
    buttonWidth = 100;
    path = "M0,95 L70,95 Q85,85 100,65 L100,0 Z";
    textX = 10;
    textY = 85;
    fontSize = 26;
    bottom = 5;
    right = 65;
  } else if (isSmallPhone) {
    buttonHeight = 50;
    buttonWidth = 55;
    path = "M0,50 L40,50 Q55,45 60,35 L55,0 Z";
    textX = 21;
    textY = 43;
    fontSize = 15;
    bottom = 3;
    right = 23;
  } else {
    buttonHeight = 60;
    buttonWidth = 70;
    path = "M0,60 L45,60 Q60,50 60,35 L60,0 Z";
    textX = 15;
    textY = 50;
    fontSize = 18;
    bottom = 5;
    right = 12;
  }

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <Svg
        height={buttonHeight}
        width={buttonWidth}
        style={{
          position: "absolute",
          bottom: bottom,
          right: right,
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
};
