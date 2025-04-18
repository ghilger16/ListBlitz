import styled from "styled-components/native";

export const Container = styled.View`
  flex-direction: column;
  justify-content: center;
`;

export const Pill = styled.View`
  margin-top: 10px;
  width: 300px;
  height: 40px;
  border-radius: 20px;
  flex-direction: row;
  align-items: center;
  padding-left: 5px;
  padding-right: 5px;
  left: 4%;
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
  font-size: 18px;
  font-weight: bold;
  color: #000;
`;

export const Name = styled.Text`
  font-size: 25px;
  font-weight: bold;
  color: #000;
  text-align: center;
  margin-top: 10px;
  margin-left: 50px;
  font-family: "LuckiestGuy";
`;

export const Score = styled.Text`
  color: #fff;

  font-weight: bold;
`;
