# CS250_Group1
This mobile application tracks laundry machine timers in order to provide convenience for SDSU student body.


## Get started from scratch

1. Install dependencies

   >> npm install

2. Run the application through one of the following options:

   - [development build](https://docs.expo.dev/develop/development-builds/introduction/)
   - [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/) [WHAT_WE_USED_FOR_EMULATION]
   - [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
   - [Expo Go](https://expo.dev/go)

3. Steps for Android emulator:

   - Open android studio, go to device manager and start a device
   - From the project directory:
      >> npx expo prebuild
      >> npx expo run:android


## Project Overview

   - The main files used to make the app are stored in 'app/'
   - There are xml configuration files stored in 'android/app/src/main/'
   - Images and icons are stored in 'assets/images'
   - In VSCode, data.json |  package-lock.json | package.json, have been manually configured for React Native and Firebase implmenentation
   - Remaining files are default project configuration files


## Learn more with Expo resources

   - [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
   - [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.