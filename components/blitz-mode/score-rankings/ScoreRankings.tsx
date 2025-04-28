import React, { useEffect, useRef } from "react";
import Svg, { Defs, LinearGradient, Stop, Rect } from "react-native-svg";
import * as Styled from "./ScoreRankings.styled";
import { useGetIcons } from "@Services";
import LottieView from "lottie-react-native";
import { Animated, FlatList, ViewStyle } from "react-native";

interface ScoreRankingsProps {
  players: {
    id: number;
    name: string;
    score: number;
    startColor?: string;
    endColor?: string;
  }[];
  isRoundOver?: boolean; // <-- NEW PROP
}

export const ScoreRankings: React.FC<ScoreRankingsProps> = ({
  players,
  isRoundOver,
}) => {
  const { data: ICONS = [] } = useGetIcons();

  const sortedPlayers = [...players]
    .filter((player) => player.score > 0)
    .sort((a, b) => b.score - a.score);

  const winner = sortedPlayers[0];
  const restPlayers = sortedPlayers.slice(1);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isRoundOver) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -250, // You might tweak this now
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

  const renderPill = (player: (typeof players)[number], animated = false) => {
    const iconIndex = player.id % ICONS.length;
    const icon = ICONS[iconIndex] || ICONS[0];

    const animatedStyle = animated
      ? {
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
        }
      : {};

    return (
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

          <LottieView
            source={icon}
            style={{
              width: 35,
              height: 35,
              marginLeft: 10,
            }}
          />
        </Styled.Pill>
      </Animated.View>
    );
  };

  return (
    <>
      {/* Winning Player (fixed, not scrollable) */}
      {winner && renderPill(winner, true)}

      {/* Rest of Players (scrollable) */}
      <FlatList
        data={restPlayers}
        keyExtractor={(player) => player.id.toString()}
        style={{
          maxHeight: 170,
          overflow: "visible",
        }}
        renderItem={({ item }) => renderPill(item)}
      />
    </>
  );
};
