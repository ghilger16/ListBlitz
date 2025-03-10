import React, { useState, useEffect } from "react";
import { Text, Animated } from "react-native";
import * as Styled from "./PromptDisplay.styled";

export const PromptDisplay: React.FC<{
  prompt: string;
  playerColor: string;
}> = ({ prompt, playerColor }) => {
  const [bounceValue] = useState(new Animated.Value(1));

  useEffect(() => {
    // Animate the prompt with a bounce effect
    Animated.sequence([
      Animated.spring(bounceValue, {
        toValue: 1.2, // Slightly scale up
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.spring(bounceValue, {
        toValue: 1, // Return to original size
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  }, [prompt]);

  return (
    <Styled.PromptContainer playerColor={playerColor}>
      <Styled.PromptText
        style={{
          transform: [{ scale: bounceValue }],
        }}
      >
        List {prompt}
      </Styled.PromptText>
    </Styled.PromptContainer>
  );
};
