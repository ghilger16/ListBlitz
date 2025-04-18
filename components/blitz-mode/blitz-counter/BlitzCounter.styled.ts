import { Animated } from "react-native";
import styled from "styled-components/native";

export const Container = styled.SafeAreaView`
  flex: 1;
  justify-content: center;
  align-items: center;
  border: 5px solid red;
`;

export const Score = styled.Text`
  font-family: "LuckiestGuy";
  font-size: 55px;
  font-weight: bold;
  color: #fff;
`;

export const TextWrapper = styled.View`
  margin: -35px 0px 0px -80px;
`;

export const TimerText = styled.Text`
  font-size: 26px;
  font-weight: bold;
  color: #fff;
  margin-top: 10px;
`;

export const PillButton = styled.View`
  width: 300px;
  height: 40px;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

export const PillButtonText = styled.Text`
  font-size: 25px;
  font-weight: bold;
  color: #000;
  text-align: center;
  margin-top: 10px;
  font-family: "LuckiestGuy";
`;
