import styled from "styled-components/native";

export const HeaderContainer = styled.View`
  height: 225px; /* Set desired height */
  background-color: green;
  align-items: center;
  justify-content: flex-end; /* Align title at the bottom */
  padding-bottom: 10px;
`;

export const HeaderImage = styled.Image`
  position: absolute; /* Position the image behind the title */
  width: 100%;
  height: 100%;
  resize-mode: cover;
`;

export const HeaderTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: black; /* Ensure text is readable on the image */
  z-index: 1; /* Ensure the title appears above the image */
`;
