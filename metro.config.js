const { getDefaultConfig } = require("expo/metro-config");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  // Add support for .lottie files
  config.resolver.assetExts.push("lottie");

  return config;
})();
