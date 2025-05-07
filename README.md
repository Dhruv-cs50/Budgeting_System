# Budgeting System

## Project Description
A comprehensive budgeting system that helps users track their expenses, manage budgets, and gain insights into their spending patterns. 

## Group Members
- [Alex Adams]
- [Andrian Than]
- [Dhruv Shah]

## Project Structure
```
Budgeting_System/
├── backend/                 # Python Flask backend
│   ├── app.py              # Main Flask application
│   ├── routes/             # API route handlers
│   ├── tests/              # Backend test cases
│   ├── data.json           # Sample data file
│   └── requirements.txt    # Python dependencies
│
├── frontend/               # React Native frontend
│   ├── screens/           # Screen components
│   ├── components/        # Reusable UI components
│   ├── services/          # API service calls
│   ├── theme/             # UI theme configuration
│   └── assets/            # Images and other static assets
```

## Complete Installation Guide

### 1. Prerequisites Installation

#### For macOS:
```bash
#Install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

brew install python@3.8

brew install node
brew install git
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install flask==2.0.1
pip install flask-cors==3.0.10
pip install pandas==1.3.3
pip install python-dotenv==0.19.0
pip install -r requirements.txt
```

### 3. Frontend Setup
```bash
cd frontend
npm install -g expo-cli
npm install
npm install @react-native-async-storage/async-storage
npm install @react-native-community/datetimepicker
npm install @react-native-community/slider
npm install @react-native-picker/picker
npm install expo-checkbox
npm install expo-image-picker
npm install expo-linear-gradient
npm install expo-status-bar
npm install react-native-gesture-handler
npm install react-native-modal-datetime-picker
npm install react-native-reanimated
npm install react-native-safe-area-context
npm install react-native-screens
npm install react-native-svg
```

### 4. Development Tools Setup

#### Install Expo Go on Mobile:
1. iOS: Search "Expo Go" in the App Store
2. Android: Search "Expo Go" in the Google Play Store

### 5. Running the Application

#### Start Backend Server:
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python app.py
```

#### Start Frontend Development Server:
```bash
cd frontend
npm start
```

## Setup Instructions

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the backend server:
   ```bash
   python app.py
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Expo development server:
   ```bash
   npm start
   ```

## Running the Application
1. Ensure both backend and frontend servers are running
2. Use the Expo Go app on your mobile device or an emulator to run the frontend
3. The application will connect to the backend automatically

## Known Limitations
- The application currently stores data in a JSON file rather than a persistent database
- Offline functionality is limited
- The application is optimized for mobile devices and may not provide the best experience on desktop browsers

## Additional Notes
- The backend server runs on port 5000 by default
- The frontend is configured to connect to localhost:5000 for development




