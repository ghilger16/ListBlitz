import styled from "styled-components/native";

export const PromptContainer = styled.View`
  background-color: #192c43;
  border-radius: 30px;
  padding: 15px 25px;
  margin: 10px 20px;
  align-items: center;
  justify-content: center;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.2;
  shadow-radius: 5px;
  elevation: 5;
  border: 5px solid #f6c212;
`;

export const PromptText = styled.Text`
  font-family: "LuckiestGuy";
  font-size: 23px;
  font-weight: bold;
  margin-top: 5px;
  color: #ffffff;
  text-align: center;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
`;
