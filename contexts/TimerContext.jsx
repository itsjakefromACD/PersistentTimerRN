import { createContext, useContext } from "react";

import { useTimer as useTimerLogic } from "@/hooks/useTimer";

const TimerContext = createContext(null);

export function TimerProvider({ children }) {
  const value = useTimerLogic();
  return (
    <TimerContext.Provider value={value}>{children}</TimerContext.Provider>
  );
}

export function useTimerContext() {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error("useTimerContext must be used within a TimerProvider");
  }
  return context;
}

/** Alias for consumers - use this in components */
export const useTimer = useTimerContext;
