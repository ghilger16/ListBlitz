import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";

export const SafeAreaWrapper = styled.SafeAreaView`
  flex: 1;
  background-color: #192c43;
`;

export const Title = styled.Text`
  font-family: "SourGummy";
  font-size: 50px;
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

export const StartButton = styled(TouchableOpacity)`
  background-color: #ff6600;
  padding: 15px 25px;
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

  /* Disabled state */
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
`;

export const ButtonText = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: white;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  text-shadow: 0px 3px 6px rgba(0, 0, 0, 0.3);
`;
