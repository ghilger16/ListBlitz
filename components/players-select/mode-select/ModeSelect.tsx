import React, { useEffect, useRef } from "react";
import { GameMode } from "@Context";
import { Animated, Easing } from "react-native";
import * as Styled from "./ModeSelect.styled";

import { TouchableWithoutFeedback } from "react-native-gesture-handler";

const MODES = {
  [GameMode.CHILL]: "Chill\nMode",
  [GameMode.BLITZ]: "Blitz\nMode",
};

interface ModeSelectProps {
  onModeChange: (newMode: GameMode) => void;
  mode: GameMode;
}

const ModeSelect: React.FC<ModeSelectProps> = ({ onModeChange, mode }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onModeChange(mode === GameMode.CHILL ? GameMode.BLITZ : GameMode.CHILL);
  };

  return (
    <Styled.Container>
      <TouchableWithoutFeedback onPress={handlePress}>
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }],
          }}
        >
          <Styled.Circle isActive={mode === GameMode.CHILL}>
            <Styled.ModeText isActive={mode === GameMode.CHILL}>
              {MODES[mode]}
            </Styled.ModeText>
          </Styled.Circle>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Styled.Container>
  );
};

export default ModeSelect;
