import { useEffect, useMemo, useState } from "react";
import { Asset } from "expo-asset";
import { allAssets, blitzPackIcons } from "@Utils";

/**
 * Preload (and decode) all images used on Landing before rendering it.
 * Returns true when assets are ready. Fails open (true) if an error occurs
 * so the app never hangs at splash.
 */
export function useAssetsReady() {
  const [ready, setReady] = useState(false);

  // Static art you always show around landing / splash
  const staticAssets = useMemo(() => allAssets, []);

  // Collect pack icons & titles from the central map so new packs auto-preload
  const packAssets = useMemo(() => {
    const set = new Set<number>();
    try {
      const values = Object.values(blitzPackIcons || {});
      for (const { icon, titleImage } of values as any[]) {
        if (typeof icon === "number") set.add(icon);
        if (typeof titleImage === "number") set.add(titleImage as number);
      }
    } catch (e) {
      if (__DEV__)
        console.warn("[useAssetsReady] blitzPackIcons unavailable", e);
    }
    return Array.from(set);
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const all: number[] = [...staticAssets, ...packAssets];
        if (all.length) {
          // Load in two waves so one failure doesn't block everything
          const mid = Math.ceil(all.length / 2);
          await Asset.loadAsync(all.slice(0, mid));
          await Asset.loadAsync(all.slice(mid));
        }
      } catch (e) {
        console.warn("[useAssetsReady] preload error", e);
      } finally {
        if (mounted) setReady(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [staticAssets, packAssets]);

  return ready;
}
