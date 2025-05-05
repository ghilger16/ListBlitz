import styled from "styled-components/native";
import { LinearGradient } from "expo-linear-gradient";

export const CardContainer = styled.TouchableOpacity`
  width: 100px;
  height: 130px;
  margin: 2px;
  border-radius: 25px;
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

export const VibrantBackground = styled(LinearGradient)<{
  colors: [string, string];
}>`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 25px;
  z-index: -1; /* Places the gradient behind the content */
`;
