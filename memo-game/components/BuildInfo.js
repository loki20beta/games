/**
 * BuildInfo.js - Build Timestamp Display Component
 *
 * This component displays the build date and time at the bottom of screens
 * to help developers verify they're looking at the most recent version.
 *
 * Key Features:
 * - Shows current build timestamp in small, unobtrusive text
 * - Positioned at bottom of screen with minimal visual impact
 * - Automatically updates when code is rebuilt
 * - Consistent styling across all screens
 *
 * Usage:
 * - Import and place at bottom of any screen component
 * - Automatically shows current build time when app starts
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * BuildInfo Component - Development Build Timestamp Display
 *
 * Shows the current build date and time in small text at the bottom
 * of the screen. This helps ensure developers are looking at the
 * most recent version during development and testing.
 *
 * The timestamp is generated when the component is first imported,
 * which corresponds to when the JavaScript bundle is built.
 *
 * @returns {JSX.Element} Small timestamp text component
 */
const BuildInfo = () => {
  // Generate build timestamp when component is first loaded
  const buildTimestamp = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false // Use 24-hour format
  });

  return (
    <View style={styles.container}>
      <Text style={styles.buildText}>
        build: {buildTimestamp}
      </Text>
    </View>
  );
};

/**
 * Styles for BuildInfo Component
 * Designed to be subtle and unobtrusive while remaining visible
 */
const styles = StyleSheet.create({
  /**
   * container: Wrapper for build info positioning
   * Positions at bottom center with minimal padding
   */
  container: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  /**
   * buildText: Styling for build timestamp text
   * Small, gray text that's visible but not distracting
   */
  buildText: {
    fontSize: 10,
    color: '#999999',
    fontFamily: 'monospace', // Monospace for consistent timestamp formatting
    opacity: 0.7,
    textAlign: 'center',
  },
});

export default BuildInfo;