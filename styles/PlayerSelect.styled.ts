import { Animated, TouchableOpacity } from "react-native";
import styled from "styled-components/native";

export const SafeAreaWrapper = styled.SafeAreaView`
  flex: 1;
`;

export const Title = styled.Text`
  font-family: "SourGummy";
  font-size: 25px;
  text-transform: uppercase;
  color: #ffffff;
  text-shadow: 0px 2px 4px rgba(0, 191, 255, 0.7);
  letter-spacing: 2px;
  text-align: center;
  align-self: center;
`;

export const WheelTitle = styled.Text`
  text-transform: uppercase;
  text-shadow: 0px 2px 4px rgba(0, 191, 255, 0.7);
  letter-spacing: 2px;
  margin-bottom: 20px;
`;

export const PlayersWrapper = styled.View`
  margin-top: 75px;
  align-items: center;
  pointer-events: box-none;
`;

export const StartButton = styled(TouchableOpacity).attrs({
  activeOpacity: 0.7,
})`
  background-color: #ff6600;
  border-radius: 60px;
  align-items: center;
  justify-content: center;
  margin-top: 175px;
  elevation: 8;
  shadow-color: rgba(255, 165, 0, 0.5);
  shadow-offset: 0px 6px;
  shadow-opacity: 0.4;
  shadow-radius: 8px;
  border-width: 3px;
  border-color: #ffcc00;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
`;

export const StartText = styled(Animated.Text)`
  font-size: 50px;
  font-weight: bold;
  color: white;
  text-transform: uppercase;
  text-align: center;
  text-shadow-offset: 0px 0px;
  text-shadow-radius: 8px;
  font-family: "SourGummy";
`;
