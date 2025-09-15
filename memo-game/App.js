import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

import HomeScreen from './screens/HomeScreen';
import SelectionScreen from './screens/SelectionScreen';
import GameScreen from './screens/GameScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Memo Cards Game' }}
        />
        <Stack.Screen
          name="Selection"
          component={SelectionScreen}
          options={{ title: 'Select Images' }}
        />
        <Stack.Screen
          name="Game"
          component={GameScreen}
          options={{ title: 'Memory Game' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
