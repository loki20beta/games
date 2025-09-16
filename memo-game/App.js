/**
 * App.js - Main Application Entry Point
 *
 * This is the root component for the Kids Memory Game application.
 * It sets up the navigation structure and manages the overall app flow.
 *
 * Navigation Flow:
 * Home -> Selection -> Game
 *
 * Key Responsibilities:
 * - Initialize React Navigation container
 * - Define screen stack and navigation routes
 * - Configure screen options and headers
 * - Manage app-wide navigation state
 *
 * Architecture:
 * - Uses React Navigation v6 Stack Navigator
 * - Each screen is a separate component in /screens folder
 * - Navigation parameters flow between screens for game state
 *
 * Child Screens:
 * - HomeScreen: Game configuration (grid size + image source selection)
 * - SelectionScreen: Specific image selection based on chosen source
 * - GameScreen: Main memory game interface and gameplay
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import screen components
import HomeScreen from './screens/HomeScreen';
import SelectionScreen from './screens/SelectionScreen';
import GameScreen from './screens/GameScreen';

/**
 * Stack Navigator instance
 * Creates the navigation structure for the entire application
 * Manages screen transitions and navigation history
 */
const Stack = createStackNavigator();

/**
 * Main App Component
 *
 * Root component that wraps the entire application in navigation context.
 * Defines the screen stack and navigation flow for the memory game.
 *
 * Navigation Structure:
 * - Home (initial): Game setup and configuration
 * - Selection: Image selection based on user preferences
 * - Game: Active gameplay with selected configuration
 *
 * @returns {JSX.Element} The complete navigable application
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {/*
          StatusBar configuration
          - 'auto': Automatically adjusts based on app theme
          - Ensures consistent status bar appearance across platforms
        */}
        <StatusBar style="auto" />

        {/*
          Stack Navigator Container
          - initialRouteName: Sets "Home" as the starting screen
          - Defines linear navigation flow suitable for game setup process
        */}
        <Stack.Navigator initialRouteName="Home">

        {/*
          HOME SCREEN
          Purpose: Primary game configuration interface
          - User selects grid size (2x2, 4x4, 6x6)
          - User selects image source (emoji, gallery, Peppa, Bluey)
          - Navigates to Selection screen with configuration parameters
        */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Memo Cards Game',  // Header title for navigation
            // Note: Header is visible but minimal for child-friendly design
          }}
        />

        {/*
          SELECTION SCREEN
          Purpose: Specific image selection interface
          - Receives configuration from Home screen via route params
          - Displays images based on selected source (emoji set, gallery, etc.)
          - User selects specific images for their memory game
          - Navigates to Game screen when sufficient images are selected
        */}
        <Stack.Screen
          name="Selection"
          component={SelectionScreen}
          options={{
            title: 'Select Images',  // Clear indication of current step
            // Back button automatically provided by stack navigator
          }}
        />

        {/*
          GAME SCREEN
          Purpose: Main gameplay interface
          - Receives complete game configuration via route params
          - Renders game grid with selected images
          - Manages game state (flipped cards, matches, completion)
          - Provides win screen and restart functionality
        */}
        <Stack.Screen
          name="Game"
          component={GameScreen}
          options={{
            title: 'Memory Game',    // Game context header
            // Game screen may hide header for immersive experience
          }}
        />

        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}