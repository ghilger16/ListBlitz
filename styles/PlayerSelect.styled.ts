import styled from "styled-components/native";

export const SafeAreaWrapper = styled.SafeAreaView`
  flex: 1;
  background-color: #192c43;
`;

export const Title = styled.Text`
  font-family: "SourGummy";
  font-size: 24px;
  text-transform: uppercase;
  color: #ffffff;
  text-shadow: 0px 2px 4px rgba(0, 191, 255, 0.7);
  letter-spacing: 2px;
  text-align: center;
  align-self: center;
`;

export const WheelTitle = styled.Text`
  font-family: "SourGummy";
  font-size: 24px;
  text-transform: uppercase;
  color: #ffffff;
  text-shadow: 0px 2px 4px rgba(0, 191, 255, 0.7);
  letter-spacing: 2px;
  margin-bottom: 10px;
`;

export const PlayersWrapper = styled.View`
  margin-top: 140px;
  align-items: center;
  pointer-events: box-none;
`;
