import React from "react";
import * as Styled from "./PurchasedSection.styled";
import { BlitzPack } from "@Components/blitz-packs";
import { useRouter } from "expo-router";

const blitzPackTitles = ["Pack 1", "Pack 2", "Pack 3", "Pack 4", "Pack 5"]; // Example titles

export const PurchasedSection: React.FC = () => {
  const router = useRouter();

  const handlePackPress = (title: string) => {
    console.log("hit");
    router.push({
      pathname: "/routes/route-gameplay/GameplayContent",
      params: { title },
    });
  };

  return (
    <Styled.ScrollContainer horizontal>
      {blitzPackTitles.map((title, index) => (
        <BlitzPack
          key={index}
          title={title}
          onPress={() => handlePackPress(title)}
        />
      ))}
    </Styled.ScrollContainer>
  );
};
