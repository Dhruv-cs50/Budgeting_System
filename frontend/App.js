/**
 * Budgeting System Frontend Application
 * 
 * This is the main entry point for the Budgeting System React Native application.
 * It sets up the navigation structure and defines the main screens of the app.
 * 
 * Navigation Structure:
 * - Stack Navigator (Main navigation)
 *   - Welcome Screen (Initial screen)
 *   - Login Screen
 *   - Register Screen
 *   - Main Tabs (Bottom tab navigation)
 *     - Home Screen
 *     - Transactions Screen
 *     - Analytics Screen
 *     - Goals Screen
 *     - Profile Screen
 *   - Add Transaction Screen (Modal)
 * 
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from './theme/colors';

// Import screens
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import AddTransactionScreen from './screens/AddTransactionScreen';
import TransactionsHistoryScreen from './screens/TransactionsHistoryScreen';
import AnalyticsScreen from './screens/AnalyticsScreen';
import GoalsScreen from './screens/GoalsScreen';
import ProfileScreen from './screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * MainTabs Component
 * 
 * Defines the bottom tab navigation structure for the main app screens.
 * Each tab represents a major feature of the application.
 * 
 * @returns {JSX.Element} Bottom tab navigator with configured screens
 */
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background.main,
          borderTopWidth: 0,
          elevation: 0,
          height: 60,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: colors.primary.light,
        tabBarInactiveTintColor: colors.text.secondary,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Transactions"
        component={TransactionsHistoryScreen}
        options={{
          tabBarLabel: 'Transactions',
        }}
      />
      <Tab.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{
          tabBarLabel: 'Analytics',
        }}
      />
      <Tab.Screen
        name="Goals"
        component={GoalsScreen}
        options={{
          tabBarLabel: 'Goals',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

/**
 * App Component
 * 
 * The root component of the application that sets up the navigation container
 * and defines the main stack navigation structure.
 * 
 * @returns {JSX.Element} Navigation container with configured stack navigator
 */
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: colors.background.light,
          },
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen
          name="AddTransaction"
          component={AddTransactionScreen}
          options={{
            presentation: 'modal',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
