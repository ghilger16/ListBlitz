import { Platform } from "react-native";
import Constants from "expo-constants";

export const BASE_URL =
  Platform.OS === "web" || !Constants.executionEnvironment
    ? "http://localhost:8080/api" // Web or unknown environment
    : "http://192.168.0.104:8080/api"; // Mobile (iOS or Android)

// "http://10.0.0.82:8080/api";  Mobile (iOS or Android) Spink House
