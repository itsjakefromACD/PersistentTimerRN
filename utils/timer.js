import AsyncStorage from "@react-native-async-storage/async-storage";
import { differenceInSeconds } from "date-fns";

const recordStartTime = async () => {
  try {
    const now = new Date();
    await AsyncStorage.setItem("@start_time", now.toISOString());
  } catch (error) {
    console.warn(error);
  }
};

const clearStartTime = async () => {
  try {
    await AsyncStorage.removeItem("@start_time");
  } catch (error) {
    console.warn(error);
  }
};

const getElapsedTime = async () => {
  try {
    const startTime = await AsyncStorage.getItem("@start_time");
    const now = new Date();
    return differenceInSeconds(now, Date.parse(startTime));
  } catch (error) {
    console.warn(error);
    return 0;
  }
};

const formatDuration = (totalSeconds) => {
  if (totalSeconds == null || totalSeconds < 0) return "00:00:00";

  const seconds = Math.floor(totalSeconds);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(secs).padStart(2, "0")}`;
};

const getFormattedElapsedTime = async () => {
  const seconds = await getElapsedTime();
  return formatDuration(seconds);
};

export {
  clearStartTime,
  formatDuration,
  getElapsedTime,
  getFormattedElapsedTime,
  recordStartTime,
};
