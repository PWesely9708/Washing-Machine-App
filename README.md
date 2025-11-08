# 🧺 Washing-Machine-App

A **React Native** app built with **Expo** and **expo-router**, targeting **Android** with **Firebase Email/Password authentication**.

> **Repo:** [github.com/PWesely9708/Washing-Machine-App](https://github.com/PWesely9708/Washing-Machine-App)  
> **Android Package:** `com.company.laundry`  
> **Secrets:** `android/app/google-services.json` is **NOT** committed (shared privately).

---

## 📘 Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Requirements](#requirements)
    - [Windows](#windows)
    - [macOS](#macos)
4. [First-Time Setup](#first-time-setup)
    - [Clone the Repo](#clone-the-repo)
    - [Install Dependencies](#install-dependencies)
    - [Add Firebase Config](#add-firebase-config)
    - [Install Dev Client (First Native Build)](#install-dev-client-first-native-build)
    - [Start the App](#start-the-app)
5. [Everyday Development](#everyday-development)
6. [Troubleshooting](#troubleshooting)
7. [Git Hygiene (No Secrets)](#git-hygiene-no-secrets)
8. [Project Structure](#project-structure)
9. [FAQ](#faq)
10. [Quick Start (Copy/Paste)](#quick-start-copypaste)

---

## 🧩 Overview

This app allows users to sign in via **Firebase Email/Password** and browse laundry-related screens (buildings, machines, etc.) using **expo-router** for navigation.  
It uses the **Expo Development Client** for a smooth native + JS workflow.

---

## ⚙️ Tech Stack

- **React Native** via **Expo**
- **expo-router** (file-based navigation)
- **Firebase Auth** (Email/Password)
- **TypeScript**
- Android **SDK 35** & **Build-Tools 35.0.0**

---

## 💻 Requirements

> You only need **Android Studio installed** to start. Follow OS-specific setup steps below.

---

###  Windows

1. **Git for Windows** – [git-scm.com/download/win](https://git-scm.com/download/win)
2. **Node.js LTS (20.x or 22.x)** – [nodejs.org/en](https://nodejs.org/en)
3. **Android Studio**
    - **SDK Manager** → install:
        - ✅ Android 15 (API 35) → *Android SDK Platform 35*
        - ✅ *Android SDK Build-Tools 35.0.0*
        - ✅ *Android SDK Platform-Tools*
    - **Device Manager** → Create emulator (e.g. Pixel 8 / API 35)

Verify tools in PowerShell:

```powershell
node -v
npm -v
git --version
```

---

### macOS

1. **Git**
   ```bash
   xcode-select --install
   # or
   brew install git
   ```
2. **Node.js LTS (20.x or 22.x)**  
   [nodejs.org/en](https://nodejs.org/en) or
   ```bash
   brew install node
   ```
3. **Android Studio**
    - **SDK Manager** → install:
        - ✅ Android SDK Platform 35
        - ✅ Build-Tools 35.0.0
        - ✅ Platform-Tools
    - **Device Manager** → Create emulator (API 35)

Verify tools:

```bash
node -v
npm -v
git --version
```

> You do **not** need to manually set `JAVA_HOME`; Android Studio/Gradle provide a compatible JDK.

---

## 🚀 First-Time Setup

### 🧱 Clone the Repo

#### Windows (PowerShell)
```powershell
mkdir $env:USERPROFILE\StudioProjects -ErrorAction SilentlyContinue
cd $env:USERPROFILE\StudioProjects
git clone https://github.com/PWesely9708/Washing-Machine-App.git
cd Washing-Machine-App
```

#### macOS (Terminal)
```bash
mkdir -p ~/StudioProjects
cd ~/StudioProjects
git clone https://github.com/PWesely9708/Washing-Machine-App.git
cd Washing-Machine-App
```

---

### 📦 Install Dependencies
```bash
npm install
# or (for reproducible CI-like installs)
# npm ci
```

---

### 🔐 Add Firebase Config

You’ll receive `google-services.json` from the project owner.  
Place it **exactly** at:

```
android/app/google-services.json
```

#### ✅ Optional sanity check

**Windows**
```powershell
$g = Get-Content .\android\app\google-services.json | ConvertFrom-Json
$g.client[0].client_info.android_client_info.package_name
# Expect: com.company.laundry
```

**macOS**
```bash
node -e "const g=require('./android/app/google-services.json'); console.log(g.client[0].client_info.android_client_info.package_name)"
# Expect: com.company.laundry
```

If it doesn’t print `com.company.laundry`, request the correct file.

---

### ⚙️ Install Dev Client (First Native Build)

Required once to install the **native development client**.

1. Start an Android emulator (or connect a physical device with USB debugging enabled).
2. Run:

**Windows**
```powershell
cd android; .\gradlew --stop; cd ..
npx expo run:android
```

**macOS**
```bash
(cd android && ./gradlew --stop)
npx expo run:android
```

---

### ▶️ Start the App

```bash
npx expo start -c
```

When the **Expo CLI UI** appears:

- Press **`a`** to open on Android (ensure emulator is running)
- Log in with a test **Email/Password** account

---

## 🧠 Everyday Development

Start Metro bundler:
```bash
npx expo start
```

Rebuild native app when changing native deps or Android config:
```bash
npx expo run:android
```

Clear Metro cache if bundling misbehaves:
```bash
npx expo start -c
```

Restart ADB if devices/emulators don’t show up:
```bash
adb kill-server
adb start-server
```

---

## 🩺 Troubleshooting

| Problem | Fix |
|----------|-----|
| **Firebase “Default app not initialized” / Auth errors** | Ensure `android/app/google-services.json` exists locally and matches `com.company.laundry`. Rebuild: `npx expo run:android` |
| **Metro “Cannot pipe to a closed or destroyed stream”** | Clear cache: `npx expo start -c` |
| **Gradle build failures after dependency changes** | Open `android/` in Android Studio and sync Gradle. If still failing:<br>`(cd android && ./gradlew clean)` then `npx expo run:android` |
| **Device not found / install fails** | Ensure emulator or physical device with debugging is connected. Restart adb: `adb kill-server && adb start-server` |

---

## 🧹 Git Hygiene (No Secrets)

`android/app/google-services.json` is ignored via `.gitignore`.  
Always double-check before pushing:

```bash
git status
```

Ensure **no secret files** are staged.

---

## 🗂 Project Structure

```
Washing-Machine-App/
├─ app/                       # expo-router screens
│  ├─ _layout.tsx
│  ├─ index.tsx
│  ├─ login.tsx
│  ├─ register.tsx
│  ├─ buildings/
│  └─ machines/
├─ src/
│  └─ firebase.ts             # Firebase initialization (no secrets)
├─ android/                   # Native Android project
│  └─ app/
│     ├─ src/main/...         # AndroidManifest, MainActivity, etc.
│     └─ google-services.json # (local only; not in Git)
├─ assets/
│  └─ images/                 # Icons, splash, logos
├─ app.json                   # Expo/Android config
├─ package.json
└─ README.md
```

---

## ❓ FAQ

**Q:** Do I need Expo Go?  
**A:** No. We use the **Expo Dev Client** (`npx expo run:android`) because the app includes native modules.

**Q:** Do I need to set `ANDROID_HOME` or `JAVA_HOME`?  
**A:** Usually not — Android Studio/Gradle handle this automatically.

**Q:** My `google-services.json` is different.  
**A:** It must match `com.company.laundry`. Ask the owner for the correct file if it doesn’t.

---

## ⚡ Quick Start (Copy/Paste)

### Windows
```powershell
mkdir $env:USERPROFILE\StudioProjects -ErrorAction SilentlyContinue
cd $env:USERPROFILE\StudioProjects
git clone https://github.com/PWesely9708/Washing-Machine-App.git
cd Washing-Machine-App

npm install

# Put google-services.json here:
# android/app/google-services.json

# Sanity check:
$g = Get-Content .\android\app\google-services.json | ConvertFrom-Json
$g.client[0].client_info.android_client_info.package_name

# First native build
cd android; .\gradlew --stop; cd ..
npx expo run:android

# Start bundler
npx expo start -c
# Press "a" to open on Android
```

---

### macOS
```bash
mkdir -p ~/StudioProjects
cd ~/StudioProjects
git clone https://github.com/PWesely9708/Washing-Machine-App.git
cd Washing-Machine-App

npm install

# Put google-services.json here:
# android/app/google-services.json

# Sanity check:
node -e "const g=require('./android/app/google-services.json'); console.log(g.client[0].client_info.android_client_info.package_name)"

# First native build
(cd android && ./gradlew --stop)
npx expo run:android

# Start bundler
npx expo start -c
# Press "a" to open on Android
```
