import React from "react";
import { GameMode, useGameplay } from "@Context";

import * as Styled from "./ModeSelect.styled";

const MODES = {
  [GameMode.CHILL]: "Chill Mode",
  [GameMode.BLITZ]: "Blitz Mode",
};

const ModeSelect: React.FC = ({}) => {
  const { gameSettings } = useGameplay();

  return (
    <Styled.Container>
      <Styled.Circle isActive={gameSettings.mode === GameMode.CHILL}>
        <Styled.ModeText>{MODES[gameSettings.mode]}</Styled.ModeText>
      </Styled.Circle>
    </Styled.Container>
  );
};

export default ModeSelect;
