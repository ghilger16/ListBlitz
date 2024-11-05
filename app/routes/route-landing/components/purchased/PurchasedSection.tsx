import React from "react";
import * as Styled from "./PurchasedSection.styled";
import { BlitzPack } from "@Components/blitz-packs";
import { useRouter } from "expo-router";
import { useGetBlitzPacks } from "app/services";

const blitzPackTitles = ["Pack", "Pack 2", "Pack 3", "Pack 4", "Pack 5"];

export const PurchasedSection: React.FC = () => {
  const router = useRouter();
  const { data: blitzPacks = [], isLoading, error } = useGetBlitzPacks();

  const handlePackPress = (title: string, id: number) => {
    router.push({
      pathname: `routes/route-player-select/PlayerSelectContent`,
      params: { title, id },
    });
  };

  return (
    <Styled.ScrollContainer horizontal>
      {blitzPacks.map((pack) => (
        <BlitzPack
          key={pack.id}
          title={pack.title}
          onPress={() => handlePackPress(pack.title, pack.id)}
        />
      ))}
    </Styled.ScrollContainer>
  );
};
