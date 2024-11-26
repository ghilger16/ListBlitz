import React, { useState } from "react";
import { useGlobalSearchParams, Stack, useRouter } from "expo-router";
import { View, SafeAreaView } from "react-native";
import * as Styled from "./PlayerSelectContent.styled";
import { PlayersSelect } from "@Components/players-select";
import { useGameplay } from "app/context/game-context/GameContext";

const PlayersSelectContent: React.FC = () => {
  const { title, id } = useGlobalSearchParams();
  const router = useRouter();
  const { initializePlayers } = useGameplay();

  const handleGameStart = (mode: string, count: number) => {
    if (!count) {
      alert("Please select the number of players.");
      return;
    } else initializePlayers(count);

    router.push({
      pathname: "routes/route-gameplay/GameplayContent",
      params: { mode, id },
    });
  };

  return (
    <Styled.SafeAreaWrapper>
      <Stack.Screen options={{ headerShown: false }} />
      <Styled.Title>{title}</Styled.Title>
      <Styled.PlayersWrapper>
        <Styled.WheelTitle>Select Players</Styled.WheelTitle>
        <PlayersSelect onGameStart={handleGameStart} />
      </Styled.PlayersWrapper>
    </Styled.SafeAreaWrapper>
  );
};

export default PlayersSelectContent;
