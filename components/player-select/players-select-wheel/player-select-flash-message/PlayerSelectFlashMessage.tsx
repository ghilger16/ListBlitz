import React from "react";
import { View, TouchableOpacity, Animated, StyleSheet } from "react-native";

import { GameMode, Player } from "@Context";
import { FlashingText } from "@Components";
import { getEasterEggMessage } from "./utils";

interface Props {
  startAttempted: boolean;
  shakeAnim: Animated.Value;
  flashMessage: string;
  playersData: Player[];
  setFlashMessage: (message: string) => void;
  selectedMode: GameMode;
}

const hasMissingPlayers = (playerIds: number[]) => {
  if (playerIds.length === 0) return false;
  const fullRange = Array.from(
    { length: playerIds[playerIds.length - 1] },
    (_, i) => i + 1
  );
  return fullRange.some((n) => !playerIds.includes(n));
};

const getWarningMessage = (playersData: Player[], selectedMode: GameMode) => {
  const ids = playersData.map((p) => p.id).sort((a, b) => a - b);
  const hasMissing = hasMissingPlayers(ids);
  if (selectedMode === "battle" && playersData.length < 2) {
    return "Select at least 2 characters";
  }
  if (hasMissing) {
    const missing = Array.from(
      { length: ids[ids.length - 1] },
      (_, i) => i + 1
    ).find((n) => !ids.includes(n));
    return `Reselect Player ${missing}`;
  }
  return "Ready to start!";
};

const PlayerSelectFlashMessage: React.FC<Props> = ({
  startAttempted,
  shakeAnim,
  flashMessage,
  playersData,
  setFlashMessage,
  selectedMode,
}) => {
  const finalWarningMessage = getWarningMessage(playersData, selectedMode);

  if (startAttempted) {
    return (
      <View style={styles.warningContainer}>
        <View style={styles.warningBox}>
          <Animated.Text
            style={[
              styles.warningText,
              { transform: [{ translateX: shakeAnim }] },
            ]}
          >
            ⚠️ {finalWarningMessage}
          </Animated.Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.warningContainer}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          const message = getEasterEggMessage(playersData);
          if (message) {
            setFlashMessage(message);
          }
        }}
      >
        <FlashingText style={styles.selectPlayerText}>
          {flashMessage}
        </FlashingText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  warningContainer: {
    height: 40,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  warningBox: {
    backgroundColor: "#1e2a38",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ffcc00",
    flexDirection: "row",
    alignItems: "center",
  },
  warningText: {
    color: "#ffcc00",
    fontSize: 16,
    fontWeight: "600",
  },
  selectPlayerText: {
    fontSize: 20,
    letterSpacing: 2,
    textTransform: "uppercase",
    textShadowColor: "rgba(0, 191, 255, 0.7)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});

export default PlayerSelectFlashMessage;
