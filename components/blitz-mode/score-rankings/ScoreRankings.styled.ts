import styled from "styled-components/native";

export const Container = styled.View`
  margin-top: 20px;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
`;

export const Pill = styled.View`
  position: absolute;
  width: 300px;
  height: 40px;
  border-radius: 20px;
  flex-direction: row;
  align-items: center;
  padding-left: 5px;
  padding-right: 5px;
`;

export const RankContainer = styled.View`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #fff;
  justify-content: center;
  align-items: center;
`;

export const Rank = styled.Text`
  font-weight: bold;
  color: #000;
`;

export const Name = styled.Text`
  color: #192c43;
  font-family: "SourGummy";
  font-size: 30px;
  text-align: center;
  margin-left: 20px;
`;

export const Score = styled.Text`
  color: #fff;
  font-weight: bold;
`;
