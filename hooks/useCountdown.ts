import { useEffect, useState } from "react";

export const useCountdown = (
  isActive: boolean,
  initialCount: number,
  onComplete: () => void
) => {
  const [countdown, setCountdown] = useState(initialCount);

  useEffect(() => {
    if (!isActive) return;

    if (countdown === 0) {
      onComplete();
      return;
    }

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [isActive, countdown, onComplete]);

  return [countdown, setCountdown] as const;
};
