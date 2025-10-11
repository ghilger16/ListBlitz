import React, { useState, useEffect } from "react";
import {
  FlatList,
  Animated,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from "react-native";
import { EditScoreModal } from "./EditScoreModal";
import { Player, useGameplay } from "@Context";
import { playerIcons } from "@Context";
import LottieView from "lottie-react-native";
import { useRoundOverAnimation, useWinnerPulseAnimation } from "@Hooks";
import { useResponsiveStyles } from "@Hooks";

const getPlayerIcon = (playerIconIndex: number) => playerIcons[playerIconIndex];

interface ScoreRankingsProps {
  players: Player[];
  isRoundOver?: boolean;
  isGameStarted?: boolean;
}

export const ScoreRankings: React.FC<ScoreRankingsProps> = ({
  players,
  isRoundOver,
  isGameStarted,
}) => {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { updatePlayerScore } = useGameplay();

  const {
    slideAnim,
    scaleAnim,
    trigger: triggerRoundOverAnimation,
  } = useRoundOverAnimation();
  const { pulseAnim, trigger: triggerWinnerPulseAnimation } =
    useWinnerPulseAnimation();

  const styles = useResponsiveStyles(BASE_STYLES, (device) => {
    const fs = (base: number) => {
      if (device.isLargeTablet) return Math.round(base * 1.85);
      if (device.isTablet) return Math.round(base * 1.4);
      if (device.isLargePhone) return Math.round(base * 1);
      if (device.isSmallPhone) return Math.round(base * 0.75);
      return base;
    };

    const pillWidth = device.isLargeTablet
      ? 640
      : device.isTablet
      ? 525
      : device.isLargePhone
      ? 340
      : device.isSmallPhone
      ? 260
      : 350;

    const pillHeight = device.isLargeTablet
      ? 60
      : device.isTablet
      ? 50
      : device.isLargePhone
      ? 38
      : device.isSmallPhone
      ? 30
      : 39;

    const nameMargin = device.isLargeTablet
      ? 12
      : device.isTablet
      ? 10
      : device.isLargePhone
      ? 8
      : device.isSmallPhone
      ? 5
      : 8;

    const iconSize = Math.round(pillHeight * 1.3); // keep icon within pill height for true vertical centering
    const rankSize = Math.round(pillHeight * 0.75);

    return {
      // Merge dynamic sizing directly into base styles
      pill: {
        width: pillWidth,
        height: pillHeight,
        borderRadius: pillHeight / 2,
      },
      rankContainer: {
        width: rankSize,
        height: rankSize,
        borderRadius: rankSize / 2,
      },
      rank: { fontSize: fs(19) },

      name: {
        fontSize: fs(25),
        // lineHeight: fs(25),
      },
      icon: { width: iconSize, height: iconSize },
      scoreText: {
        fontSize: fs(36),
        ...(device.isTablet || device.isLargeTablet
          ? { paddingTop: 4, paddingRight: 4 }
          : {}),
      },
    } as const;
  });

  const sortedPlayers = [...players]
    .filter((p) => p.score !== null)
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  const winner = sortedPlayers[0];
  const restPlayers = sortedPlayers.slice(1);

  useEffect(() => {
    if (isRoundOver) triggerRoundOverAnimation();
  }, [isRoundOver]);

  useEffect(() => {
    if (winner) triggerWinnerPulseAnimation();
  }, [winner]);

  const getAnimatedStyle = () => ({
    transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
  });

  const handlePillPress = (player: Player) => {
    if (!isGameStarted) {
      setSelectedPlayer(player);
      setIsModalVisible(true);
    }
  };

  const handleSaveScore = (newScore: number) => {
    if (selectedPlayer) {
      updatePlayerScore(selectedPlayer.id, newScore);
      setSelectedPlayer(null);
      setIsModalVisible(false);
    }
  };

  const renderPill = (player: Player, shouldAnimate = false) => {
    if (player.score === null) return null;
    const icon = getPlayerIcon(player.iconIndex);
    const animatedStyle = shouldAnimate ? getAnimatedStyle() : {};

    return (
      <TouchableOpacity
        onPress={() => handlePillPress(player)}
        activeOpacity={0.9}
      >
        <Animated.View style={animatedStyle}>
          <View
            style={[
              styles.pill,
              { backgroundColor: player.startColor || "#000" },
            ]}
          >
            <View style={styles.left}>
              <View style={styles.rankContainer}>
                <Text style={styles.rank}>
                  {sortedPlayers.findIndex((p) => p.id === player.id) + 1}
                </Text>
              </View>
            </View>
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{player.name}</Text>
            </View>

            <View style={styles.right}>
              <LottieView source={icon} style={styles.icon} />
              <Animated.View
                style={
                  sortedPlayers[0].id === player.id
                    ? [styles.pulseStyle, { transform: [{ scale: pulseAnim }] }]
                    : {}
                }
              >
                <Text style={styles.scoreText}>{player.score}</Text>
              </Animated.View>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      {winner && isRoundOver && renderPill(winner, true)}
      <FlatList
        data={isRoundOver ? restPlayers : sortedPlayers}
        keyExtractor={(player) => player.id.toString()}
        style={{ maxHeight: 170 }}
        renderItem={({ item }) => renderPill(item)}
      />
      {selectedPlayer && !isGameStarted && (
        <EditScoreModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          playerName={selectedPlayer.name!}
          initialScore={selectedPlayer.score!}
          onSave={handleSaveScore}
          startColor={selectedPlayer.startColor || "#192C43"}
          playerIcon={getPlayerIcon(selectedPlayer.iconIndex)}
        />
      )}
    </>
  );
};

const BASE_STYLES = StyleSheet.create({
  pill: {
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 2,
    marginTop: 2,
  },
  left: {
    flex: 1,
    paddingLeft: 10,
  },
  rankContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  rank: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  nameContainer: {
    flex: 4,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 12,
  },
  name: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#000",
    fontFamily: "LuckiestGuy",
    textAlign: "center",
  },
  scoreText: {
    fontWeight: "bold",
    color: "#fff",
    fontFamily: "LuckiestGuy",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  icon: {},
  right: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 6,
    paddingTop: 4,
    marginRight: 10,
  },
  pulseStyle: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
});
