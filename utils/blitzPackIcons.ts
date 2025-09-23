import { ImageSourcePropType } from "react-native";

export const blitzPackIcons: Record<
  string,
  {
    icon: ImageSourcePropType;
    titleImage?: ImageSourcePropType;
    category: string;
    productId?: string; // 👈 add this optional field
  }
> = {
  "Category Chaos": {
    icon: require("@Assets/icons/category-chaos.png"),
    titleImage: require("@Assets/icons/category-chaos-title.png"),
    category: "General Knowledge",
    // free pack, no productId
  },
  "Snack Attack": {
    icon: require("@Assets/icons/snack-attack.png"),
    titleImage: require("@Assets/icons/snack-attack-title.png"),
    category: "Family & Kids",
    productId: "pack_snack_attack_ios", // 👈 tie to your store/RevenueCat product
  },
  "Alpha Blitz": {
    icon: require("@Assets/icons/alpha-blitz.png"),
    titleImage: require("@Assets/icons/alpha-blitz-title.png"),
    category: "Family & Kids",
    // free pack
  },
  "Big Screen Blitz": {
    icon: require("@Assets/icons/big-screen-blitz.png"),
    titleImage: require("@Assets/icons/big-screen-blitz-title.png"),
    category: "Entertainment",
    productId: "pack_big_screen_blitz_ios",
  },
  "The Thing Is": {
    icon: require("@Assets/icons/the-thing-is.png"),
    titleImage: require("@Assets/icons/the-thing-is-title.png"),
    category: "Family & Kids",
    productId: "pack_the_thing_is_ios",
  },
  "Music Mania": {
    icon: require("@Assets/icons/music-mania.png"),
    titleImage: require("@Assets/icons/music-mania-title.png"),
    category: "Entertainment",
    productId: "pack_music_mania_ios",
  },
};
