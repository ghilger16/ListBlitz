import React, { useState } from "react";

import * as Styled from "./PlayersSelect.styled";

export const PlayersSelect: React.FC = () => {
  const [count, setCount] = useState(1);

  const increment = () => setCount((prevCount) => prevCount + 1);
  const decrement = () =>
    setCount((prevCount) => (prevCount > 1 ? prevCount - 1 : 1));

  const renderNumbers = () => {
    const numbers = [];
    const outerRadius = 150; // Half of the circle's width/height
    const innerRadius = outerRadius + 18; // Move numbers inward by reducing the radius
    const centerX = outerRadius;
    const centerY = outerRadius;

    for (let i = 1; i <= count; i++) {
      const angle = (i - 1) * (360 / count) - 90; // Adjust to start from the bottom
      const x = centerX + innerRadius * Math.cos((angle * Math.PI) / 180);
      const y = centerY + innerRadius * Math.sin((angle * Math.PI) / 180);

      numbers.push(
        <Styled.NumberContainer
          key={i}
          style={{
            position: "absolute",
            left: x - 15, // Adjust to center the number
            top: y - 15, // Adjust to center the number
          }}
        >
          <Styled.NumberText>{i}</Styled.NumberText>
        </Styled.NumberContainer>
      );
    }
    return numbers;
  };

  return (
    <Styled.Container>
      <Styled.Circle>
        {renderNumbers()}
        <Styled.Button onPress={increment}>
          <Styled.ButtonText>+</Styled.ButtonText>
        </Styled.Button>
        <Styled.CircleText>{count}</Styled.CircleText>
        <Styled.Button onPress={decrement}>
          <Styled.ButtonText>-</Styled.ButtonText>
        </Styled.Button>
      </Styled.Circle>
    </Styled.Container>
  );
};
