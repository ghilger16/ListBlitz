import { useState } from "react";

export const useAlphaCategory = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isShuffleActive, setIsShuffleActive] = useState(false);

  const categories = [
    "Animals",
    "Foods",
    "Occupations",
    "Countries",
    "Movies",
    "Famous People",
  ];

  const handleSelectCategory = (category: string) => {
    setIsShuffleActive(false);
    setSelectedCategory(category);
  };

  const handlePickRandom = () => {
    const random = categories[Math.floor(Math.random() * categories.length)];
    setIsShuffleActive(true);
    setSelectedCategory(random);
  };

  return {
    selectedCategory,
    setSelectedCategory,
    isShuffleActive,
    setIsShuffleActive,
    handleSelectCategory,
    handlePickRandom,
  };
};
