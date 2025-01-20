import React, { useState, useCallback } from "react";
import { useGlobalSearchParams, Stack } from "expo-router";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import * as Styled from "@Styles";
import { useGameplay, GameMode } from "@Context";
import { PlayersSelect } from "@Components";
import { ModeSelect } from "components/players-select/mode-select";

const MODES = [GameMode.CHILL, GameMode.BLITZ]; // Use enum instead of strings

const PlayerSelect: React.FC = () => {
  const { setGameSettings, onGameStart } = useGameplay();

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
        setGameSettings({ mode: MODES[newIndex], playerCount: playerCount });
      }
    })
    .activeOffsetX([20, 20]);

  const handleGameStart = () => {
    console.log("game Started");
    setGameSettings({ mode: selectedMode, playerCount: playerCount });
    onGameStart();
    // Proceed to game
  };

  return (
    <GestureDetector gesture={swipeGesture}>
      <Styled.SafeAreaWrapper>
        <Stack.Screen options={{ headerShown: false }} />
        <Styled.Title>{selectedMode}</Styled.Title>
        <Styled.PlayersWrapper>
          <Styled.WheelTitle>Select Players</Styled.WheelTitle>
          <PlayersSelect onPlayerCountChange={handlePlayerCountChange} />
          <ModeSelect
            onModeChange={handleModeChange}
            onGameStart={handleGameStart}
          />
        </Styled.PlayersWrapper>
      </Styled.SafeAreaWrapper>
    </GestureDetector>
  );
};

export default PlayerSelect;
