import React, { useEffect, useRef } from "react";
import Svg, { Defs, LinearGradient, Stop, Rect } from "react-native-svg";
import * as Styled from "./ScoreRankings.styled";
import { useGetIcons } from "@Services";
import LottieView from "lottie-react-native";
import { Animated, FlatList } from "react-native";

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

  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isRoundOver) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -100, // Adjust based on your UI
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1.1, // Slight scale up for winner
          friction: 5,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isRoundOver, slideAnim, scaleAnim]);

  return (
    <FlatList
      data={sortedPlayers}
      keyExtractor={(player) => player.id.toString()}
      style={{ maxHeight: 170, overflow: "visible" }}
      contentContainerStyle={{ paddingBottom: 10 }}
      renderItem={({ item: player, index }) => {
        const iconIndex = player.id % ICONS.length;
        const icon = ICONS[iconIndex] || ICONS[0];

        const animatedStyle =
          index === 0
            ? {
                transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
              }
            : isRoundOver
            ? {
                opacity: 0.5, // Fade out others when round ends
                transform: [{ scale: 0.9 }],
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
      }}
    />
  );
};
