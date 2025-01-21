import { FlashingText } from "components/flashing-text";
import styled from "styled-components/native";

export const Container = styled.View`
  align-items: center;
  justify-content: center;
  margin-top: -262px;
`;

export const Circle = styled.View<{ isActive: boolean }>`
  width: 130px;
  height: 130px;
  border-radius: 100px;
  justify-content: center;
  align-items: center;
  border-width: 3px;
  border-color: #000;
  background-color: ${(props) => (props.isActive ? "#FFD700" : "#87CEFA")};
`;

export const ModeText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #000;
  align-items: flex-start;
  justify-content: center;
`;
