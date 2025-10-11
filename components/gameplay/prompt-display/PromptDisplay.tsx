import React, { useState, useEffect, useRef } from "react";
import { DdRum, RumActionType } from "@datadog/mobile-react-native";
import {
  View,
  Animated,
  Text,
  StyleSheet,
  Image,
  ImageSourcePropType,
  Dimensions,
} from "react-native";

import LottieView from "lottie-react-native";

import { countdownSound } from "@Assets";
import { alphabetIcons, GameMode } from "@Context";
import { usePromptAnimations, useResponsiveStyles } from "@Hooks";
import { playSound } from "@Utils";
import { getUniqueRandomLetter } from "./utils";

const CUSTOM_ACTION = RumActionType.CUSTOM;

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

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
  skipSignal?: number;
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
  skipSignal,
}) => {
  const styles = useResponsiveStyles(BASE_STYLES, (device) => {
    const fs = (base: number) => {
      if (device.isLargeTablet) return Math.round(base * 1.85);
      if (device.isTablet) return Math.round(base * 1.4);
      if (device.isLargePhone) return Math.round(base * 1.1);
      if (device.isSmallPhone) return Math.round(base * 0.75);
      return base;
    };

    const promptWidth = device.isLargeTablet
      ? Math.min(screenWidth * 0.92, 820)
      : device.isTablet
      ? Math.min(screenWidth * 0.9, 700)
      : device.isLargePhone
      ? Math.min(screenWidth * 0.92, 450)
      : device.isSmallPhone
      ? Math.min(screenWidth * 0.9, 360)
      : Math.min(screenWidth * 0.92, 500);

    const containerHeight = device.isLargeTablet
      ? screenHeight * 0.15
      : device.isTablet
      ? screenHeight * 0.14
      : device.isLargePhone
      ? screenHeight * 0.12
      : device.isSmallPhone
      ? screenHeight * 0.13
      : screenHeight * 0.12;

    const bubbleBottom = device.isLargeTablet
      ? screenHeight * 0.12
      : device.isTablet
      ? screenHeight * 0.11
      : device.isLargePhone
      ? screenHeight * 0.105
      : device.isSmallPhone
      ? screenHeight * 0.1
      : screenHeight * 0.09;

    // const goSize = device.isLargeTablet
    //   ? 120
    //   : device.isTablet
    //   ? 100
    //   : device.isSmallPhone
    //   ? 55
    //   : 75;

    const alphaW = device.isLargeTablet
      ? 90
      : device.isTablet
      ? 70
      : device.isLargePhone
      ? 65
      : 55;
    const alphaH = device.isLargeTablet
      ? 85
      : device.isTablet
      ? 65
      : device.isLargePhone
      ? 35
      : device.isSmallPhone
      ? 30
      : 60;

    const borderWidth = device.isLargeTablet
      ? 10
      : device.isTablet
      ? 8
      : device.isLargePhone
      ? 6
      : device.isSmallPhone
      ? 4
      : 5;

    return {
      container: {
        width: promptWidth,
        height: containerHeight,
        borderWidth,
      },
      promptText: { fontSize: fs(28) },
      countdownText: { fontSize: fs(50) },
      alphaText: { fontSize: fs(20) },
      bubbleImage: { bottom: bubbleBottom },
      alphaIcon: { width: alphaW, height: alphaH },
    } as const;
  });

  const { bounceValue, fadeValue, scaleValue } = usePromptAnimations(
    countdown ?? null,
    prompt
  );
  const [hasPlayedSound, setHasPlayedSound] = useState(false);

  const [letterIndex, setLetterIndex] = useState<string | null>(null);
  const hasSetLetterRef = useRef(false);
  const iconReadyRef = useRef(false);
  const lastSkipSignalRef = useRef<number | undefined>(undefined);
  useEffect(() => {
    if (skipSignal !== undefined && skipSignal !== lastSkipSignalRef.current) {
      lastSkipSignalRef.current = skipSignal;
      handleSkip();
    }
  }, [skipSignal]);

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
        styles.countdownText,
        {
          opacity: fadeValue,
          transform: [{ scale: scaleValue }],
        },
      ]}
    >
      {countdown}
    </Animated.Text>
  );

  const renderAlphaBlitz = () => (
    <View style={{ alignItems: "center" }}>
      <Animated.View style={{ transform: [{ scale: bounceValue }] }}>
        <Text style={styles.alphaText}>List {selectedCategory}</Text>
        <Text style={styles.alphaText}>that start with the letter</Text>
      </Animated.View>

      {mode === GameMode.BLITZ && shouldShowCountdown ? (
        <Animated.Text
          style={[
            styles.promptText,
            styles.countdownText,
            { opacity: fadeValue, transform: [{ scale: scaleValue }] },
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
            style={[styles.alphaIcon]}
          />
        ) : null
      ) : (
        <Text style={[styles.alphaText, styles.countdownText]}>?</Text>
      )}
    </View>
  );

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
      <View style={[styles.container, { borderColor: playerColor }]}>
        <View style={styles.inner}>
          <View style={styles.contentSlot}>
            {isAlphaBlitz && selectedCategory && !isObscured ? (
              renderAlphaBlitz()
            ) : isAlphaBlitz && isObscured ? (
              shouldShowCountdown ? (
                renderCountdown()
              ) : (
                <Text style={styles.promptText}>List Blitz</Text>
              )
            ) : isObscured ? (
              shouldShowCountdown ? (
                renderCountdown()
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
        </View>
      </View>

      {categoryBubble && (
        <Image source={categoryBubble} style={styles.bubbleImage} />
      )}
    </View>
  );
};

const BASE_STYLES = StyleSheet.create({
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
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    flexWrap: "wrap",
    textAlign: "center",
  },
  alphaText: {
    fontFamily: "LuckiestGuy",
    fontWeight: "bold",
    color: "#ffffff",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    flexWrap: "wrap",
    textAlign: "center",
    marginTop: 5,
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
  inner: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 5,
  },
  contentSlot: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 0,
    flexShrink: 1,
  },
});
