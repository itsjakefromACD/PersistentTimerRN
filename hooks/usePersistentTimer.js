import { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";

import {
  clearStartTime,
  getFormattedElapsedTime,
  recordStartTime,
} from "@/utils/timer";

export function usePersistentTimer() {
  const [formattedLabel, setFormattedLabel] = useState("00:00:00");
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const appStateRef = useRef(AppState.currentState);

  const refreshLabel = async () => {
    const label = await getFormattedElapsedTime();
    setFormattedLabel(label);
  };

  const start = async () => {
    await recordStartTime();
    setIsRunning(true);
  };

  const stop = async () => {
    await clearStartTime();
    setIsRunning(false);
    setFormattedLabel("00:00:00");
  };

  useEffect(() => {
    if (!isRunning) return;

    refreshLabel();
    intervalRef.current = setInterval(refreshLabel, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        refreshLabel();
      }
      appStateRef.current = nextAppState;
    });
    return () => subscription.remove();
  }, []);

  return { formattedLabel, isRunning, start, stop };
}
