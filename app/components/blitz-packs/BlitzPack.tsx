import React from "react";

import * as Styled from "./BlitzPack.styled";

interface IBlitzPackProps {
  title: string;
}

export const BlitzPack: React.FC<IBlitzPackProps> = ({ title }) => {
  return (
    <Styled.CardContainer>
      <Styled.CardTitle>{title}</Styled.CardTitle>
    </Styled.CardContainer>
  );
};
