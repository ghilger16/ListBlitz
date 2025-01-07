import React, { useState } from "react";
import { useGlobalSearchParams, Stack, useRouter } from "expo-router";

import * as Styled from "@Styles";

import { useGameplay } from "@Context";
import { PlayersSelect } from "@Components";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

const MODES = ["Chill Mode", "Blitz Mode"];

const PlayerSelect: React.FC = () => {
  const { title, id } = useGlobalSearchParams();
  const router = useRouter();
  const { initializePlayers } = useGameplay();
  const [selectedMode, setSelectedMode] = useState(0);

  const handleGameStart = (mode: string, count: number) => {
    if (!count) {
      alert("Please select the number of players.");
      return;
    } else initializePlayers(count);

    router.push({
      pathname: "/gameplay",
      params: { mode, id },
    });
  };

  const swipeGesture = Gesture.Pan()
    .onEnd((event) => {
      const direction = event.translationX > 0 ? 1 : -1; // Swipe direction
      const newIndex = (selectedMode + direction + MODES.length) % MODES.length; // Cycle modes
      setSelectedMode(newIndex);
    })
    .activeOffsetX([-10, 10]);

  return (
    <GestureDetector gesture={swipeGesture}>
      <Styled.SafeAreaWrapper>
        <Stack.Screen options={{ headerShown: false }} />
        <Styled.Title>{title}</Styled.Title>
        <Styled.PlayersWrapper>
          <Styled.WheelTitle>Select Players</Styled.WheelTitle>
          <PlayersSelect onGameStart={handleGameStart} mode={selectedMode} />
        </Styled.PlayersWrapper>
      </Styled.SafeAreaWrapper>
    </GestureDetector>
  );
};

export default PlayerSelect;
