# Budgeting System - Frontend

A mobile application built with React Native for personal finance management.

## Features

- User Registration and Authentication
- Transaction Management
  - Add income and expenses
  - Categorize transactions
  - Track spending history
- Financial Goals
  - Set savings goals
  - Track progress
  - Set deadlines
- User Profile
  - Personal information
  - Financial preferences
  - Account settings

## Technical Stack

- React Native
- Expo
- React Navigation
- React Native Paper (UI Components)
- Axios (API Communication)

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Start the development server:
   ```bash
   npx expo start --clear
   ```

## Project Structure

```
frontend/
├── assets/         # Images, fonts, and other static assets
├── components/     # Reusable UI components
├── screens/        # Application screens
├── theme/         # Theme configuration and styles
└── App.js         # Main application component
```

## API Integration

The frontend communicates with the backend API at `http://localhost:5001` for:
- User authentication
- Transaction management
- Goal tracking
- Profile updates

## Development

- Run the development server: `npx expo start --clear`
- Use Expo Go app to test on mobile devices
- For iOS simulator: Press 'i' in the terminal
- For Android emulator: Press 'a' in the terminal
- To clear cache and restart: `npx expo start --clear`

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 