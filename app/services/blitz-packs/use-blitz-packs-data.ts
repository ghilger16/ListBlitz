import { useQuery, UseQueryResult } from "@tanstack/react-query";
import * as React from "react";
import { BlitzPack } from "../types";
import { getBlitzPacks } from "./blitz-packs-service";

type UseGetBlitzPacks = UseQueryResult<BlitzPack[], unknown>;

export const useGetBlitzPacks = (): UseGetBlitzPacks => {
  const result = useQuery<BlitzPack[], unknown>({
    queryKey: ["blitz-packs"],
    queryFn: getBlitzPacks,
  });

  return result;
};
