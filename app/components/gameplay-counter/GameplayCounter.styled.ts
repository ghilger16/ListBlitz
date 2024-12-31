import styled from "styled-components/native";

export const Container = styled.View`
  align-items: center;
  justify-content: center;
`;

export const ChartContainer = styled.View`
  position: relative;
  align-items: center;
  justify-content: center;
`;

export const CenterButton = styled.TouchableOpacity`
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: #3498db;
  align-items: center;
  justify-content: center;
  top: 50px; // Positioned to fit inside the half-circle
`;

export const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;
