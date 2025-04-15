import React from "react";
import Svg, { Defs, LinearGradient, Stop, Rect } from "react-native-svg";
import * as Styled from "./ScoreRankings.styled";

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
  // Sort players by score in descending order
  const sortedPlayers = [...players]
    .filter((player) => player.score > 0) // Only include players with a score
    .sort((a, b) => b.score - a.score);

  console.log("Sorted Players:", sortedPlayers);
  return (
    <Styled.Container>
      {sortedPlayers.map((player) => (
        <Styled.Pill
          key={player.id}
          style={{
            backgroundColor: player.startColor || "#000", // Use startColor as the background
          }}
        >
          <Styled.RankContainer>
            <Styled.Rank>{player.score}</Styled.Rank>
          </Styled.RankContainer>

          <Styled.Name>{player.name}</Styled.Name>
        </Styled.Pill>
      ))}
    </Styled.Container>
  );
};
