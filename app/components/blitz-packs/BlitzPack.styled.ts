import styled from "styled-components/native";
import { LinearGradient } from "expo-linear-gradient";

export const CardContainer = styled.TouchableOpacity`
  width: 120px;
  height: 150px;
  margin: 2px;
  padding: 10px;
  border-radius: 10px;
  background-color: #fff;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
  align-items: center;
  justify-content: center;
`;

export const CardTitle = styled.Text`
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  margin-top: 8px;
  color: #333;
`;

export const CardImage = styled.Image`
  width: 60px;
  height: 60px;
  margin-bottom: 8px;
`;

export const VibrantBackground = styled(LinearGradient).attrs(() => ({
  colors: ["#fdd835", "#29b6f6", "#ef5350"], // Gradient colors
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
}))`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: -1; /* Places the gradient behind the content */
`;
