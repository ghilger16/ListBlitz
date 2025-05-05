import React from "react";
import * as Styled from "./CustomHeader.styled";

const headerGif = require("@Assets/gifs/header.gif");

const CustomHeader = () => {
  return (
    <Styled.HeaderContainer>
      <Styled.HeaderImage source={headerGif} />
      <Styled.HeaderBlurOverlay intensity={10} tint="dark" />
    </Styled.HeaderContainer>
  );
};

export default CustomHeader;
