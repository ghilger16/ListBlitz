import { useState, useEffect } from "react";

import { BLITZ_TITLE_TO_KEY_MAP, LIST_PROMPTS_BY_PACK } from "@Data";

const shuffleArray = (array: string[]): string[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const useGetPromptsByBlitzPack = (blitzPackTitle: string): string[] => {
  const [prompts, setPrompts] = useState<string[]>([]);

  useEffect(() => {
    const packKey = BLITZ_TITLE_TO_KEY_MAP[
      blitzPackTitle
    ] as keyof typeof LIST_PROMPTS_BY_PACK;
    const fetchedPrompts = LIST_PROMPTS_BY_PACK[packKey] || [];

    const shuffledPrompts = shuffleArray(fetchedPrompts);
    setPrompts(shuffledPrompts);
  }, [blitzPackTitle]);

  return prompts;
};
