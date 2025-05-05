// NextPlayerPrompt.tsx
import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import * as Styled from "./NextPlayerPrompt.styled";
import LottieView from "lottie-react-native";
import { Player } from "@Context";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

// Interface to accept an icon as a prop
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
      <Styled.NextPlayerContainer>
        <Svg height="100%" width="100%" style={{ position: "absolute" }}>
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

        <Styled.PlayerIconContainer>
          <Styled.PlayerIcon source={iconSource} autoPlay={false} />
        </Styled.PlayerIconContainer>

        <Styled.NextPlayerText>
          Start Player {nextPlayer.id}
        </Styled.NextPlayerText>
      </Styled.NextPlayerContainer>
    </TouchableOpacity>
  );
};
