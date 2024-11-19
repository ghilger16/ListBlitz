import React from "react";
import styled from "styled-components/native";
import { BlitzPack } from "@Components/blitz-packs";
import { useRouter } from "expo-router";
import { useGetBlitzPacks } from "app/services";

import * as Styled from "./PurchasedSection.styled";

const PurchasedSection: React.FC = () => {
  const router = useRouter();
  const { data: blitzPacks = [] } = useGetBlitzPacks();

  const handlePackPress = (title: string, id: number) => {
    router.push({
      pathname: `routes/route-player-select/PlayerSelectContent`,
      params: { title, id },
    });
  };

  const half = Math.ceil(blitzPacks.length / 2);
  const firstRow = blitzPacks.slice(0, half);
  const secondRow = blitzPacks.slice(half);

  return (
    <Styled.ScrollContainer
      horizontal
      showsHorizontalScrollIndicator={false}
      directionalLockEnabled
      alwaysBounceVertical={false}
    >
      <Styled.ContentContainer>
        <Styled.Row>
          {firstRow.map((pack) => (
            <BlitzPack
              title={pack.title}
              onPress={() => handlePackPress(pack.title, pack.id)}
            />
          ))}
        </Styled.Row>
        <Styled.Row>
          {secondRow.map((pack) => (
            <BlitzPack
              title={pack.title}
              onPress={() => handlePackPress(pack.title, pack.id)}
            />
          ))}
        </Styled.Row>
      </Styled.ContentContainer>
    </Styled.ScrollContainer>
  );
};

export default PurchasedSection;
