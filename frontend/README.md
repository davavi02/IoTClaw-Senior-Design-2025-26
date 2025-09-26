# IoT Claw - Frontend

**Senior Design Project 2025-26**

A React Native/Expo frontend for a remote arcade claw game experience, providing real-time IoT control interface for remote gameplay.

## 🎮 Project Overview

This frontend application creates an immersive gaming interface for remote control of a physical claw game machine. Users can register, sign in, and remotely control a real claw machine through an intuitive mobile interface.

### Key Features
- **Authentication System**: User registration and sign-in
- **Real-time Game Control**: Remote claw machine operation
- **Queue Management**: Wait in queue for your turn
- **Game Dashboard**: Track play sessions and statistics  
- **Settings**: Customize user preferences
- **Responsive Design**: Optimized for mobile and tablet devices

## 🚀 Getting Started

### Prerequisites

Before running this project, ensure you have:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Expo CLI** (will be installed automatically)
- **Mobile device** with Expo Go app OR **iOS Simulator** OR **Android Emulator**

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd IoTClaw-Senior-Design-2025-26/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

### Running the Application

After running `npx expo start`, you'll see several options:

- **📱 Scan QR Code**: Use Expo Go app on your phone
- **🌐 Web**: Press `w` to open in web browser  
- **📲 iOS Simulator**: Press `i` (requires Xcode)
- **🤖 Android Emulator**: Press `a` (requires Android Studio)

### 🏗️ Stable Cross-Platform Development

For reliable development on both iOS and Android:

```bash
# ⚡ STABLE iOS Development (Recommended)
npm run ios-stable
# OR:
npx expo start --ios --clear --port 8082

# ⚡ STABLE Android Development (Recommended)
npm run android-stable  
# OR:
npx expo start --android --clear --port 8082

# 🌐 Web Development
npx expo start --web

# 🔧 Troubleshooting
# If experiencing port conflicts:
npx expo start --port 8083
```

### Alternative Start Commands

```bash
# Android device/emulator
npm run android
# OR expo start --android

# iOS simulator  
npm run ios  
# OR expo start --ios

# Web browser
npm run web
# OR expo start --web
```

## 📁 Project Structure

```
frontend/
├── app/                          # Application screens (file-based routing)
│   ├── _layout.tsx              # Root layout configuration
│   ├── index.tsx               # Landing/Home page
│   ├── signin.tsx              # User authentication
│   ├── register.tsx            # User registration  
│   ├── dashboard.tsx           # Game dashboard/queue
│   ├── game.tsx                # Active gameplay interface
│   ├── result.tsx              # Game results/summary
│   └── settings.tsx            # User settings/preferences
├── assets/                      # Static resources
│   └── images/                  
│       ├── icon.png            # App icon
│       ├── favicon.png         # Web favicon
│       ├── splash-icon.png     # Splash screen icon
│       └── android-icons/      # Android-specific icons
├── app-example/                # Example code (templates)
│   ├── app/
│   ├── components/
│   ├── constants/
│   └── hooks/
├── package.json                # Dependencies & scripts
├── app.json                    # Expo configuration
├── tsconfig.json              # TypeScript configuration
├── eslint.config.js           # Code linting rules
└── README.md                  # Project documentation
```

### App Structure Details

#### **Core App Files (`app/`)**

- **`_layout.tsx`**: 
  - Root navigation layout
  - Global status bar configuration
  - Navigation screen options

- **`index.tsx`**: 
  - Landing page with animations
  - User authentication entry points
  - Branded welcome interface

- **Authentication Pages**:
  - **`signin.tsx`**: User login form
  - **`register.tsx`**: User registration form

- **Game Pages**:
  - **`dashboard.tsx`**: Game queue, wait times, play controls
  - **`game.tsx`**: Active claw machine control interface  
  - **`result.tsx`**: Game outcome and scoring
  - **`settings.tsx`**: User preferences and account settings

## 📱 Key Features Implemented

### **User Interface**
- Modern animated splash screens
- Responsive navigation layouts  
- Custom styled components
- Dark theme optimization
- Cross-platform consistency

### **Game Control System**
- Real-time claw machine controls
- Touch gesture mapping to machine movements  
- Timer-based gameplay sessions
- Queue management system
- Play result tracking

### **Authentication Flow**
- Secure user registration
- Sign-in validation
- Session management
- User profile management

## 🔧 Development Scripts

```bash
# Development server
npm start                    # Start Expo development server
npx expo start              # Alternative start command

# Platform-specific builds  
npm run android             # Launch Android emulator
npm run ios                 # Launch iOS simulator  
npm run web                 # Launch web browser

# Code quality
npm run lint                # Run ESLint checks

# Project management
npm run reset-project       # Reset to clean state
```

## 🎯 Development Tips

### **Getting Started Development**
1. Run `npm start` and scan QR code with Expo Go
2. Make changes to files in `app/` directories  
3. Hot reload automatically updates the running app
4. Check console logs for debugging information

### **Troubleshooting Common Issues**

#### **Module not found errors**
```bash
npm install
# OR delete node_modules and package-lock.json, then reinstall
```

#### **Metro bundler issues**  
```bash
npx expo start --clear
```

#### **Installation Problems**
1. Ensure Node.js version 18+ is installed
2. Clear npm cache: `npm cache clean --force`
3. Delete node_modules and package-lock.json
4. Run `npm install` fresh

## 🚦 Project Status

This project is actively under development for the Senior Design 2025-26 academic year. Key features and UI components are implemented with ongoing IoT integration work.

---

**IoT Claw Team - Senior Design 2025-26**
*Building the future of remote arcade gaming*