import React, { useState, useEffect, useRef } from "react";
import { FlatList, Animated, TouchableOpacity } from "react-native";
import * as Styled from "./ScoreRankings.styled";
import { EditScoreModal } from "./EditScoreModal";
import { useGameplay } from "@Context";
import { useGetIcons } from "@Services";

interface ScoreRankingsProps {
  players: {
    id: number;
    name: string;
    score: number;
    startColor?: string;
    endColor?: string;
  }[];
  isRoundOver?: boolean;
}

export const ScoreRankings: React.FC<ScoreRankingsProps> = ({
  players,
  isRoundOver,
}) => {
  const [selectedPlayer, setSelectedPlayer] = useState<{
    id: number;
    name: string;
    score: number;
  } | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  // const { data: ICONS = [] } = useGetIcons();
  const { updatePlayerScore } = useGameplay();

  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const sortedPlayers = [...players]
    .filter((player) => player.score > 0)
    .sort((a, b) => b.score - a.score);

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
  }, [isRoundOver, slideAnim, scaleAnim]);

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
    // const iconIndex = player.id % ICONS.length;
    // const icon = ICONS[iconIndex] || ICONS[0];

    const animatedStyle = animated
      ? {
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
        }
      : {};

    return (
      <TouchableOpacity onPress={() => handlePillPress(player)}>
        <Animated.View style={animatedStyle}>
          <Styled.Pill
            style={{
              backgroundColor: player.startColor || "#000",
            }}
          >
            <Styled.RankContainer>
              <Styled.Rank>{player.score}</Styled.Rank>
            </Styled.RankContainer>
            <Styled.Name>{player.name}</Styled.Name>
          </Styled.Pill>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      {/* Winning Player (fixed, not scrollable) */}
      {winner && isRoundOver && renderPill(winner, true)}

      {/* Rest of Players (scrollable) */}
      <FlatList
        data={isRoundOver ? restPlayers : sortedPlayers}
        keyExtractor={(player) => player.id.toString()}
        style={{
          maxHeight: 170,
          overflow: "hidden",
        }}
        renderItem={({ item }) => renderPill(item)}
      />

      {/* Edit Score Modal */}
      {selectedPlayer && (
        <EditScoreModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          playerName={selectedPlayer.name}
          initialScore={selectedPlayer.score}
          onSave={handleSaveScore}
        />
      )}
    </>
  );
};
