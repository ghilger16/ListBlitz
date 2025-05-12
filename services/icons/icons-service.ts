import { useQuery } from "@tanstack/react-query";
import {
  HotDogIcon,
  IceCreamIcon,
  HeadphoneIcon,
  RocketIcon,
  RobotIcon,
  SunglassesIcon,
  ControllerIcon,
  DinosaurIcon,
  StarIcon,
  SkateboardIcon,
  trophy,
  AIcon,
} from "@Assets";

const iconUrls = [
  RocketIcon,
  DinosaurIcon,
  ControllerIcon,
  IceCreamIcon,
  HeadphoneIcon,
  RobotIcon,
  SunglassesIcon,
  HotDogIcon,
  StarIcon,
  SkateboardIcon,
];

const fetchIcons = async (filterTrophyOnly = false) => {
  return filterTrophyOnly ? [trophy] : iconUrls;
};

export const useGetIcons = (filterTrophyOnly = false) => {
  return useQuery({
    queryKey: ["icons", filterTrophyOnly],
    queryFn: () => fetchIcons(filterTrophyOnly),
    staleTime: 1000 * 60 * 60,
  });
};

export const useGetAlphabetIcons = (index: number) => {
  const alphabetIcons: Record<number, any> = {
    0: AIcon,
  };

  const icon = alphabetIcons[index];

  return {
    icon,
  };
};
