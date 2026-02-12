# PersistentTimer

An example Expo app demonstrating a **PersistentTimer** that keeps running when the app goes into the background and correctly resumes when the app is launched again.

This project was created with [`npx create-expo-app@latest`](https://www.npmjs.com/package/create-expo-app).

## Background & relaunch behavior

The timer is designed to survive:

- **Backgrounding** — When you leave the app (home button, app switch, or lock screen), the timer continues to count based on elapsed time.
- **Relaunch** — When you open the app again, the timer shows the correct remaining or elapsed time instead of resetting.

Time state is persisted so that the app can compute the current value from the stored start time (or remaining duration) and the current time, even after the process was suspended or killed.

## Libraries

| Library                                                                                                  | Purpose                                                      |
| -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| [@react-native-async-storage/async-storage](https://github.com/react-native-async-storage/async-storage) | Persisting timer state across app backgrounding and relaunch |
| [date-fns](https://date-fns.org/)                                                                        | Date/time formatting and manipulation for the timer display  |

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
