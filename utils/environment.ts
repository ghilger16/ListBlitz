export type Environment = "local" | "test" | "prod";

export const getEnvironment = (): Environment => {
  const env = process.env.EXPO_PUBLIC_ENVIRONMENT as Environment | undefined;
  if (!env) {
    console.warn("⚠️ EXPO_PUBLIC_ENVIRONMENT not set, defaulting to local");
    return "local";
  }
  return env;
};

export const isLocalEnvironment = (): boolean => getEnvironment() === "local";
export const isTestEnvironment = (): boolean => getEnvironment() === "test";
export const isProdEnvironment = (): boolean => getEnvironment() === "prod";
