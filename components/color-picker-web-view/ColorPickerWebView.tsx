import React, { useRef, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

function getHtmlContent(selectedColor: string) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body {
      margin: 0;
      padding: 0;
      background: black;
      --current-color: ${selectedColor};
      background-image: radial-gradient(
        circle,
        var(--current-color) 10%,
        transparent 10%
      );
      background-size: 20px 20px;
    
    }

    #background {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: radial-gradient(
        circle,
        var(--current-color) 10%,
        transparent 10%
      );
      background-size: 20px 20px;
    }
  </style>
</head>
<body>
  <div id="background"></div>
</body>
</html>
`;
}

export default function ColorPickerWebView({ selectedColor = "#0d63f8" }) {
  const webViewRef = useRef<WebView>(null);

  useEffect(() => {
    const escapedColor = selectedColor.replace(/"/g, '\\"');
    const injected = `
      (async () => {
        const { animateView } = await import("https://cdn.jsdelivr.net/npm/motion-dom@12.11.0/+esm");
        document.body.style.setProperty("--current-color", "${escapedColor}");
        const el = document.getElementById("background");
        if (!el) return;
        animateView(el, {
          duration: 0.4,
          ease: [0.28, 0.02, 0.1, 0.99],
        }).new(
          {
            clipPath: [
              "circle(0% at 50% 50%)",
              "circle(100% at 50% 50%)"
            ]
          },
          { duration: 0.6, ease: "easeIn" }
        );
      })();
    `;
    webViewRef.current?.injectJavaScript(injected);
  }, [selectedColor]);

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        originWhitelist={["*"]}
        source={{ html: getHtmlContent(selectedColor) }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
