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
  BIcon,
  CIcon,
  DIcon,
  EIcon,
  FIcon,
  GIcon,
  HIcon,
  IIcon,
  JIcon,
  KIcon,
  LIcon,
  MIcon,
  NIcon,
  OIcon,
  PIcon,
  QIcon,
  RIcon,
  SIcon,
  TIcon,
  UIcon,
  VIcon,
  WIcon,
  XIcon,
  YIcon,
  ZIcon,
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

export const useGetAlphabetIcons = (letter: string | null) => {
  const alphabetIcons: Record<string, any> = {
    A: AIcon,
    B: BIcon,
    C: CIcon,
    D: DIcon,
    E: EIcon,
    F: FIcon,
    G: GIcon,
    H: HIcon,
    I: IIcon,
    J: JIcon,
    K: KIcon,
    L: LIcon,
    M: MIcon,
    N: NIcon,
    O: OIcon,
    P: PIcon,
    R: RIcon,
    S: SIcon,
    T: TIcon,
    U: UIcon,
    W: WIcon,
    Y: YIcon,
  };
  if (!letter || !(letter in alphabetIcons)) {
    return { icon: null };
  }

  return {
    icon: alphabetIcons[letter],
  };
};
