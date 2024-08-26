import styled from "styled-components/native";

export const Container = styled.View`
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 20px;
`;

export const Button = styled.TouchableOpacity`
  background-color: #007bff;
  padding: 10px 20px;
  border-radius: 5px;
  margin: 10px 0;
`;

export const ButtonText = styled.Text`
  color: #fff;
  font-size: 20px;
`;

export const Circle = styled.View`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  background-color: #f0f0f0;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
`;

export const CircleText = styled.Text`
  font-size: 40px;
  font-weight: bold;
  color: #333;
`;
