# Rick and Morty Character Explorer

A React Native mobile application that displays characters from the Rick and Morty API with offline support and favorites functionality.

## Features

- View a list of Rick and Morty characters
- Mark/unmark characters as favorites
- View favorite characters offline
- Smooth image loading with caching
- Offline data persistence
- Clean and responsive UI

## Tech Stack

- React Native with Expo
- TypeScript
- Zustand for state management
- TanStack Query (React Query) for data fetching and caching
- React Navigation for routing
- AsyncStorage for local persistence
- Expo Image for optimized image loading

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator or Android Emulator (or a physical device with Expo Go)

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd RickAndMorty
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server
   ```bash
   npx expo start
   ```

4. Run the app
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan the QR code with Expo Go on your physical device

## Project Structure

```
src/
  ├── api/               # API service functions
  ├── components/        # Reusable UI components
  ├── constants/         # App constants and theme
  ├── hooks/             # Custom React hooks
  ├── navigation/        # Navigation configuration
  ├── screens/           # App screens
  ├── store/             # State management with Zustand
  └── utils/             # Utility functions and helpers
```

## Architecture

The app follows a clean architecture pattern with clear separation of concerns:

- **Presentation Layer**: Components and screens
- **Domain Layer**: Business logic and state management
- **Data Layer**: API services and local storage

## Testing

To run tests:

```bash
npm test
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
