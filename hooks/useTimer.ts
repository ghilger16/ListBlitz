import { useEffect, useState, useRef } from "react";

export const useTimer = (
  isActive: boolean,
  initialTime: number,
  onComplete: () => void
) => {
  const [timer, setTimer] = useState(initialTime);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!isActive) return;

    if (timer === 0) {
      onCompleteRef.current();
      return;
    }

    const timerInterval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [isActive, timer]);

  return [timer, setTimer] as const;
};
