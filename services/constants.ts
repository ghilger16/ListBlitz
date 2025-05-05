import { Platform } from "react-native";
import Constants from "expo-constants";
// ✅ Use your real machine IP for mobile access
const LOCAL_NETWORK_IP = "http://192.168.0.111:8080/api";

export const BASE_URL =
  Platform.OS === "web" || !Constants.executionEnvironment
    ? "http://localhost:8080/api"
    : LOCAL_NETWORK_IP;
