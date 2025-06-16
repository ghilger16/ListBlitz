import { ImageSourcePropType } from "react-native";

export const blitzPackIcons: Record<
  string,
  { icon: ImageSourcePropType; titleImage?: ImageSourcePropType }
> = {
  "Category Chaos": {
    icon: require("@Assets/icons/category-chaos.png"),
    titleImage: require("@Assets/icons/category-chaos-title.png"),
  },
  "Snack Attack": {
    icon: require("@Assets/icons/snack-attack.png"),
    titleImage: require("@Assets/icons/snack-attack-title.png"),
  },
  "Alpha Blitz": {
    icon: require("@Assets/icons/alpha-blitz.png"),
    titleImage: require("@Assets/icons/alpha-blitz-title.png"),
  },
  "Big Screen Blitz": {
    icon: require("@Assets/icons/big-screen-blitz.png"),
    titleImage: require("@Assets/icons/big-screen-blitz-title.png"),
  },
  "The Thing Is": {
    icon: require("@Assets/icons/the-thing-is.png"),
    titleImage: require("@Assets/icons/the-thing-is-title.png"),
  },
  "Music Mania": {
    icon: require("@Assets/icons/music-mania.png"),
    titleImage: require("@Assets/icons/music-mania-title.png"),
  },
};
