import React from "react";
import { useGlobalSearchParams, Stack, useRouter } from "expo-router";
import { View, Text, SafeAreaView } from "react-native";

import * as Styled from "./PlayerSelectContent.styled";
import { PlayersSelect } from "@Components/players-select";

const PlayersSelectContent: React.FC = () => {
  const { title } = useGlobalSearchParams();
  const router = useRouter();
  const [playerCount, setPlayerCount] = React.useState<number | null>(null);

  const handlePlayerCount = (count: number) => {
    setPlayerCount(count);
    router.push({
      pathname: `routes/route-gameplay/GameplayContent`,
      params: { title, playerCount: count },
    });
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
