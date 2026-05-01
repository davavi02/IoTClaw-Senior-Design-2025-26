# Clawser
React Native app built on Expo

## Setup
- Follow the [Expo documentation](https://docs.expo.dev/get-started/set-up-your-environment/?mode=development-build&platform=android&device=simulated&buildEnv=local) to setup for your environment 
- Ensure you have node.js installed and run `npm install` in the directory to install dependencies. Then run `npx expo` to start dev build

## Building
Linux or MacOS is needed to build an `.apk` or `.ipa`. Covering APK for Android here

- Install Expo's EAS: `npm install -g eas-cli`
- Run `eas build --local --profile preview --platform android` to start building for Android (Can take a while)