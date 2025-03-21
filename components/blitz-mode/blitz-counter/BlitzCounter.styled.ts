import { Animated } from "react-native";
import styled from "styled-components/native";

export const Container = styled.SafeAreaView`
  align-items: center;
  justify-content: center;
`;

export const Score = styled.Text`
  top: -45px;
  left: 115px;
  font-family: "LuckiestGuy";
  font-size: 45px;
  font-weight: bold;
  color: #fff;
`;

export const Score2 = styled.Text`
  top: -220px;
  left: 0px;
  font-family: "LuckiestGuy";
  font-size: 70px;
  font-weight: bold;
  color: #fff;
`;

export const TextWrapper = styled.View`
  margin: -35px 0px 0px -80px;
`;

export const TimerText = styled.Text`
  position: absolute;
  bottom: -60px;
  font-size: 20px;
  font-weight: bold;
  color: #fff;
`;

export const PillButton = styled.View`
  position: absolute;
  width: 300px;
  height: 40px;
  border-radius: 20px;
  left: 4%;
  top: 62%;
  overflow: hidden;
`;

export const PillButtonText = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #000;
  text-align: center;
  text-align-vertical: center;
`;
