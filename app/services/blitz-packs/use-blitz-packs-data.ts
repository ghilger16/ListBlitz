import { useQuery, UseQueryResult } from "@tanstack/react-query";
import * as React from "react";
import { IBlitzPack } from "../types";
import { getBlitzPacks } from "./blitz-packs-service";

type UseGetBlitzPacks = UseQueryResult<IBlitzPack[], unknown>;

export const useGetBlitzPacks = (): UseGetBlitzPacks => {
  const result = useQuery<IBlitzPack[], unknown>({
    queryKey: ["blitz-packs"],
    queryFn: getBlitzPacks,
  });

  return result;
};
