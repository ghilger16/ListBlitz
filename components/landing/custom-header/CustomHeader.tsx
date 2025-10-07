import React from "react";
import { View, Image } from "react-native";

import { useResponsiveStyles } from "@Hooks";

const CustomHeader: React.FC = () => {
  const styles = useResponsiveStyles(BASE_STYLES, (device) => {
    const headerHeight = device.isLargeTablet
      ? 450
      : device.isTablet
      ? 400
      : device.isLargePhone
      ? 240
      : device.isSmallPhone
      ? 185
      : 220;

    return {
      headerContainer: { height: headerHeight },
      headerImage: { height: headerHeight },
    };
  });

  return (
    <View style={styles.headerContainer} pointerEvents="none">
      <Image
        source={require("@Assets/gifs/header.gif")}
        style={styles.headerImage}
      />
    </View>
  );
};

const BASE_STYLES = {
  headerContainer: {
    position: "absolute",
    top: 0,
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
    zIndex: 2,
  },
  headerImage: {
    position: "absolute",
    width: "100%",
    resizeMode: "cover" as const,
  },
} as const;

export default CustomHeader;
