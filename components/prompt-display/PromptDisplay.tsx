import React, { useState, useEffect } from "react";
import {
  View,
  Animated,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { playSound } from "components/utils";
import { countdownSound } from "@Assets";

export const PromptDisplay: React.FC<{
  prompt: string;
  playerColor: string;
  isObscured?: boolean;
  countdown?: number | null;
}> = ({ prompt, playerColor, isObscured, countdown }) => {
  const [bounceValue] = useState(new Animated.Value(1));
  const [fadeValue] = useState(new Animated.Value(0));
  const [scaleValue] = useState(new Animated.Value(0.8));
  const [hasPlayedSound, setHasPlayedSound] = useState(false);

  useEffect(() => {
    if (countdown !== null && !hasPlayedSound) {
      playSound(countdownSound);
      setHasPlayedSound(true);
    }

    if (countdown === null) {
      setHasPlayedSound(false);
    }
  }, [countdown, hasPlayedSound]);

  useEffect(() => {
    if (countdown !== null) {
      fadeValue.setValue(0);
      scaleValue.setValue(0.8);
      Animated.parallel([
        Animated.timing(fadeValue, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(scaleValue, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.sequence([
        Animated.spring(bounceValue, {
          toValue: 1.2,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.spring(bounceValue, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [countdown]);

  const containerStyle: ViewStyle = {
    ...styles.container,
    borderColor: playerColor,
  };

  return (
    <View style={containerStyle}>
      {isObscured ? (
        countdown !== null ? (
          <Animated.Text
            style={[
              styles.promptText,
              {
                opacity: fadeValue,
                transform: [{ scale: scaleValue }],
                fontSize: 70,
                color: "#fff",
              },
            ]}
          >
            {countdown}
          </Animated.Text>
        ) : (
          <Text style={styles.promptText}>List Blitz</Text>
        )
      ) : (
        <Animated.Text
          style={[styles.promptText, { transform: [{ scale: bounceValue }] }]}
        >
          List {prompt}
        </Animated.Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#192c43",
    borderRadius: 30,
    width: 325,
    height: 115,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 5,
  },
  promptText: {
    fontFamily: "LuckiestGuy",
    fontSize: 23,
    fontWeight: "bold",
    marginTop: 5,
    color: "#ffffff",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    flexWrap: "wrap",
  },
});
