import React from "react";
import { ImageBackground, SafeAreaView, StyleSheet } from "react-native";
import { AlphaCategorySelect } from "./AlphaCategorySelect";

export const AlphaCategoryWrapper: React.FC<{
  bgUri: string;
  onSelectCategory: (category: string) => void;
  onPickRandom: () => void;
}> = ({ bgUri, onSelectCategory, onPickRandom }) => (
  <ImageBackground
    source={{ uri: bgUri }}
    resizeMode="cover"
    style={StyleSheet.absoluteFill}
  >
    <SafeAreaView style={{ flex: 1 }}>
      <AlphaCategorySelect
        onSelectCategory={onSelectCategory}
        onPickRandom={onPickRandom}
      />
    </SafeAreaView>
  </ImageBackground>
);
