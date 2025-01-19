import React from "react";
import { useRouter } from "expo-router";
import { useGetBlitzPacks } from "@Services";
import { useGameplay } from "@Context"; // Import GameContext

import * as Styled from "./PackLibrary.styled";
import { BlitzPack } from "../blitz-packs";

const PackLibrary: React.FC = () => {
  const router = useRouter();
  const { setGameSettings } = useGameplay(); // Access context
  const { data: blitzPacks = [] } = useGetBlitzPacks();

  const handlePackPress = (title: string, id: number) => {
    setGameSettings({
      blitzPackId: id,
      blitzPackTitle: title,
    });

    router.push("/player-select");
  };

  // Group packs into rows of 3
  const rows = [];
  for (let i = 0; i < blitzPacks.length; i += 3) {
    rows.push(blitzPacks.slice(i, i + 3));
  }

  return (
    <>
      <Styled.Title>Blitz Packs</Styled.Title>
      <Styled.ScrollContainer
        horizontal={false} // Enable vertical scrolling
        showsVerticalScrollIndicator={true} // Show vertical scroll indicator
      >
        <Styled.ContentContainer>
          {rows.map((row, rowIndex) => (
            <Styled.Row key={rowIndex}>
              {row.map((pack, index) => (
                <BlitzPack
                  key={pack.id} // Add unique key for each pack
                  title={pack.title}
                  onPress={() => handlePackPress(pack.title, pack.id)}
                  index={rowIndex * 3 + index} // Calculate global index
                />
              ))}
            </Styled.Row>
          ))}
        </Styled.ContentContainer>
      </Styled.ScrollContainer>
    </>
  );
};

export default PackLibrary;
