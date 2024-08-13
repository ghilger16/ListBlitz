import React from "react";
import * as Styled from "./PurchasedSection.styled";
import { BlitzPack } from "@Components";

const blitzPackTitles = ["Pack 1", "Pack 2", "Pack 3"]; // Example titles

export const PurchasedSection: React.FC = () => {
  return (
    <Styled.ScrollContainer horizontal>
      {blitzPackTitles.map((title, index) => (
        <BlitzPack key={index} title={title} />
      ))}
    </Styled.ScrollContainer>
  );
};
