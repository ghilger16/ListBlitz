import axios from "axios";
import { IBlitzPack } from "../types";
import { BASE_URL } from "../constants";

export const getBlitzPacks = async (): Promise<IBlitzPack[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/blitz-packs`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching categories");
  }
};
