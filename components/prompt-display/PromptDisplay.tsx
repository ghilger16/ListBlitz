import React, { useState, useEffect } from "react";
import { Animated } from "react-native";
import * as Styled from "./PromptDisplay.styled";
import { playSound } from "components/utils";
import { countdownSound } from "@Assets";

export const PromptDisplay: React.FC<{
  prompt: string;
  playerColor: string;
  isObscured?: boolean; // New prop to obscure the prompt
  countdown?: number | null; // New prop for countdown
}> = ({ prompt, playerColor, isObscured, countdown }) => {
  const [bounceValue] = useState(new Animated.Value(1));
  const [fadeValue] = useState(new Animated.Value(0)); // New fade animation
  const [scaleValue] = useState(new Animated.Value(0.8));
  const [hasPlayedSound, setHasPlayedSound] = useState(false); // Track if sound has been played

  useEffect(() => {
    if (countdown !== null && !hasPlayedSound) {
      playSound(countdownSound); // Play the countdown sound
      setHasPlayedSound(true); // Mark the sound as played
    }

    if (countdown === null) {
      setHasPlayedSound(false); // Reset when countdown ends
    }
  }, [countdown, hasPlayedSound]);

  useEffect(() => {
    if (countdown !== null) {
      fadeValue.setValue(0);
      scaleValue.setValue(0.8);
      Animated.parallel([
        Animated.timing(fadeValue, {
          toValue: 1, // Fade in
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(scaleValue, {
          toValue: 1, // Scale up
          friction: 3,
          useNativeDriver: true,
        }),
      ]).start(() => {});
    } else {
      // Bounce animation for the prompt when countdown is finished
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
    }
  }, [countdown]);

  return (
    <Styled.PromptContainer playerColor={playerColor}>
      {isObscured ? (
        countdown !== null ? (
          <Styled.PromptText
            style={{
              opacity: fadeValue, // Fade effect
              transform: [{ scale: scaleValue }], // Scale effect
              fontSize: 70,
              color: "#fff", // Ensure text color is visible
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {countdown}
          </Styled.PromptText>
        ) : (
          <Styled.PromptText>List Blitz</Styled.PromptText>
        )
      ) : (
        <Styled.PromptText
          style={{
            transform: [{ scale: bounceValue }],
          }}
        >
          List {prompt}
        </Styled.PromptText>
      )}
    </Styled.PromptContainer>
  );
};
