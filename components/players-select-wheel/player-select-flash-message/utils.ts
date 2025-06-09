export const getEasterEggMessage = (
  playersData: { id: number; iconIndex: number }[]
): string | null => {
  const johnPaulPlayers = [
    { id: 1, iconIndex: 8 },
    { id: 2, iconIndex: 3 },
    { id: 3, iconIndex: 0 },
    { id: 4, iconIndex: 5 },
  ];
  const audreyPlayers = [
    { id: 1, iconIndex: 9 },
    { id: 2, iconIndex: 4 },
    { id: 3, iconIndex: 1 },
    { id: 4, iconIndex: 6 },
  ];
  const ameliaPlayers = [
    { id: 1, iconIndex: 8 },
    { id: 2, iconIndex: 3 },
    { id: 3, iconIndex: 2 },
    { id: 4, iconIndex: 7 },
  ];

  const isMatch = (target: { id: number; iconIndex: number }[]): boolean =>
    playersData.length === target.length &&
    playersData.every(
      (p, idx) =>
        p.id === target[idx].id && p.iconIndex === target[idx].iconIndex
    );

  if (isMatch(johnPaulPlayers)) {
    return "😎 Hi John Paul 😎";
  } else if (isMatch(audreyPlayers)) {
    return "🌟 Hi Audrey 🌟";
  } else if (isMatch(ameliaPlayers)) {
    return "💖 Hi Amelia 💖";
  }
  return null;
};
