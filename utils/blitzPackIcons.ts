import { ImageSourcePropType } from "react-native";

export const blitzPackIcons: Record<
  string,
  {
    icon: ImageSourcePropType;
    titleImage?: ImageSourcePropType;
    category: string;
  }
> = {
  "Category Chaos": {
    icon: require("@Assets/icons/category-chaos.png"),
    titleImage: require("@Assets/icons/category-chaos-title.png"),
    category: "Family & Kids",
  },
  "Snack Attack": {
    icon: require("@Assets/icons/snack-attack.png"),
    titleImage: require("@Assets/icons/snack-attack-title.png"),
    category: "Family & Kids",
  },
  "Alpha Blitz": {
    icon: require("@Assets/icons/alpha-blitz.png"),
    titleImage: require("@Assets/icons/alpha-blitz-title.png"),
    category: "Family & Kids",
  },
  "Big Screen Blitz": {
    icon: require("@Assets/icons/big-screen-blitz.png"),
    titleImage: require("@Assets/icons/big-screen-blitz-title.png"),
    category: "Entertainment",
  },
  "The Thing Is": {
    icon: require("@Assets/icons/the-thing-is.png"),
    titleImage: require("@Assets/icons/the-thing-is-title.png"),
    category: "Family & Kids",
  },
  "Music Mania": {
    icon: require("@Assets/icons/music-mania.png"),
    titleImage: require("@Assets/icons/music-mania-title.png"),
    category: "Entertainment",
  },
};
