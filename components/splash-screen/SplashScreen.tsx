import React, { useEffect, useRef } from "react";
import { View, Image, StyleSheet, Dimensions, Animated } from "react-native";

interface SplashScreenProps {
  backgroundPath: string;
  isReady: boolean;
  onFinish: () => void;
  minDisplayTime?: number;
}

const { width, height } = Dimensions.get("window");

const AnimatedImageBackground = Animated.createAnimatedComponent(Image);

const imageMap: Record<string, any> = {
  landing: require("assets/images/landing-splash.png"),
  blitz: require("assets/images/blitz-splash.png"),
  chill: require("assets/images/chill-splash.png"),
  // battle: require("assets/images/battle-bg.png"),
};

const SplashScreen: React.FC<SplashScreenProps> = ({
  backgroundPath,
  isReady,
  onFinish,
  minDisplayTime = 3000, // default to 1.5 seconds
}) => {
  const imageSource = imageMap[backgroundPath];
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isReady) {
      timeout = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }).start(() => {
          onFinish();
        });
      }, minDisplayTime);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isReady]);

  if (!imageSource) {
    console.warn(`No image found for backgroundPath: ${backgroundPath}`);
    return null;
  }

  return (
    <View style={styles.overlay}>
      <AnimatedImageBackground
        source={imageSource}
        style={[styles.image, { opacity: fadeAnim }]}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width,
    height,
    zIndex: 999,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default SplashScreen;
