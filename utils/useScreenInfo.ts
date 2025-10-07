import { useWindowDimensions } from "react-native";

export const useScreenInfo = () => {
  const { width, height } = useWindowDimensions();

  const aspectRatio = height / width;

  const isSmallPhone = width < 380;
  const isPhone = width >= 380 && width < 420;
  const isLargePhone = width >= 420 && width < 768;
  const isTablet = width >= 768 && width < 1000;
  const isLargeTablet = width >= 1000;

  const device = {
    isSmallPhone,
    isPhone,
    isLargePhone,
    isTablet,
    isLargeTablet,
  };

  return {
    width,
    height,
    aspectRatio,
    device,
    // Backwards-compatible flags (deprecated):
    isSmallPhone,
    isPhone,
    isLargePhone,
    isTablet,
    isLargeTablet,
  } as const;
};
