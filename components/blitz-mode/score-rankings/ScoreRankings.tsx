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

  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isRoundOver) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -265, // Adjust based on your UI
          duration: 1000,
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
      style={{
        maxHeight: 170,
        overflow: isRoundOver ? "visible" : "hidden", // Allow overflow when round is over
      }}
      contentContainerStyle={{
        paddingBottom: 10,
        paddingTop: isRoundOver ? 50 : 0, // Add padding to account for the fixed first item
      }}
      renderItem={({ item: player, index }) => {
        const iconIndex = player.id % ICONS.length;
        const icon = ICONS[iconIndex] || ICONS[0];

        // Style for the first item
        const animatedStyle =
          index === 0
            ? isRoundOver
              ? {
                  position: "absolute", // Fix the first item
                  top: 0,
                  left: 0,
                  right: 0,
                  transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
                  zIndex: 1, // Ensure it stays on top
                }
              : {}
            : isRoundOver
            ? {
                opacity: 0.5, // Fade out others when round ends
                transform: [{ scale: 0.9 }],
              }
            : {};

        return (
          <Animated.View
            style={animatedStyle as Animated.WithAnimatedObject<ViewStyle>}
          >
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
