import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Animated,
  Text,
  StyleSheet,
  ViewStyle,
  Image,
  ImageSourcePropType,
  TouchableWithoutFeedback,
} from "react-native";
import Svg, { Path, Text as SvgText } from "react-native-svg";
import { playSound } from "components/utils";
import { countdownSound } from "@Assets";
import LottieView from "lottie-react-native";
import { alphabetIcons } from "@Services";
import { getUniqueRandomLetter } from "./utils";
import { GameMode } from "@Context";

export const PromptDisplay: React.FC<{
  prompt: string;
  playerColor: string;
  mode: GameMode;
  isObscured?: boolean;
  countdown?: number | null;
  categoryBubble?: ImageSourcePropType;
  isAlphaBlitz?: boolean;
  selectedCategory?: string | null;
  handleSkipPrompt?: () => void;
}> = ({
  prompt,
  playerColor,
  mode,
  isObscured,
  countdown,
  categoryBubble,
  isAlphaBlitz,
  selectedCategory,
  handleSkipPrompt,
}) => {
  const [bounceValue] = useState(new Animated.Value(1));
  const [fadeValue] = useState(new Animated.Value(0));
  const [scaleValue] = useState(new Animated.Value(0.8));
  const [hasPlayedSound, setHasPlayedSound] = useState(false);

  const [letterIndex, setLetterIndex] = useState<string | null>(null);
  const hasSetLetterRef = useRef(false);
  const iconReadyRef = useRef(false);

  const alphaIcon = letterIndex ? alphabetIcons[letterIndex] : null;

  useEffect(() => {
    if (!isObscured && isAlphaBlitz && !hasSetLetterRef.current) {
      const letter = getUniqueRandomLetter();

      setLetterIndex(letter);
      iconReadyRef.current = true;
      hasSetLetterRef.current = true;
    }
  }, [isObscured, isAlphaBlitz]);

  useEffect(() => {
    if (typeof countdown === "number" && !hasPlayedSound) {
      playSound(countdownSound);
      iconReadyRef.current = false;
      setHasPlayedSound(true);
    }

    if (countdown === null) {
      setHasPlayedSound(false);
      hasSetLetterRef.current = false;
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

  useEffect(() => {
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
  }, [prompt]);

  const containerStyle: ViewStyle = {
    ...styles.container,
    borderColor: playerColor,
  };

  return (
    <View style={{ alignItems: "center" }}>
      <View style={containerStyle}>
        {isAlphaBlitz && selectedCategory ? (
          <>
            <View
              style={{ position: "absolute", top: 15, alignItems: "center" }}
            >
              <Animated.View
                style={{
                  transform: [{ scale: bounceValue }],
                }}
              >
                <Text style={[styles.promptText]}>List {selectedCategory}</Text>
                <Text style={[styles.promptText]}>
                  that start with the letter
                </Text>
              </Animated.View>
            </View>
            <View
              style={{ position: "absolute", bottom: -5, alignItems: "center" }}
            >
              {mode === GameMode.BLITZ && countdown !== null ? (
                <Animated.Text
                  style={[
                    styles.promptText,
                    {
                      opacity: fadeValue,
                      transform: [{ scale: scaleValue }],
                      fontSize: 45,
                      color: "#fff",
                      marginTop: countdown ? 20 : 5,
                    },
                  ]}
                >
                  {countdown}
                </Animated.Text>
              ) : !isObscured ? (
                alphaIcon && iconReadyRef.current ? (
                  <LottieView
                    source={alphaIcon}
                    autoPlay
                    loop={false}
                    style={[styles.alphaIcon, { marginTop: 20 }]}
                  />
                ) : null
              ) : (
                <Text
                  style={[
                    styles.promptText,
                    { fontSize: 45, color: "#FFF", fontFamily: "LuckiestGuy" },
                  ]}
                >
                  ?
                </Text>
              )}
            </View>
          </>
        ) : isAlphaBlitz && isObscured ? (
          countdown !== null ? (
            <Animated.Text
              style={[
                styles.promptText,
                {
                  opacity: fadeValue,
                  transform: [{ scale: scaleValue }],
                  fontSize: 70,
                  color: "#fff",
                  marginTop: countdown ? 20 : 5,
                },
              ]}
            >
              {countdown}
            </Animated.Text>
          ) : (
            <Text style={styles.promptText}>List Blitz</Text>
          )
        ) : isObscured ? (
          countdown !== null ? (
            <Animated.Text
              style={[
                styles.promptText,
                {
                  opacity: fadeValue,
                  transform: [{ scale: scaleValue }],
                  fontSize: 70,
                  color: "#fff",
                  marginTop: countdown ? 20 : 5,
                },
              ]}
            >
              {countdown}
            </Animated.Text>
          ) : (
            <Text style={styles.promptText}>List Blitz</Text>
          )
        ) : (
          <View style={styles.promptBubble}>
            <Animated.Text
              style={[
                styles.promptText,
                { transform: [{ scale: bounceValue }] },
              ]}
            >
              {selectedCategory ? selectedCategory : prompt}
            </Animated.Text>
          </View>
        )}
      </View>
      {handleSkipPrompt && (
        <TouchableWithoutFeedback onPress={handleSkipPrompt}>
          <Svg
            height="50"
            width="60"
            style={{
              position: "absolute",
              bottom: 5,
              right: 18,
            }}
          >
            <Path d="M0,50 L45,50 Q60,50 60,35 L60,0 Z" fill={playerColor} />
            <SvgText
              x="22"
              y="45"
              fill="#000"
              fontSize="15"
              fontWeight="bold"
              fontFamily="LuckiestGuy"
              transform="rotate(-45, 30, 30)"
            >
              Skip
            </SvgText>
          </Svg>
        </TouchableWithoutFeedback>
      )}
      {categoryBubble && (
        <Image source={categoryBubble} style={styles.bubbleImage} />
      )}
      {/* <View style={styles.skipButtonContainer}>
        <Text style={styles.skipButtonText}>Skip</Text>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#192c43",
    borderRadius: 30,
    width: 375,
    height: 115,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 5,
    padding: 10,
  },
  promptText: {
    fontFamily: "LuckiestGuy",
    fontSize: 23,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    flexWrap: "wrap",
  },
  bubbleImage: {
    position: "absolute",
    bottom: 90,
    height: 80,
    resizeMode: "contain",
    zIndex: 1,
  },
  alphaIcon: {
    width: 55,
    height: 60,
    color: "#fff",
  },
  letterBubble: {
    position: "absolute",
    bottom: 95,
    left: 135,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#192c43",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    zIndex: 2,
  },
  skipButtonContainer: {
    position: "absolute",
    bottom: 10,
    right: 20,
    backgroundColor: "#ffffff22",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  skipButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "LuckiestGuy",
  },
  promptBubble: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
});
