// NextPlayerPrompt.tsx
import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import * as Styled from "./NextPlayerPrompt.styled";
import LottieView from "lottie-react-native";

// Interface to accept an icon as a prop
interface NextPlayerPromptProps {
  onNextPlayerClick: () => void;
  iconSource: any; // Accept icon source as a prop
}

export const NextPlayerPrompt: React.FC<NextPlayerPromptProps> = ({
  onNextPlayerClick,
  iconSource, // Destructure the iconSource prop
}) => {
  return (
    <TouchableOpacity onPress={onNextPlayerClick}>
      <Styled.NextPlayerContainer>
        <Styled.PlayerIconContainer>
          <Styled.PlayerIcon source={iconSource} autoPlay={false} />
        </Styled.PlayerIconContainer>

        <Styled.NextPlayerText>Next Player</Styled.NextPlayerText>
      </Styled.NextPlayerContainer>
    </TouchableOpacity>
  );
};

export default NextPlayerPrompt;
