import { bigScreenBlitzPrompts } from "./prompts/big-screen-blitz";
import { snackAttackPrompts } from "./prompts/snack-attack";
import { categoryChaosPrompts } from "./prompts/category-chaos";
import { theThingIsPrompts } from "./prompts/the-thing-is";

export const LIST_PROMPTS_BY_PACK = {
  big_screen_blitz: bigScreenBlitzPrompts,
  snack_attack: snackAttackPrompts,
  category_chaos: categoryChaosPrompts,
  the_thing_is: theThingIsPrompts,
};
export const BLITZ_TITLE_TO_KEY_MAP: Record<
  string,
  keyof typeof LIST_PROMPTS_BY_PACK
> = {
  "Big Screen Blitz": "big_screen_blitz",
  "Snack Attack": "snack_attack",
  "Category Chaos": "category_chaos",
  "The Thing Is": "the_thing_is",
};
