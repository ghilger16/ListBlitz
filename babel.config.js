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
            "@Assets": "./assets",
            "@Components": "./components",
            "@Context": "./context",
            "@Data": "./data",
            "@Hooks": "./hooks",
            "@Types": "./types",
            "@Utils": "./utils",
          },
        },
      ],
    ],
  };
};
