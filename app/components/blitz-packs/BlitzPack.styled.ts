import styled from "styled-components/native";

export const CardContainer = styled.TouchableOpacity`
  width: 75px;
  height: 100px;
  background-color: #fff;
  border-radius: 5px;
  padding: 5px;
  margin: 5px;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
  elevation: 3;
`;

export const CardTitle = styled.Text`
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  margin-top: 5px;
`;

export const CardImage = styled.Image`
  width: 50px;
  height: 50px;
  margin-bottom: 5px;
`;
