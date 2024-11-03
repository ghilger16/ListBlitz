import { useQuery, UseQueryResult } from "@tanstack/react-query";

import { Prompt } from "../types";
import { getPromptsByBlitzPack } from "./prompt-service";

export const useGetPromptsByBlitzPack = (
  blitzPackId: number,
  limit = 10
): UseQueryResult<Prompt[], Error> => {
  return useQuery<Prompt[], Error>({
    queryKey: ["prompts", blitzPackId],
    queryFn: () => getPromptsByBlitzPack(blitzPackId, limit),
    refetchOnWindowFocus: false,
  });
};
