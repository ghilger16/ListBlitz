import styled from "styled-components/native";

export const Container = styled.View`
  align-items: center;
  justify-content: center;
  margin-top: -245px;
`;

export const Circle = styled.View<{ isActive: boolean }>`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  justify-content: center;
  align-items: center;
  border-width: 2px;
  border-color: #000;
  background-color: ${(props) => (props.isActive ? "#FFD700" : "#87CEFA")};
`;

export const ModeText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #000;
`;

export const IndicatorContainer = styled.View`
  flex-direction: row;
  margin-top: 175px;
`;

export const Indicator = styled.TouchableOpacity<{ isActive: boolean }>`
  width: 25px;
  height: 25px;
  border-radius: 100px;
  margin: 0 5px;
  background-color: ${(props) => (props.isActive ? "#FFD700" : "grey")};
`;
