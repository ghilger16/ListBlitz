module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@Components": "./components",
            "@Services": "./services",
            "@Context": "./context",
            "@Assets": "./assets",
            "@Styles": "./styles",
            "@Hooks": "./hooks",
            "@Utils": "./components/utils",
          },
        },
      ],
    ],
  };
};
