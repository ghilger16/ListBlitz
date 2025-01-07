import React, { useState } from "react";
import * as Styled from "./ModeSelect.styled"; // Import the styled components

const MODES = ["Chill", "Blitz"]; // Available modes

interface CenterOptionsProps {
  onModeChange: (mode: string) => void;
  mode: number;
}

const ModeSelect: React.FC<CenterOptionsProps> = ({ onModeChange, mode }) => {
  // Handle mode change
  const handleModeChange = () => {
    onModeChange(MODES[mode].toLowerCase()); // Trigger parent callback
  };

  return (
    <Styled.FullScreen
      activeOpacity={1} // Prevent fade animation
      onPress={handleModeChange} // Handle taps anywhere
    >
      <Styled.Container>
        {/* Center Circle */}
        <Styled.Circle isActive={mode === 0}>
          <Styled.ModeText>{MODES[mode]}</Styled.ModeText>
        </Styled.Circle>

        {/* Tabs Below the Wheel */}
        <Styled.IndicatorContainer>
          {MODES.map((_, index) => (
            <Styled.Indicator
              key={index}
              isActive={mode === index}
              onPress={() => onModeChange(MODES[index].toLowerCase())}
            />
          ))}
        </Styled.IndicatorContainer>
      </Styled.Container>
    </Styled.FullScreen>
  );
};

export default ModeSelect;
