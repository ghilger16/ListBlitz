import styled from "styled-components/native";
import { Animated } from "react-native";

export const Container = styled.View`
  align-items: center;
  justify-content: center;
  margin-top: -262px;
`;

export const AnimatedCircle = styled(Animated.View)`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  align-items: center;
  justify-content: center;
  shadow-color: #000;
  shadow-opacity: 0.3;
  shadow-radius: 8px;
  elevation: 5;
`;

export const ModeText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: white;
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
