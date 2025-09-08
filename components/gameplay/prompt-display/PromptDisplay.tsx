import React, { useState, useEffect, useRef } from "react";
import { DdRum, RumActionType } from "@datadog/mobile-react-native";
import {
  View,
  Animated,
  Text,
  StyleSheet,
  ViewStyle,
  Image,
  ImageSourcePropType,
  Dimensions,
} from "react-native";

import LottieView from "lottie-react-native";

import { countdownSound } from "@Assets";
import { alphabetIcons, GameMode } from "@Context";
import { usePromptAnimations } from "@Hooks";
import { playSound, useScreenInfo } from "@Utils";
import { SkipButton } from "./SkipButton";
import { getUniqueRandomLetter } from "./utils";

const CUSTOM_ACTION = RumActionType.CUSTOM;

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Calculate aspect ratio and prompt width for Pro vs Max models
// const aspectRatio = screenHeight / screenWidth;
// const promptWidth =
//   screenWidth >= 420
//     ? Math.min(screenWidth * 0.94, 500) // Max phones (wider screens)
//     : Math.min(screenWidth * 0.936, 500); // Standard Pros

export const PromptDisplay: React.FC<{
  prompt: string;
  playerColor: string;
  mode: GameMode;
  isObscured?: boolean;
  countdown?: number | "GO!" | null;
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
  const { isTablet, isSmallPhone } = useScreenInfo();

  const categoryBubbleBottom = isTablet
    ? screenHeight * 0.1
    : isSmallPhone
    ? screenHeight * 0.125
    : screenHeight * 0.11;

  const promptWidth = isTablet
    ? Math.min(screenWidth * 0.9, 700)
    : isSmallPhone
    ? Math.min(screenWidth * 0.9, 360)
    : Math.min(screenWidth * 0.92, 500);

  const promptFontSize = isTablet ? 45 : isSmallPhone ? 22 : 30;
  const goFontSize = isTablet ? 100 : isSmallPhone ? 55 : 75;

  const { bounceValue, fadeValue, scaleValue } = usePromptAnimations(
    countdown ?? null,
    prompt
  );
  const [hasPlayedSound, setHasPlayedSound] = useState(false);

  const [letterIndex, setLetterIndex] = useState<string | null>(null);
  const hasSetLetterRef = useRef(false);
  const iconReadyRef = useRef(false);
  ``;

  const alphaIcon = alphabetIcons[letterIndex!];

  const shouldShowCountdown =
    typeof countdown === "number" || countdown === "GO!";

  useEffect(() => {
    if (!isObscured && isAlphaBlitz && !hasSetLetterRef.current) {
      const letter = getUniqueRandomLetter();

      setLetterIndex(letter);
      iconReadyRef.current = true;
      hasSetLetterRef.current = true;

      DdRum.addAction(CUSTOM_ACTION, "AlphaBlitz Prompt Shown", {
        letter,
        selectedCategory,
      });
    }
  }, [isObscured, isAlphaBlitz]);

  useEffect(() => {
    if (shouldShowCountdown && !hasPlayedSound) {
      playSound(countdownSound);
      iconReadyRef.current = false;
      setHasPlayedSound(true);
      DdRum.addAction(CUSTOM_ACTION, "Countdown Started", {
        countdownValue: countdown,
        prompt,
        mode,
      });
    }

    if (countdown === null) {
      setHasPlayedSound(false);
      hasSetLetterRef.current = false;
    }
  }, [countdown, hasPlayedSound]);

  const renderCountdown = () => (
    <Animated.Text
      style={[
        styles.promptText,
        {
          opacity: fadeValue,
          transform: [{ scale: scaleValue }],
          fontSize: goFontSize,
          color: "#fff",
          marginTop: shouldShowCountdown ? 20 : 5,
        },
      ]}
    >
      {countdown}
    </Animated.Text>
  );

  const renderAlphaBlitz = () => (
    <>
      <View style={{ position: "absolute", top: 15, alignItems: "center" }}>
        <Animated.View
          style={{
            transform: [{ scale: bounceValue }],
          }}
        >
          <Text style={[styles.promptText, { fontSize: promptFontSize }]}>
            List {selectedCategory}
          </Text>
          <Text style={[styles.promptText, { fontSize: promptFontSize }]}>
            that start with the letter
          </Text>
        </Animated.View>
      </View>
      <View style={{ position: "absolute", bottom: -5, alignItems: "center" }}>
        {mode === GameMode.BLITZ && shouldShowCountdown ? (
          <Animated.Text
            style={[
              styles.promptText,
              {
                opacity: fadeValue,
                transform: [{ scale: scaleValue }],
                ...styles.countdownText,
                ...styles.countdownMarginTop,
                fontSize: goFontSize,
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
              style={[styles.alphaIcon, styles.countdownMarginTop]}
            />
          ) : null
        ) : (
          <Text
            style={[
              styles.promptText,
              styles.countdownText,
              { fontSize: promptFontSize },
            ]}
          >
            ?
          </Text>
        )}
      </View>
    </>
  );

  const containerStyle: ViewStyle = {
    ...styles.container,
    borderColor: playerColor,
    width: promptWidth,
    height: isSmallPhone ? screenHeight * 0.16 : screenHeight * 0.14,
  };

  // Handler for skip button that updates letterIndex if AlphaBlitz
  const handleSkip = () => {
    let newLetter: string | null = null;
    if (isAlphaBlitz && handleSkipPrompt) {
      newLetter = getUniqueRandomLetter();
      DdRum.addAction(CUSTOM_ACTION, "Prompt Skipped", {
        previousLetter: letterIndex,
        newLetter,
        prompt,
        mode,
      });
      setLetterIndex(newLetter);
      iconReadyRef.current = true;
      hasSetLetterRef.current = true;
    } else {
      DdRum.addAction(CUSTOM_ACTION, "Prompt Skipped", {
        previousLetter: letterIndex,
        newLetter: null,
        prompt,
        mode,
      });
    }
    handleSkipPrompt?.();
  };

  return (
    <View style={{ alignItems: "center" }}>
      <View style={containerStyle}>
        {isAlphaBlitz && selectedCategory && !isObscured ? (
          renderAlphaBlitz()
        ) : isAlphaBlitz && isObscured ? (
          shouldShowCountdown ? (
            renderCountdown()
          ) : (
            <Text style={[styles.promptText, { fontSize: promptFontSize }]}>
              List Blitz
            </Text>
          )
        ) : isObscured ? (
          shouldShowCountdown ? (
            renderCountdown()
          ) : (
            <Text style={[styles.promptText, { fontSize: promptFontSize }]}>
              List Blitz
            </Text>
          )
        ) : (
          <View style={styles.promptBubble}>
            <Animated.Text
              style={[
                styles.promptText,
                {
                  transform: [{ scale: bounceValue }],
                  fontSize: promptFontSize,
                },
              ]}
            >
              {selectedCategory ? selectedCategory : prompt}
            </Animated.Text>
          </View>
        )}
      </View>
      {handleSkipPrompt && (
        <SkipButton playerColor={playerColor} onPress={handleSkip} />
      )}
      {categoryBubble && (
        <Image
          source={categoryBubble}
          style={[styles.bubbleImage, { bottom: categoryBubbleBottom }]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#192c43",
    borderRadius: screenWidth * 0.07,
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
    height: screenWidth * 0.2,
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
  countdownText: {
    color: "#FFF",
    fontFamily: "LuckiestGuy",
  },
  countdownMarginTop: {
    marginTop: 20,
  },
  countdownTextSmall: {
    fontSize: 70,
    color: "#fff",
    marginTop: 20,
  },
});
