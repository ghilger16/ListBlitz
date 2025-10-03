import { bigScreenBlitzPrompts } from "./prompts/big-screen-blitz";
import { snackAttackPrompts } from "./prompts/snack-attack";
import { categoryChaosPrompts } from "./prompts/category-chaos";
import { theThingIsPrompts } from "./prompts/the-thing-is";
import { musicManiaPrompts } from "./prompts/music-mania";

export const LIST_PROMPTS_BY_PACK = {
  big_screen_blitz: bigScreenBlitzPrompts,
  snack_attack: snackAttackPrompts,
  category_chaos: categoryChaosPrompts,
  the_thing_is: theThingIsPrompts,
  music_mania: musicManiaPrompts,
};
export const BLITZ_TITLE_TO_KEY_MAP: Record<
  string,
  keyof typeof LIST_PROMPTS_BY_PACK
> = {
  "Big Screen Blitz": "big_screen_blitz",
  "Snack Attack": "snack_attack",
  "Category Chaos": "category_chaos",
  "The Thing Is": "the_thing_is",
  "Music Mania": "music_mania",
};

export const SAMPLE_PROMPTS: Record<string, string[]> = {
  big_screen_blitz: [
    "List movies from the 80s",
    "List movies with a number in the title",
    "List movies with a dragon",
    "List Christmas movies",
    "List movies based on books",
  ],
  category_chaos: [
    "List fast food chains",
    "List cartoon characters",
    "List NFL teams",
    "List U.S. presidents",
    "List shoe brands",
  ],
  music_mania: [
    "List famous bands from the 70s",
    "List one-hit wonders",
    "List songs with a color in the title",
    "List boy bands",
    "List songs by Michael Jackson",
  ],
};
