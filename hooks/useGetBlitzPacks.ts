import { useMemo } from "react";
import { IBlitzPack } from "../types";

export const BLITZ_PACKS: IBlitzPack[] = [
  { id: 1, title: "Category Chaos", key: "category_chaos" },
  { id: 2, title: "The Thing Is", key: "the_thing_is" },
  { id: 3, title: "Alpha Blitz", key: "alpha_blitz" },
  { id: 4, title: "Snack Attack", key: "snack_attack" },
  { id: 5, title: "Big Screen Blitz", key: "big_screen_blitz" },
  { id: 6, title: "Music Mania", key: "music_mania" },
];
export const useGetBlitzPacks = (): {
  data: IBlitzPack[];
  isLoading: boolean;
  error: null;
} => {
  const data = useMemo(() => BLITZ_PACKS, []);
  return { data, isLoading: false, error: null };
};
