import React from "react";
import { useGlobalSearchParams } from "expo-router";
import { View, Text } from "react-native";

export const GameplayContent: React.FC = () => {
  const { params } = useGlobalSearchParams();

  return (
    <View>
      <Text>Gameplay for {params}</Text>
    </View>
  );
};
