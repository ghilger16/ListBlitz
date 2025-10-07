import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useScreenInfo } from "../utils/useScreenInfo";

/**
 * Scales a base font size using your device buckets.
 */
export const scaleFont = (
  device: ReturnType<typeof useScreenInfo>["device"],
  base: number
) => {
  if (device.isLargeTablet) return Math.round(base * 1.3);
  if (device.isTablet) return Math.round(base * 1.15);
  if (device.isLargePhone) return Math.round(base * 1.05);
  if (device.isSmallPhone) return Math.round(base * 0.9);
  return base;
};

/**
 * Merge base styles with dynamic, device-aware overrides and return
 * a single StyleSheet object for use directly in JSX.
 *
 * You may include NEW style keys in the dynamic creator that are not
 * present in BASE_STYLES. The merged result is typed as `T & U`.
 *
 * Usage:
 * const styles = useResponsiveStyles(BASE_STYLES, (device) => ({
 *   headerLeftContainer: { marginTop: device.isTablet ? 14 : 6 },
 *   headerTitle: { fontSize: scaleFont(device, 22) },
 * }));
 */
export const useResponsiveStyles = <
  T extends Record<string, any>,
  U extends Record<string, any> = {}
>(
  baseStyles: T,
  createDynamicStyles?: (
    device: ReturnType<typeof useScreenInfo>["device"]
  ) => U
) => {
  const { device } = useScreenInfo();

  const styles = useMemo(() => {
    const dynamic = (createDynamicStyles?.(device) || ({} as U)) as U;

    // Start with shallow merge so brand new keys are included
    const merged: Record<string, any> = {
      ...(baseStyles as any),
      ...(dynamic as any),
    };

    // For keys present on both, deep-merge style objects
    for (const key in dynamic as Record<string, any>) {
      const baseVal = (baseStyles as any)[key];
      const dynVal = (dynamic as any)[key];

      if (
        baseVal &&
        typeof baseVal === "object" &&
        !Array.isArray(baseVal) &&
        dynVal &&
        typeof dynVal === "object" &&
        !Array.isArray(dynVal)
      ) {
        merged[key] = { ...baseVal, ...dynVal };
      } else if (Array.isArray(baseVal) || Array.isArray(dynVal)) {
        const baseArr = Array.isArray(baseVal)
          ? baseVal
          : baseVal
          ? [baseVal]
          : [];
        const dynArr = Array.isArray(dynVal) ? dynVal : dynVal ? [dynVal] : [];
        merged[key] = [...baseArr, ...dynArr];
      } else {
        merged[key] = dynVal ?? baseVal;
      }
    }

    return StyleSheet.create(merged) as T & U;
  }, [device, baseStyles, createDynamicStyles]);

  return styles as T & U;
};
