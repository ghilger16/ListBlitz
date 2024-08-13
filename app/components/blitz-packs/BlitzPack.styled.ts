import styled from "styled-components/native";

export const CardContainer = styled.TouchableOpacity`
  width: 150px;
  height: 200px;
  background-color: #fff;
  border-radius: 10px;
  padding: 10px;
  margin: 10px;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  elevation: 5;
`;

export const CardTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin-top: 10px;
`;

export const CardImage = styled.Image`
  width: 100px;
  height: 100px;
  margin-bottom: 10px;
`;
