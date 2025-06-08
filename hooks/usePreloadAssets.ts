import { useEffect, useState } from "react";
import { Asset } from "expo-asset";

export function usePreloadAssets(assets: any[]) {
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        await Asset.loadAsync(assets);
        setAssetsLoaded(true);
      } catch (error) {
        console.error("Error loading assets:", error);
      }
    }
    load();
  }, [assets]);

  return assetsLoaded;
}
