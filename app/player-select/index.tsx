import React, { useState } from "react";
import { useGlobalSearchParams, Stack } from "expo-router";
import {
  Gesture,
  GestureDetector,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";

import * as Styled from "@Styles";

import { useGameplay, GameMode } from "@Context";
import { PlayersSelect } from "@Components";
import { ModeSelect } from "components/players-select/mode-select";

const MODES = [GameMode.CHILL, GameMode.BLITZ]; // Use enum instead of strings

const PlayerSelect: React.FC = () => {
  const { setGameSettings, gameSettings } = useGameplay();

  const [selectedMode, setSelectedMode] = useState<GameMode>(GameMode.CHILL);

  const swipeGesture = Gesture.Pan()
    .onEnd((event) => {
      const direction = event.translationX > 0 ? -1 : 1;
      const newIndex = MODES.indexOf(selectedMode) + direction;

      if (newIndex >= 0 && newIndex < MODES.length) {
        setSelectedMode(MODES[newIndex]);
        setGameSettings({ mode: MODES[newIndex] });
      }
    })
    .activeOffsetX([20, 20]);

  return (
    <GestureDetector gesture={swipeGesture}>
      <Styled.SafeAreaWrapper>
        <Stack.Screen options={{ headerShown: false }} />
        <Styled.Title>{gameSettings.blitzPackTitle}</Styled.Title>
        <Styled.Title>{gameSettings.mode}</Styled.Title>
        <Styled.PlayersWrapper>
          <Styled.WheelTitle>Select Players</Styled.WheelTitle>
          <PlayersSelect />
          <ModeSelect />
        </Styled.PlayersWrapper>
      </Styled.SafeAreaWrapper>
    </GestureDetector>
  );
};

export default PlayerSelect;
