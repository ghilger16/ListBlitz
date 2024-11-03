import axios from "axios";
import { BlitzPack } from "../types";
import { BASE_URL } from "../constants";

export const getBlitzPacks = async (): Promise<BlitzPack[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/blitz-packs`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching categories");
  }
};
