import React from "react";
import { useGlobalSearchParams, Stack, useRouter } from "expo-router";

import * as Styled from "@Styles";

import { useGameplay } from "@Context";
import { PlayersSelect } from "@Components";

const PlayerSelect: React.FC = () => {
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

export default PlayerSelect;
