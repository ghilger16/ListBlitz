import React from "react";
import { Text } from "react-native";

import * as Styled from "./PromptDisplay.styled";

export const PromptDisplay: React.FC<{ prompt: string }> = ({ prompt }) => {
  return (
    <Styled.PromptContainer>
      <Styled.PromptText>{prompt}</Styled.PromptText>;
    </Styled.PromptContainer>
  );
};
