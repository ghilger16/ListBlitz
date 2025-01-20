import React from "react";
import { TouchableOpacity } from "react-native"; // Import animation and touchable
import { GameMode, useGameplay } from "@Context"; // Import game context

import * as Styled from "./ModeSelect.styled"; // Import styled components
import { FlashingText } from "components/flashing-text";

const MODES = {
  [GameMode.CHILL]: "Chill Mode",
  [GameMode.BLITZ]: "Blitz Mode",
};

interface ModeSelectProps {
  onModeChange: (newMode: GameMode) => void;
  onGameStart: () => void;
}

const ModeSelect: React.FC<ModeSelectProps> = ({
  onModeChange,
  onGameStart,
}) => {
  const { players, gameSettings } = useGameplay();
  const hasTooManyPlayers = players.length > 8;

  // 🔹 Function to switch game mode
  const handleModeChange = (newMode: GameMode) => {
    onModeChange(newMode); // Use the passed-in callback to change the mode
  };

  return (
    <Styled.Container>
      <TouchableOpacity activeOpacity={1} onPress={() => onGameStart()}>
        <Styled.Circle isActive={gameSettings.mode === GameMode.CHILL}>
          <Styled.ModeText>{MODES[gameSettings.mode]}</Styled.ModeText>
        </Styled.Circle>
      </TouchableOpacity>
      {!hasTooManyPlayers && (
        <Styled.TextWrapper>
          <FlashingText>Tap to Start</FlashingText>
        </Styled.TextWrapper>
      )}
      {/* 🔹 Add onPress to switch modes */}
      <Styled.IndicatorContainer>
        {Object.values(GameMode).map((gameMode) => (
          <TouchableOpacity
            key={gameMode}
            onPress={() => handleModeChange(gameMode)}
          >
            <Styled.Indicator isActive={gameSettings.mode === gameMode} />
          </TouchableOpacity>
        ))}
      </Styled.IndicatorContainer>
    </Styled.Container>
  );
};

export default ModeSelect;
