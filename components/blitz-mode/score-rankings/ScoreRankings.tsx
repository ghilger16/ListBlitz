import React from "react";
import Svg, { Defs, LinearGradient, Stop, Rect } from "react-native-svg";
import * as Styled from "./ScoreRankings.styled";

interface ScoreRankingsProps {
  players: {
    id: number;
    name: string;
    score: number;
    color: [string, string]; // Start and End Colors
  }[];
}

export const ScoreRankings: React.FC<ScoreRankingsProps> = ({ players }) => {
  // Sort players by score in descending order
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <Styled.Container>
      {sortedPlayers.map((player, index) => (
        <Styled.Pill key={player.id}>
          <Svg
            height="100%"
            width="100%"
            style={{ position: "absolute", borderRadius: 20 }}
          >
            <Defs>
              <LinearGradient
                id={`grad-${player.id}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <Stop offset="0%" stopColor={player.color[0]} />
                <Stop offset="100%" stopColor={player.color[1]} />
              </LinearGradient>
            </Defs>
            <Rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill={`url(#grad-${player.id})`}
              rx="20"
              ry="20"
            />
          </Svg>

          <Styled.RankContainer>
            <Styled.Rank>{player.score}</Styled.Rank>
          </Styled.RankContainer>

          <Styled.Name>{player.name}</Styled.Name>
        </Styled.Pill>
      ))}
    </Styled.Container>
  );
};
