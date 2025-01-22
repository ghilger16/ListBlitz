import React, { useState, useCallback, useEffect } from "react";
import { useGlobalSearchParams, Stack } from "expo-router";
import * as Styled from "@Styles";
import { useGameplay, GameMode } from "@Context";
import { FlashingText, PlayersSelect } from "@Components";
import { ModeSelect } from "components/players-select/mode-select";

const PlayerSelect: React.FC = () => {
  const { setGameSettings, onGameStart, gameSettings } = useGameplay();

  const [selectedMode, setSelectedMode] = useState<GameMode>(gameSettings.mode);
  const [playerCount, setPlayerCount] = useState(1);

  // Callback for updating player count
  const handlePlayerCountChange = useCallback((count: number) => {
    setPlayerCount(count);
  }, []);

  // Callback for updating selected mode
  const handleModeChange = useCallback((mode: GameMode) => {
    setSelectedMode(mode);
  }, []);

  // Update game settings when player count or mode changes
  useEffect(() => {
    if (
      gameSettings.playerCount !== playerCount ||
      gameSettings.mode !== selectedMode
    ) {
      setGameSettings({ mode: selectedMode, playerCount });
    }
  }, [selectedMode, playerCount, setGameSettings, gameSettings]);

  const handleGameStart = () => {
    if (playerCount > 0) {
      onGameStart();
    }
  };

  return (
    <Styled.SafeAreaWrapper>
      <Stack.Screen options={{ headerShown: false }} />
      <Styled.Title>{gameSettings.blitzPackTitle}</Styled.Title>
      <Styled.PlayersWrapper>
        <Styled.WheelTitle>
          <FlashingText>Select Players</FlashingText>
        </Styled.WheelTitle>
        <PlayersSelect onPlayerCountChange={handlePlayerCountChange} />
        <ModeSelect onModeChange={handleModeChange} mode={selectedMode} />
      </Styled.PlayersWrapper>
      <Styled.StartButton onPress={handleGameStart} disabled={playerCount < 1}>
        <Styled.ButtonText>Start</Styled.ButtonText>
      </Styled.StartButton>
    </Styled.SafeAreaWrapper>
  );
};

export default PlayerSelect;
