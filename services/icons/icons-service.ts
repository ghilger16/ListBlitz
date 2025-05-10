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

const fetchIcons = async () => {
  return iconUrls;
};

export const useGetIcons = () => {
  return useQuery({
    queryKey: ["icons"],
    queryFn: fetchIcons,
    staleTime: 1000 * 60 * 60,
  });
};
