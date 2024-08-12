import { ScrollView, View, Text } from "react-native";

import * as Styled from "./PurchasedSection.styled";
export const PurchasedSection: React.FC = () => {
  return (
    <Styled.ScrollContainer horizontal>
      <View>
        <Text>Item </Text>
      </View>
      <View>
        <Text>Item </Text>
      </View>
      <View>
        <Text>Item </Text>
      </View>
    </Styled.ScrollContainer>
  );
};
