import React from "react";

import * as Styled from "./BlitzPack.styled";
import { COLORS } from "../constants";

interface IBlitzPackProps {
  title: string;
  onPress: () => void;
  index: number;
}

const BlitzPack: React.FC<IBlitzPackProps> = ({ title, onPress, index }) => {
  const assignedColor = COLORS[index % COLORS.length];
  return (
    <Styled.CardContainer onPress={onPress}>
      <Styled.VibrantBackground colors={assignedColor} />
      <Styled.CardTitle>{title}</Styled.CardTitle>
    </Styled.CardContainer>
  );
};

export default BlitzPack;
