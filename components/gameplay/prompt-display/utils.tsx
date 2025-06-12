export const ALL_LETTERS = "ABCDEFGHIJKLMNOPRSTUWY"; // Excludes Q, V, X, Z
export const usedLetters = new Set<string>();

export function getUniqueRandomLetter(): string {
  const availableLetters = ALL_LETTERS.split("").filter(
    (l) => !usedLetters.has(l)
  );
  if (availableLetters.length === 0) {
    usedLetters.clear();
    return getUniqueRandomLetter();
  }
  const index = Math.floor(Math.random() * availableLetters.length);
  const letter = availableLetters[index];
  usedLetters.add(letter);
  return letter;
}

export function resetUsedLetters(): void {
  usedLetters.clear();
}
