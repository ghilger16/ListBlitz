import React, { useState, useEffect, useRef } from "react";
import {
  FlatList,
  Animated,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from "react-native";
import { EditScoreModal } from "./EditScoreModal";
import { useGameplay } from "@Context";
import { useGetIcons } from "@Services";
import LottieView from "lottie-react-native";

interface ScoreRankingsProps {
  players: {
    id: number;
    name: string;
    score: number | null;
    startColor?: string;
    endColor?: string;
  }[];
  isRoundOver?: boolean;
  isGameStarted?: boolean;
}

export const ScoreRankings: React.FC<ScoreRankingsProps> = ({
  players,
  isRoundOver,
  isGameStarted,
}) => {
  const [selectedPlayer, setSelectedPlayer] = useState<{
    id: number;
    name: string;
    score: number | null;
    startColor?: string;
  } | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { data: ICONS = [] } = useGetIcons();
  const { updatePlayerScore } = useGameplay();

  const getPlayerIcon = (playerId: number) => {
    return ICONS[playerId - 1];
  };

  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const sortedPlayers = [...players]
    .filter((p) => p.score !== null)
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  const winner = sortedPlayers[0];
  const restPlayers = sortedPlayers.slice(1);

  useEffect(() => {
    if (isRoundOver) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -250,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1.1,
          friction: 5,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isRoundOver]);

  useEffect(() => {
    if (winner) {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [winner]);

  const handlePillPress = (player: (typeof players)[number]) => {
    setSelectedPlayer(player);
    setIsModalVisible(true);
  };

  const handleSaveScore = (newScore: number) => {
    if (selectedPlayer) {
      updatePlayerScore(selectedPlayer.id, newScore);
      setSelectedPlayer(null);
      setIsModalVisible(false);
    }
  };

  const renderPill = (player: (typeof players)[number], animated = false) => {
    if (player.score === null) return null;
    const icon = getPlayerIcon(player.id);
    const animatedStyle = animated
      ? {
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
        }
      : {};

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
            <View style={styles.rankContainer}>
              <Text style={styles.rank}>
                {sortedPlayers.findIndex((p) => p.id === player.id) + 1}
              </Text>
            </View>
            <Text style={styles.name}>{player.name}</Text>
            <LottieView
              source={icon}
              style={{
                width: 40,
                height: 40,
                marginLeft: 8,
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
                  { marginLeft: player.score < 10 ? 35 : 25 },
                ]}
              >
                {player.score}
              </Text>
            </Animated.View>
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
          playerName={selectedPlayer.name}
          initialScore={selectedPlayer.score}
          onSave={handleSaveScore}
          startColor={selectedPlayer.startColor || "#192C43"}
          playerIcon={getPlayerIcon(selectedPlayer.id)}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  pill: {
    marginTop: 5,
    width: 300,
    height: 40,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 5,
    paddingRight: 5,
    left: "3%",
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
    textAlign: "center",
    marginTop: 10,
    marginLeft: 50,
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
