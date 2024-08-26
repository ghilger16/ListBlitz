import React, { useState } from "react";

import * as Styled from "./PlayersSelect.styled";

export const PlayersSelect: React.FC = () => {
  const [count, setCount] = useState(1);

  const increment = () => setCount((prevCount) => prevCount + 1);
  const decrement = () =>
    setCount((prevCount) => (prevCount > 1 ? prevCount - 1 : 1));

  return (
    <Styled.Container>
      <Styled.Button onPress={increment}>
        <Styled.ButtonText>+</Styled.ButtonText>
      </Styled.Button>
      <Styled.Circle>
        <Styled.CircleText>{count}</Styled.CircleText>
      </Styled.Circle>
      <Styled.Button onPress={decrement}>
        <Styled.ButtonText>-</Styled.ButtonText>
      </Styled.Button>
    </Styled.Container>
  );
};
