import React, { useState } from "react";
import * as Styled from "./ModeSelect.styled"; // Import styled components
import { Animated } from "react-native"; // Import animation
import { Ionicons } from "@expo/vector-icons";
import { useGameplay } from "@Context"; // Import game context

const MODES = ["Chill Mode", "Blitz Mode"]; // Available modes

interface CenterOptionsProps {
  onModeChange: (mode: string) => void;
  mode: number;
  disableTapToStart?: boolean;
}

const ModeSelect: React.FC<CenterOptionsProps> = ({
  onModeChange,
  mode,
  disableTapToStart = false,
}) => {
  const { players } = useGameplay(); // Get current players from context
  const hasTooManyPlayers = players.length > 8; // Hide text if players > 8

  const handleModeChange = () => {
    onModeChange(MODES[mode].toLowerCase()); // Trigger parent callback
  };

  // Animation for "Tap to Start" text
  const fadeAnim = useState(new Animated.Value(0.5))[0];

  React.useEffect(() => {
    if (!hasTooManyPlayers) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 0.5,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [hasTooManyPlayers]);

  return (
    <Styled.FullScreen activeOpacity={1} onPress={handleModeChange}>
      <Styled.Container>
        {/* Center Circle */}
        <Styled.Circle isActive={mode === 0}>
          <Styled.ModeText>{MODES[mode]}</Styled.ModeText>

          {/* Animated "Tap to Start" Text (Only if players <= 8) */}
          {!hasTooManyPlayers && (
            <Animated.Text
              style={{
                opacity: fadeAnim,
                fontSize: 14,
                color: "#FFF",
                position: "absolute",
                bottom: -30,
              }}
            >
              {disableTapToStart ? "" : "Tap to Start"}
            </Animated.Text>
          )}
        </Styled.Circle>

        {/* Tabs Below the Wheel */}
        <Styled.IndicatorContainer>
          {MODES.map((_, index) => (
            <Styled.Indicator
              key={index}
              isActive={mode === index}
              onPress={() => onModeChange(MODES[index].toLowerCase())}
            />
          ))}
        </Styled.IndicatorContainer>
      </Styled.Container>
    </Styled.FullScreen>
  );
};

export default ModeSelect;
