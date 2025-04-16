import { Animated } from "react-native";
import styled from "styled-components/native";

export const Container = styled.SafeAreaView`
  align-items: center;
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
  top: -145px;
  left: 0px;
  font-family: "LuckiestGuy";
  font-size: 55px;
  font-weight: bold;
  color: #fff;
`;

export const TextWrapper = styled.View`
  margin: -35px 0px 0px -80px;
`;

export const TimerText = styled.Text`
  position: absolute;
  bottom: -62px;
  left: 2px;
  font-size: 26px;
  font-weight: bold;
  color: #fff;
`;

export const PillButton = styled.View`
  position: absolute;
  width: 300px;
  height: 40px;
  border-radius: 20px;
  left: 4%;
  top: 75%;
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
