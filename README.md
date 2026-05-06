# Vmax - React Native Frontend

Vmax is an Expo (React Native) mobile app.

## Prerequisites

Install these tools first:

- Node.js
- npm (comes with Node.js)
- Expo Go app on your mobile device (optional, you can run with emulator)

## 1. Install dependencies

From the project root, run:

```bash
npm install
```

## 2. Configure environment variables

This app uses `EXPO_PUBLIC_API_URL` in `app/services/api.js` for API requests.

Create a `.env` file in the project root with:

```env
EXPO_PUBLIC_API_URL=http://YOUR_BACKEND_URL
```

After changing `.env`, restart Expo.

## 3. Run the app

Start Expo:

```bash
npx expo start
```

Then choose one of these:

- Press `a` to open Android
- Press `i` to open iOS (macOS only)
- Press `w` to open web
- Scan the QR code with Expo Go on your phone

You can also run directly:

```bash
npm run android
npm run ios
npm run web
```

## Project Structure

### `/app` - Routes & Pages

The main application structure using Expo Router for file-based routing.

### `/assets` - Static Resources

Images, icons, and other static assets used throughout the app.

### `/components` - Reusable UI Components

Modular, reusable React Native components used across screens.

### `/constants` - App Configuration

Global constants and configuration values.

### `/contexts` - React Context Providers

Global state management and context providers.

### `/hooks` - Custom React Hooks

Custom hooks for reusable logic.

### `/services` - API & External Services

API client and external service integrations.
