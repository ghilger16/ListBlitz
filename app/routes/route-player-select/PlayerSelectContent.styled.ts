import { GestureHandlerRootView } from "react-native-gesture-handler";
import styled from "styled-components/native";

export const Title = styled.Text`
  display: flex;
  justify-content: center;
`;

export const PlayersWrapper = styled(GestureHandlerRootView)`
  margin-top: 100px;
  align-items: center;
`;
