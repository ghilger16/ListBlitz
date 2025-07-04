// /app/utils/datadog.ts

import {
  DatadogProviderConfiguration,
  SdkVerbosity,
  UploadFrequency,
  BatchSize,
  DdSdkReactNative,
} from "@datadog/mobile-react-native";
import * as Application from "expo-application";

// ─── Datadog SDK Configuration ─────────────────────────────────────────────
export const ddConfig = new DatadogProviderConfiguration(
  "pubd96d7340e81f708cc587037b31fb3d9e", // Client Token
  "production", // Environment
  "ee9183a7-804e-45e4-adf1-14c7a029be54", // Application ID
  true, // track user interactions
  true, // track network XHR/fetch
  true // track JS errors
);
ddConfig.site = "US5";
ddConfig.sessionSamplingRate = 100;
ddConfig.longTaskThresholdMs = 100;
ddConfig.nativeCrashReportEnabled = true;
if (__DEV__) {
  ddConfig.uploadFrequency = UploadFrequency.FREQUENT;
  ddConfig.batchSize = BatchSize.SMALL;
  ddConfig.verbosity = SdkVerbosity.DEBUG;
}

export async function identifyDatadogUser() {
  try {
    const installTime = await Application.getInstallationTimeAsync();
    const installId = installTime?.toISOString() || new Date().toISOString();
    await DdSdkReactNative.setUser({ id: installId });
  } catch (error) {
    console.error("Error setting Datadog user ID:", error);
  }
}
