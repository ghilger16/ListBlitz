import styled from "styled-components/native";

export const ScrollContainer = styled.ScrollView.attrs({
  contentContainerStyle: {
    paddingHorizontal: 10,
  },
})`
  flex-grow: 0;
  margin-top: 15px;
`;

export const ContentContainer = styled.View`
  flex-direction: column;
`;

export const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
`;
