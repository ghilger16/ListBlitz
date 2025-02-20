import LottieView from "lottie-react-native";
import styled from "styled-components/native";

export const NextPlayerContainer = styled.View`
  background-color: #f6c212;
  width: 300px;
  height: 60px;
  padding: 10px;
  border-radius: 60px;
  flex-direction: row;
  align-items: center;
  justify-content: ;
`;

export const NextPlayerText = styled.Text`
  color: #192c43;
  font-family: "SourGummy";
  font-size: 30px;
  text-align: center;
  margin-left: 20px;
`;

export const PlayerIconContainer = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #fff;
  justify-content: center;
  align-items: center;
`;

export const PlayerIcon = styled(LottieView)`
  width: 30px;
  height: 30px; /* Slightly smaller icon */
`;
