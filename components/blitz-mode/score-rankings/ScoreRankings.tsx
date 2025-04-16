import React, { useRef } from "react";
import Svg, { Defs, LinearGradient, Stop, Rect } from "react-native-svg";
import * as Styled from "./ScoreRankings.styled";
import { useGetIcons } from "@Services";
import LottieView from "lottie-react-native";
import { FlatList, ScrollView } from "react-native";

interface ScoreRankingsProps {
  players: {
    id: number;
    name: string;
    score: number;
    startColor?: string;
    endColor?: string;
  }[];
}

export const ScoreRankings: React.FC<ScoreRankingsProps> = ({ players }) => {
  const { data: ICONS = [] } = useGetIcons();

  // Sort players by score in descending order
  const sortedPlayers = [...players]
    .filter((player) => player.score > 0) // Only include players with a score
    .sort((a, b) => b.score - a.score);

  return (
    <FlatList
      data={sortedPlayers}
      keyExtractor={(player) => player.id.toString()}
      style={{ maxHeight: 170 }}
      contentContainerStyle={{ paddingBottom: 10 }}
      renderItem={({ item: player }) => {
        const iconIndex = player.id % ICONS.length;
        const icon = ICONS[iconIndex] || ICONS[0];

        return (
          <Styled.Pill
            style={{
              backgroundColor: player.startColor || "#000",
            }}
          >
            <Styled.RankContainer>
              <Styled.Rank>{player.score}</Styled.Rank>
            </Styled.RankContainer>

            <Styled.NameContainer>
              <Styled.Name>{player.name}</Styled.Name>
              <LottieView
                source={icon}
                style={{
                  width: 35,
                  height: 35,
                  marginLeft: 10,
                }}
              />
            </Styled.NameContainer>
          </Styled.Pill>
        );
      }}
    />
  );
};
