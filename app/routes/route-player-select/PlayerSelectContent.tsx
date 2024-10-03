import React from "react";
import { useGlobalSearchParams, Stack, useRouter } from "expo-router";
import { View, Text, SafeAreaView } from "react-native";
import * as Styled from "./PlayerSelectContent.styled";
import { PlayersSelect } from "@Components/players-select";
import { useGameplay } from "app/context/game-context/GameContext";

const PlayersSelectContent: React.FC = () => {
  const { title } = useGlobalSearchParams();
  const router = useRouter();
  const { initializePlayers } = useGameplay();

  const handlePlayerCount = (count: number) => {
    initializePlayers(count);
    router.push(`routes/route-gameplay/GameplayContent`);
  };

  return (
    <SafeAreaView>
      <Stack.Screen options={{ headerShown: false }} />
      <View>
        <Styled.Title>Gameplay for {title}</Styled.Title>
      </View>
      <Styled.PlayersWrapper>
        <PlayersSelect onStartClick={handlePlayerCount} />
      </Styled.PlayersWrapper>
    </SafeAreaView>
  );
};

export default PlayersSelectContent;
