import React, { useEffect, useState } from "react";
import { View, StyleSheet, ImageBackground, SafeAreaView } from "react-native";
import { PromptDisplay } from "components/prompt-display";
import { blitzPackIcons } from "components/blitz-packs/blitzPackIcons";
import { Asset } from "expo-asset";
import { Player } from "@Context";
import { BattleTimer } from "./battle-timer";

interface BattleModeProps {
  currentPrompt: string;
  handleNextPlayer: (score: number) => void;
  currentPlayer: Player;
  players: Player[];
  packTitle: string;
  handleNextRound: () => void;
}

export const BattleMode: React.FC<BattleModeProps> = ({
  currentPrompt,
  currentPlayer,
  packTitle,
}) => {
  const titleImage = blitzPackIcons[packTitle]?.titleImage;
  const [bgUri, setBgUri] = useState<string | null>(null);

  const [score, setScore] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);

  const handleScoreIncrement = () => {
    if (isGameStarted) {
      setScore((prev) => prev + 1);
    }
  };

  const handleStart = () => {
    setIsGameStarted(true);
  };

  useEffect(() => {
    const asset = Asset.fromModule(require("assets/images/battle-bg.png"));
    setBgUri(asset.localUri || asset.uri);
  }, []);

  return (
    <>
      {bgUri && (
        <ImageBackground
          source={{ uri: bgUri }}
          resizeMode="cover"
          style={StyleSheet.absoluteFill}
        >
          <SafeAreaView style={styles.wrapper}>
            <View style={styles.promptWrapper}>
              <PromptDisplay
                prompt={currentPrompt}
                playerColor={currentPlayer.startColor}
                categoryBubble={titleImage}
                isAlphaBlitz={packTitle === "Alpha Blitz"}
              />
              <BattleTimer
                score={score}
                currentPlayer={currentPlayer}
                onIncrement={handleScoreIncrement}
                onStart={handleStart}
                isGameStarted={isGameStarted}
              />
            </View>
          </SafeAreaView>
        </ImageBackground>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingTop: 15,
  },
  promptWrapper: {
    marginTop: 15,
  },
});
