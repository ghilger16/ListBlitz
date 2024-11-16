import React from "react";

import * as Styled from "./BlitzPack.styled";

interface IBlitzPackProps {
  title: string;
  onPress: () => void;
}

export const BlitzPack: React.FC<IBlitzPackProps> = ({ title, onPress }) => {
  return (
    <Styled.CardContainer onPress={onPress}>
      <Styled.VibrantBackground />
      <Styled.CardTitle>{title}</Styled.CardTitle>
    </Styled.CardContainer>
  );
};
