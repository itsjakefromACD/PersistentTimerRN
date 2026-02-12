# PersistentTimer

An example Expo app demonstrating a **PersistentTimer** that keeps running when the app goes into the background and correctly resumes when the app is launched again.

This project was created with [`npx create-expo-app@latest`](https://www.npmjs.com/package/create-expo-app).

## Background & relaunch behavior

The timer is designed to survive:

- **Backgrounding** — When you leave the app (home button, app switch, or lock screen), the timer continues to count based on elapsed time.
- **Relaunch** — When you open the app again, the timer shows the correct remaining or elapsed time instead of resetting.
- **Force quit** — Even if the user force quits the app, the start time is persisted and the timer resumes correctly on next launch.

Time state is persisted via **Secure Store** (encrypted on-device storage) so that the app can compute the current value from the stored start time and the current time, even after the process was suspended or killed.

## Timer API

The timer logic lives in three layers: a **storage utility** (Secure Store), a **timer utility** with pure functions, and a **React hook** that wires everything up for you.

---

### Storage utility (`utils/storage.js`)

A thin wrapper around **expo-secure-store** that provides key/value persistence. Secure Store writes to encrypted on-device storage, so data survives app restarts, force quits, and reboots. The timer uses this instead of AsyncStorage for reliability.

| Method           | Purpose                                         |
| ---------------- | ----------------------------------------------- |
| `setValue(k, v)` | Store a string value under a key                |
| `getValue(k)`    | Retrieve a value (returns `null` if missing)    |
| `removeValue(k)` | Delete a stored value                           |
| `keys`           | Object of known keys (e.g. `keys.startTime`)    |

---

### Timer utility (`utils/timer.js`)

Low-level functions for storing, reading, and formatting elapsed time. Uses the storage utility to persist the start time. No React — use these directly if you're building your own UI or integrating into a different framework.

| Function                       | What it does                                                                                                          |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `recordStartTime()`            | Saves the current time as the timer start. Call this when the user taps Start.                                        |
| `clearStartTime()`             | Removes the stored start time. Call this when the user taps Stop.                                                     |
| `getElapsedTime()`             | Returns how many **seconds** have passed since the timer started. Returns `0` if no start time is stored or on error. |
| `formatDuration(totalSeconds)` | Converts a number of seconds into a display string like `"01:23:45"` (hours:minutes:seconds).                         |
| `getFormattedElapsedTime()`    | Same as `getElapsedTime` + `formatDuration` in one call. Returns a string like `"01:23:45"`.                          |

**Quick example (without the hook):**

```javascript
import {
  recordStartTime,
  getFormattedElapsedTime,
  clearStartTime,
} from "@/utils/timer";

// User taps Start
await recordStartTime();

// Show current elapsed time
const label = await getFormattedElapsedTime(); // "00:01:30"

// User taps Stop
await clearStartTime();
```

---

### useTimer hook (`hooks/useTimer.js`)

A React hook that handles all timer behavior for you: start/stop, live updates every second, and refreshing when the app comes back from the background.

**Returns:**

| Property             | Type       | Description                                                      |
| -------------------- | ---------- | ---------------------------------------------------------------- |
| `formattedTimeLabel` | `string`   | The elapsed time as `"HH:MM:SS"` — put this directly in your UI. |
| `isRunning`          | `boolean`  | `true` when the timer is running, `false` when stopped.          |
| `start`              | `function` | Call to start the timer.                                         |
| `stop`               | `function` | Call to stop the timer and reset the display.                    |

**Usage example:**

```jsx
import { useTimer } from "@/hooks/useTimer";

function MyScreen() {
  const { formattedTimeLabel, isRunning, start, stop } = useTimer();

  return (
    <>
      <Text>{formattedTimeLabel}</Text>
      <Button
        title={isRunning ? "Stop" : "Start"}
        onPress={() => (isRunning ? stop() : start())}
      />
    </>
  );
}
```

The hook refreshes the label every second while running and when the app returns from the background, so the displayed time is always correct.

---

## Libraries (Dependencies)

| Library                                                   | Purpose                                                                 |
| --------------------------------------------------------- | ----------------------------------------------------------------------- |
| [expo-secure-store](https://docs.expo.dev/versions/latest/sdk/securestore/) | Encrypted key/value storage — persists timer state across background, relaunch, and force quit |
| [date-fns](https://date-fns.org/)                         | Date/time formatting and manipulation for the timer display             |

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).
