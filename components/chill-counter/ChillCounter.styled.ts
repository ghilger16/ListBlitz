import styled from "styled-components/native";

// Container for the entire component
export const Container = styled.View`
  align-items: center;
  justify-content: center;
`;

// Header Prompt Text
export const PromptText = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: white;
  padding: 10px;
  background: linear-gradient(90deg, #ff6f61, #ff9a8b);
  border-radius: 10px;
  margin-bottom: 20px;
`;

// Slice Text inside donut segments
export const SliceText = styled.Text`
  font-size: 16px;
  fill: white; // For SVG text
  text-anchor: middle;
  alignment-baseline: middle;
`;

// Center Button Styling
export const CenterButton = styled.TouchableOpacity<{ isGameStarted: boolean }>`
  position: absolute;
  width: 120px;
  height: 120px;
  border-radius: 60px;
  background-color: ${({ isGameStarted }) =>
    isGameStarted ? "#32CD32" : "#3498db"};
  align-items: center;
  justify-content: center;
  top: 110px; // Adjusted position to fit inside the donut
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.3);
`;

// Center Button Text
export const CenterText = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: white;
`;
