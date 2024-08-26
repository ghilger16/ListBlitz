import React from "react";
import { useGlobalSearchParams, Stack } from "expo-router";
import { View, Text, SafeAreaView } from "react-native";

import * as Styled from "./GameplayContent.styled";
import { PlayersSelect } from "@Components/players-select";

const GameplayContent: React.FC = () => {
  const { title } = useGlobalSearchParams();

  return (
    <SafeAreaView>
      <Stack.Screen options={{ headerShown: false }} />
      <View>
        <Styled.Title>Gameplay for {title}</Styled.Title>
      </View>
      <Styled.PlayersWrapper>
        <PlayersSelect />
      </Styled.PlayersWrapper>
    </SafeAreaView>
  );
};

export default GameplayContent;
