import styled from "styled-components/native";

export const ScrollContainer = styled.ScrollView.attrs({
  contentContainerStyle: {
    justifyContent: "center",
    alignItems: "center",
  },
})`
  flex-grow: 0;
  margin-top: 5px;
`;

export const Title = styled.Text`
  font-family: "SourGummy";
  font-size: 24px;
  text-transform: uppercase;
  color: #ffffff;
  text-shadow: 0px 2px 4px rgba(0, 191, 255, 0.7);
  letter-spacing: 2px;
`;

export const ContentContainer = styled.View`
  flex-direction: column;
`;

export const Row = styled.View`
  flex-direction: row;
  margin-bottom: 10px;
`;
