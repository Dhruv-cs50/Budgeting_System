import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthScreen from './screens/AuthScreen';

import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Auth">
          <Stack.Screen
              name="Auth"
              component={AuthScreen}
              options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
  );
}
