import styled from "styled-components/native";

export const PromptContainer = styled.View`
  background-color: #192c43; /* Vibrant pink to match the background */
  border-radius: 30px; /* Rounded corners for the container */
  padding: 15px 25px; /* Padding for inner content */
  margin: 10px 20px; /* Margin around the prompt */
  align-items: center; /* Center the text horizontally */
  justify-content: center; /* Center the text vertically */
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.2;
  shadow-radius: 5px;
  elevation: 5; /* For Android shadow */
  border: 5px solid #f6c212;
`;

export const PromptText = styled.Text`
  font-family: "LuckiestGuy";
  font-size: 23px; /* Large, bold font for the prompt */
  font-weight: bold;
  margin-top: 5px;
  color: #ffffff; /* White text for contrast */
  text-align: center; /* Center the text */
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5); /* Subtle text shadow */
`;
