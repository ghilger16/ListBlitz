import { useWindowDimensions } from "react-native";

export const useScreenInfo = () => {
  const { width, height } = useWindowDimensions();

  const aspectRatio = height / width;

  // Small phone example: iPhone SE / 12 mini
  const isSmallPhone = width < 380;

  // Tablet detection using size and aspect ratio
  const isTablet = width >= 768 && height >= 768 && aspectRatio < 1.6;

  return {
    width,
    height,
    isSmallPhone,
    isTablet,
    aspectRatio,
  };
};
