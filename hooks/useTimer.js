import { useCallback, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";

import {
  clearStartTime,
  getFormattedElapsedTime,
  hasStartTime,
  recordStartTime,
} from "@/utils/timer";

/**
 * Hook containing all timer logic: state, persistence, interval, and AppState handling.
 * Used by TimerProvider to supply shared timer state via context.
 */
export function useTimer() {
  const [formattedTimeLabel, setFormattedTimeLabel] = useState("00:00:00");
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const appStateRef = useRef(AppState.currentState);

  const refreshLabel = useCallback(async () => {
    const label = await getFormattedElapsedTime();
    setFormattedTimeLabel(label);
  }, []);

  const start = useCallback(async () => {
    await recordStartTime();
    setIsRunning(true);
  }, []);

  const stop = useCallback(async () => {
    await clearStartTime();
    setIsRunning(false);
    setFormattedTimeLabel("00:00:00");
  }, []);

  useEffect(() => {
    const initTimer = async () => {
      const stored = await hasStartTime();
      if (stored) setIsRunning(true);
    };
    initTimer();
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    refreshLabel();
    intervalRef.current = setInterval(refreshLabel, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, refreshLabel]);

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
  }, [refreshLabel]);

  return { formattedTimeLabel, isRunning, start, stop };
}
