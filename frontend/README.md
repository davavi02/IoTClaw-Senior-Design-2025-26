# IoT Claw - Frontend

**Senior Design Project 2025-26**

A React Native/Expo app for remote arcade claw game control.

## 🎮 What It Does

Control a real claw machine from your phone! Register, sign in, wait your turn, and play remotely.

### Features
- User registration and sign-in
- Remote claw machine control
- Queue management
- Game dashboard and settings

## 🚀 Quick Start

### Requirements
- Node.js (v18+)
- Mobile device with Expo Go app OR iOS/Android simulator

### Setup
```bash
# 1. Install dependencies
npm install

# 2. Start the app
npx expo start

# 3. Scan QR code with Expo Go app
```

### Run Options
- **📱 Mobile**: Scan QR code with Expo Go
- **🌐 Web**: Press `w` in terminal
- **📲 iOS**: Press `i` (needs Xcode)
- **🤖 Android**: Press `a` (needs Android Studio)

## 📁 Project Structure

```
frontend/
├── app/                    # Screens (index, signin, register, dashboard, game, etc.)
├── components/             # Reusable UI components (Button, Input, etc.)
├── constants/              # Design system (colors, typography, spacing)
├── hooks/                  # Custom React hooks (animations)
└── assets/                 # Images and static files
```

### Key Files
- **`app/index.tsx`** - Landing page
- **`app/signin.tsx`** - Login screen
- **`app/register.tsx`** - Registration screen
- **`app/dashboard.tsx`** - Game dashboard
- **`app/game.tsx`** - Claw machine controls
- **`components/Button.tsx`** - Reusable button component
- **`constants/theme.ts`** - App colors and styling

## 🛠️ Development

### Scripts
```bash
npm start          # Start development server
npm run android    # Run on Android
npm run ios        # Run on iOS
npm run web        # Run in browser
npm run lint       # Check code quality
```

### Code Structure
- **Reusable Components**: Button, Input, ScreenHeader, AnimatedBackground
- **Centralized Theming**: All colors, fonts, and spacing in `constants/theme.ts`
- **Custom Hooks**: Animation logic in `hooks/useAnimations.ts`
- **Clean Architecture**: Separated screens, components, and utilities

## 🚨 Troubleshooting

### Common Issues
```bash
# Module not found errors
npm install

# Metro bundler issues
npx expo start --clear

# Installation problems
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

**IoT Claw Team - Senior Design 2025-26**