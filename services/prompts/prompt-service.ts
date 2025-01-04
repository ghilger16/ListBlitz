// services/prompt-service.ts
import axios from "axios";
import { Prompt } from "../types";
import { BASE_URL } from "../constants";

export const getPromptsByBlitzPack = async (
  blitzPackId: number,
  limit = 10
): Promise<Prompt[]> => {
  try {
    const response = await axios.get<Prompt[]>(`${BASE_URL}/prompts`, {
      params: { blitzPackId, limit },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching prompts:", error);
    throw new Error("Failed to fetch prompts");
  }
};
