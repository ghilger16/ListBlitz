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

export const useGetTrophyIcon = () => {
  return useQuery({
    queryKey: ["trophy-icon"],
    queryFn: async () => trophy,
    staleTime: 1000 * 60 * 60,
  });
};

export const useGetPlayerIcons = () => {
  return useQuery({
    queryKey: ["player-icons"],
    queryFn: async () => iconUrls,
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
    Q: QIcon,
    R: RIcon,
    S: SIcon,
    T: TIcon,
    U: UIcon,
    V: VIcon,
    W: WIcon,
    X: XIcon,
    Y: YIcon,
    Z: ZIcon,
  };

  if (!letter) {
    return { icon: undefined };
  }

  return {
    icon: alphabetIcons[letter] ?? undefined,
  };
};
