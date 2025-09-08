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
import { useScreenInfo } from "@Utils";

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
  const { isTablet, isSmallPhone } = useScreenInfo();

  const pillWidth = isTablet ? 525 : isSmallPhone ? 260 : 350;
  const pillHeight = isTablet ? 50 : isSmallPhone ? 30 : 39;
  const nameFontSize = isTablet ? 38 : isSmallPhone ? 20 : 25;
  const nameMargin = isTablet ? 10 : isSmallPhone ? 5 : 8;
  const scoreFontSize = isTablet ? 45 : isSmallPhone ? 28 : 35;
  const rankFontSize = isTablet ? 22 : isSmallPhone ? 16 : 18;

  const iconSize = Math.round(pillHeight * 1.25);
  const rankSize = Math.round(pillHeight * 0.75);

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
              {
                backgroundColor: player.startColor || "#000",
                width: pillWidth,
                height: pillHeight,
                borderRadius: pillHeight / 2,
                paddingHorizontal: 12,
              },
            ]}
          >
            <View
              style={[
                styles.rankContainer,
                {
                  width: rankSize,
                  height: rankSize,
                  borderRadius: rankSize / 2,
                },
              ]}
            >
              <Text style={[styles.rank, { fontSize: rankFontSize }]}>
                {sortedPlayers.findIndex((p) => p.id === player.id) + 1}
              </Text>
            </View>
            <View>
              <Text
                style={[
                  styles.name,
                  { fontSize: nameFontSize, marginTop: nameMargin },
                ]}
              >
                {player.name}
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <LottieView
                source={icon}
                style={{
                  width: iconSize,
                  height: iconSize,
                  marginLeft: 2,
                }}
              />
              <Animated.View
                style={
                  sortedPlayers[0].id === player.id
                    ? [styles.pulseStyle, { transform: [{ scale: pulseAnim }] }]
                    : {}
                }
              >
                <Text
                  style={[
                    styles.scoreText,
                    {
                      fontSize: scoreFontSize,
                      marginLeft: player.score! < 10 ? 10 : 15,
                    },
                  ]}
                >
                  {player.score}
                </Text>
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
        style={{ maxHeight: 170, overflow: "hidden" }}
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

const styles = StyleSheet.create({
  pill: {
    marginTop: 5,
    borderRadius: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  name: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#000",
    marginTop: 0,
    marginLeft: 0,
    fontFamily: "LuckiestGuy",
  },
  scoreText: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 25,
    marginTop: 8,
    fontFamily: "LuckiestGuy",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  pulseStyle: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
});
