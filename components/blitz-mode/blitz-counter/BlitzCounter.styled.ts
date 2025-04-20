import styled from "styled-components/native";
import { Text as SvgText } from "react-native-svg";

export const Container = styled.SafeAreaView`
  align-items: center;
  width: 320px;
  height: 375px;
`;

export const Score = styled.Text`
  font-size: 60px;
  font-weight: bold;
  font-family: "LuckiestGuy";
  text-align: center;
  margin-top: 75px;
  color: #fff;
`;

export const TimerText = styled.Text`
  font-size: 26px;
  font-weight: bold;
  color: #fff;
  margin-top: 5px;
  text-align: center;
`;

export const PillButtonText = styled.Text`
  font-size: 25px;
  font-weight: bold;
  color: #000;
  text-align: center;
  margin-top: 12px;
  font-family: "LuckiestGuy";
`;

export const PillButtonWrapper = styled.View`
  position: absolute;
  bottom: 5%;
  width: 105%;
  height: 40px;
  align-items: center;
`;

export const SvgScoreText = styled(SvgText)`
  font-size: 60px;
  font-weight: bold;
  font-family: "LuckiestGuy";
  fill: #fff;
  text-anchor: middle;
`;

export const SvgTimerText = styled(SvgText)`
  font-size: 24px;
  font-weight: bold;
  fill: #fff;
  text-anchor: middle;
`;
