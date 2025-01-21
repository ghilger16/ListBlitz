import React, { useState, useCallback, useEffect } from "react";
import { useGlobalSearchParams, Stack } from "expo-router";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import * as Styled from "@Styles";
import { useGameplay, GameMode } from "@Context";
import { FlashingText, PlayersSelect } from "@Components";
import { ModeSelect } from "components/players-select/mode-select";
import { Text } from "react-native";

const MODES = [GameMode.CHILL, GameMode.BLITZ]; // Use enum instead of strings

const PlayerSelect: React.FC = () => {
  const { setGameSettings, onGameStart, gameSettings } = useGameplay();

  const [selectedMode, setSelectedMode] = useState<GameMode>(GameMode.CHILL);
  const [playerCount, setPlayerCount] = useState(1); // or another default value

  // Memoize setPlayersCount callback
  const handlePlayerCountChange = useCallback((count: number) => {
    setPlayerCount(count);
  }, []);

  // Memoize setSelectedMode callback
  const handleModeChange = useCallback((mode: GameMode) => {
    setSelectedMode(mode);
  }, []);

  const swipeGesture = Gesture.Pan()
    .onEnd((event) => {
      const direction = event.translationX > 0 ? -1 : 1;
      const newIndex = MODES.indexOf(selectedMode) + direction;

      if (newIndex >= 0 && newIndex < MODES.length) {
        setSelectedMode(MODES[newIndex]);
      }
    })
    .activeOffsetX([-20, 20]);

  // Update gameSettings when playerCount or selectedMode changes, and avoid unnecessary calls
  useEffect(() => {
    if (
      gameSettings.playerCount !== playerCount ||
      gameSettings.mode !== selectedMode
    ) {
      setGameSettings({ mode: selectedMode, playerCount: playerCount });
    }
  }, [selectedMode, playerCount, setGameSettings, gameSettings]);

  const handleGameStart = () => {
    if (playerCount > 0) {
      onGameStart();
    }
  };

  return (
    <GestureDetector gesture={swipeGesture}>
      <Styled.SafeAreaWrapper>
        <Stack.Screen options={{ headerShown: false }} />
        <Styled.Title>{gameSettings.blitzPackTitle}</Styled.Title>
        <Styled.PlayersWrapper>
          <Styled.WheelTitle>
            <FlashingText>Select Players</FlashingText>
          </Styled.WheelTitle>
          <PlayersSelect onPlayerCountChange={handlePlayerCountChange} />
          <ModeSelect />
        </Styled.PlayersWrapper>
        <Styled.StartButton
          onPress={handleGameStart}
          disabled={playerCount < 1}
        >
          <Styled.ButtonText>Start</Styled.ButtonText>
        </Styled.StartButton>
      </Styled.SafeAreaWrapper>
    </GestureDetector>
  );
};

export default PlayerSelect;
