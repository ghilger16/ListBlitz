import React from "react";
import { useGameplay } from "app/context/game-context/GameContext";
import { SafeAreaView, View, Text } from "react-native";

const ResultsContent: React.FC = () => {
  const { players } = useGameplay();

  return (
    <SafeAreaView>
      {players.map((player) => (
        <View key={player.id}>
          <Text>
            {player.name}: {player.score}
          </Text>
        </View>
      ))}
    </SafeAreaView>
  );
};

export default ResultsContent;
