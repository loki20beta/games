/**
 * HomeScreen.js - Main Game Setup Screen
 *
 * This is the primary configuration screen for the Kids Memory Game where children
 * select their game preferences through a two-step visual process:
 * 1. Choose grid size (2x2, 4x4, 6x6) with visual grid representations
 * 2. Choose image source (emojis, gallery photos, Peppa Pig, Bluey characters)
 *
 * Key Features:
 * - Step-by-step selection process optimized for ages 3+
 * - Pure visual interface with minimal text
 * - Responsive design supporting portrait/landscape orientations
 * - Automatic navigation between steps
 * - Flashing animation feedback when selections are made
 *
 * Relationships:
 * - Parent: App.js (main navigation container)
 * - Navigation target: SelectionScreen.js (image selection phase)
 * - Passes game configuration data via navigation params
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions
} from 'react-native';
import BuildInfo from '../components/BuildInfo';

/**
 * HomeScreen Component - Game Configuration Interface
 *
 * @param {Object} navigation - React Navigation object for screen transitions
 * @returns {JSX.Element} The rendered home screen component
 */
export default function HomeScreen({ navigation }) {
  // === STATE MANAGEMENT ===

  /**
   * selectedGridSize: Stores the chosen grid configuration
   * Values: null (no selection) | '2x2' | '4x4' | '6x6'
   * Used to determine game difficulty and card count
   */
  const [selectedGridSize, setSelectedGridSize] = useState(null);

  /**
   * selectedImageSource: Stores the chosen image theme
   * Values: null (no selection) | 'emoji' | 'gallery' | 'peppa' | 'bluey'
   * Determines what type of images will be used on the cards
   */
  const [selectedImageSource, setSelectedImageSource] = useState(null);

  /**
   * currentStep: Controls which selection screen is displayed
   * Values: 1 (grid size selection) | 2 (image source selection)
   * Manages the two-step configuration flow
   */
  const [currentStep, setCurrentStep] = useState(1);

  /**
   * screenData: Tracks device screen dimensions for responsive design
   * Updates automatically when device orientation changes
   * Used to determine landscape vs portrait layout
   */
  const [screenData, setScreenData] = useState(Dimensions.get('window'));

  /**
   * flashAnim: Animated value for button flashing effect
   * Range: 0.3 (dim) to 1.0 (full opacity)
   * Provides visual feedback when user makes a selection
   */
  const flashAnim = useRef(new Animated.Value(1)).current;

  // === RESPONSIVE DESIGN LOGIC ===

  /**
   * Screen orientation detection and responsive layout updates
   * Listens for device rotation and adjusts layout accordingly
   */
  useEffect(() => {
    /**
     * onChange: Callback for screen dimension changes
     * @param {Object} result - New screen dimensions from Dimensions API
     */
    const onChange = (result) => {
      setScreenData(result.window);
    };

    // Subscribe to dimension changes (device rotation)
    const subscription = Dimensions.addEventListener('change', onChange);

    // Cleanup subscription on component unmount
    return () => subscription?.remove();
  }, []);

  /**
   * isLandscape: Boolean indicating current screen orientation
   * Used to apply different layouts for landscape vs portrait mode
   */
  const isLandscape = screenData.width > screenData.height;

  // === GAME CONFIGURATION DATA ===

  /**
   * gridOptions: Available grid size configurations
   * Each option defines the game difficulty and card layout
   * - Small (2x2): 4 cards, 2 pairs - easiest for young children
   * - Medium (4x4): 16 cards, 8 pairs - moderate difficulty
   * - Big (6x6): 36 cards, 18 pairs - challenging for older children
   */
  const gridOptions = [
    {
      label: 'Small',    // User-friendly size description
      value: '2x2',      // Technical grid identifier
      totalCards: 4,     // Total cards on the board
      rows: 2,           // Grid rows for visual rendering
      cols: 2            // Grid columns for visual rendering
    },
    {
      label: 'Medium',
      value: '4x4',
      totalCards: 16,
      rows: 4,
      cols: 4
    },
    {
      label: 'Big',
      value: '6x6',
      totalCards: 36,
      rows: 6,
      cols: 6
    },
  ];

  /**
   * imageSourceOptions: Available image theme options
   * Each option represents a different visual theme for the game cards
   * - emoji: Standard emoji characters (universal, no download needed)
   * - gallery: Photos from device gallery (personalized experience)
   * - peppa: Peppa Pig themed images (popular with young children)
   * - bluey: Bluey character themed images (popular with young children)
   */
  const imageSourceOptions = [
    { label: '😊', value: 'emoji' },   // Happy face emoji for general emojis
    { label: '📷', value: 'gallery' }, // Camera emoji for photo gallery
    { label: '🐷', value: 'peppa' },   // Pig emoji representing Peppa Pig
    { label: '🐶', value: 'bluey' },   // Dog emoji representing Bluey
  ];

  // === ANIMATION CONTROL ===

  /**
   * Flash animation trigger effect
   * Starts the button flashing animation when user selects an image source
   * Only triggers on step 2 (image selection) since step 1 auto-advances
   */
  useEffect(() => {
    if (currentStep === 2 && selectedImageSource) {
      startFlashAnimation();
    }
  }, [selectedImageSource, currentStep]);

  /**
   * startFlashAnimation: Initiates the pulsing button effect
   * Creates a continuous loop animation that dims and brightens the Next button
   * Provides visual feedback that the user can proceed to the next screen
   */
  const startFlashAnimation = () => {
    Animated.loop(
      Animated.sequence([
        // Fade to 30% opacity over 500ms
        Animated.timing(flashAnim, {
          duration: 500,
          toValue: 0.3,
          useNativeDriver: true
        }),
        // Fade back to full opacity over 500ms
        Animated.timing(flashAnim, {
          duration: 500,
          toValue: 1,
          useNativeDriver: true
        }),
      ])
    ).start();
  };

  /**
   * stopFlashAnimation: Stops the pulsing effect and resets opacity
   * Called when user navigates away or goes back to prevent animation leaks
   */
  const stopFlashAnimation = () => {
    flashAnim.stopAnimation();
    flashAnim.setValue(1);
  };

  // === USER INTERACTION HANDLERS ===

  /**
   * handleGridSelection: Processes grid size selection
   * @param {string} gridValue - Selected grid size ('2x2', '4x4', or '6x6')
   *
   * Automatically advances to step 2 after a brief delay to show selection feedback.
   * The 300ms delay allows users to see the visual selection (scaling/color change)
   * before proceeding to the image source selection.
   */
  const handleGridSelection = (gridValue) => {
    setSelectedGridSize(gridValue);
    setTimeout(() => {
      setCurrentStep(2);
    }, 300); // Brief delay to show selection feedback
  };

  /**
   * handleImageSourceSelection: Processes image source selection
   * @param {string} sourceValue - Selected image source ('emoji', 'gallery', 'peppa', 'bluey')
   *
   * Sets the image source and triggers the flash animation to indicate
   * that the user can now proceed to the image selection screen.
   */
  const handleImageSourceSelection = (sourceValue) => {
    setSelectedImageSource(sourceValue);
  };

  /**
   * handleNext: Processes Next button press on step 2
   * Navigates to the SelectionScreen with complete game configuration data
   *
   * Passes all necessary parameters for the image selection phase:
   * - gridSize: Technical grid identifier for layout calculations
   * - imageSource: Theme identifier for image loading logic
   * - requiredImages: Number of unique images needed (half of total cards)
   * - totalCards: Total cards for game setup validation
   */
  const handleNext = () => {
    if (currentStep === 2 && selectedImageSource) {
      // Find the complete grid configuration object
      const selectedGrid = gridOptions.find(option => option.value === selectedGridSize);

      // Calculate required images (each image appears twice as a pair)
      const requiredImages = selectedGrid.totalCards / 2;

      // Navigate with complete configuration
      navigation.navigate('Selection', {
        gridSize: selectedGridSize,
        imageSource: selectedImageSource,
        requiredImages: requiredImages,
        totalCards: selectedGrid.totalCards,
      });
    }
  };

  /**
   * handleBack: Returns to step 1 from step 2
   * Resets image source selection and stops any running animations
   * Allows users to change their grid size selection if desired
   */
  const handleBack = () => {
    setCurrentStep(1);
    setSelectedImageSource(null);  // Clear image selection
    stopFlashAnimation();          // Prevent animation memory leaks
  };

  // === VISUAL COMPONENT RENDERERS ===

  /**
   * renderGridVisual: Creates visual representation of grid layout
   * @param {number} rows - Number of rows in the grid
   * @param {number} cols - Number of columns in the grid
   * @returns {JSX.Element} Grid visualization component
   *
   * Generates a precise visual preview of the game grid using positioned squares.
   * Each square represents where a card will be placed in the actual game.
   * Uses absolute positioning to ensure exact grid alignment regardless of content.
   */
  const renderGridVisual = (rows, cols) => {
    const squares = [];

    // Generate grid squares with precise positioning
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        squares.push(
          <View
            key={`${row}-${col}`}  // Unique key for React reconciliation
            style={[
              styles.gridSquare,  // Base square styling
              {
                position: 'absolute',
                left: col * 14,    // Horizontal spacing: 12px square + 2px gap
                top: row * 14      // Vertical spacing: 12px square + 2px gap
              }
            ]}
          />
        );
      }
    }

    // Container with dynamic dimensions based on grid size
    return (
      <View style={[
        styles.gridVisual,
        {
          width: cols * 12 + (cols - 1) * 2,   // Total width: squares + gaps
          height: rows * 12 + (rows - 1) * 2   // Total height: squares + gaps
        }
      ]}>
        {squares}
      </View>
    );
  };

  /**
   * renderGridOption: Creates interactive grid size selection button
   * @param {Object} option - Grid configuration object from gridOptions
   * @returns {JSX.Element} Touchable grid selection button
   *
   * Renders a large button containing the visual grid representation.
   * Provides visual feedback through scaling and color changes when selected.
   * Optimized for child interaction with large touch targets.
   */
  const renderGridOption = (option) => (
    <TouchableOpacity
      key={option.value}
      style={[
        styles.gridButton,
        // Apply selected styling if this option is chosen
        selectedGridSize === option.value && styles.selectedGridButton
      ]}
      onPress={() => handleGridSelection(option.value)}
    >
      <View style={styles.gridButtonContent}>
        {renderGridVisual(option.rows, option.cols)}
      </View>
    </TouchableOpacity>
  );

  /**
   * renderImageSourceOption: Creates interactive image source selection button
   * @param {Object} option - Image source configuration from imageSourceOptions
   * @returns {JSX.Element} Touchable image source button
   *
   * Displays large emoji icons representing different image themes.
   * Provides immediate visual feedback through scaling and color changes.
   * No text labels - purely visual selection for non-reading children.
   */
  const renderImageSourceOption = (option) => (
    <TouchableOpacity
      key={option.value}
      style={[
        styles.imageSourceButton,
        // Apply selected styling if this option is chosen
        selectedImageSource === option.value && styles.selectedImageSourceButton
      ]}
      onPress={() => handleImageSourceSelection(option.value)}
    >
      <Text style={styles.imageSourceEmoji}>
        {option.label}
      </Text>
    </TouchableOpacity>
  );

  // === MAIN COMPONENT RENDER ===

  return (
    <View style={styles.container}>
      <View style={styles.content}>

        {/* STEP 1: GRID SIZE SELECTION */}
        {currentStep === 1 && (
          <View style={styles.stepContainer}>
            <View style={[
              styles.gridOptionsContainer,
              // Apply landscape-specific styling if in landscape mode
              isLandscape && styles.gridOptionsLandscape
            ]}>
              {gridOptions.map(renderGridOption)}
            </View>
          </View>
        )}

        {/* STEP 2: IMAGE SOURCE SELECTION */}
        {currentStep === 2 && (
          <View style={styles.stepContainer}>
            <View style={[
              styles.imageSourceContainer,
              // Apply landscape-specific styling if in landscape mode
              isLandscape && styles.imageSourceLandscape
            ]}>
              {imageSourceOptions.map(renderImageSourceOption)}
            </View>
          </View>
        )}

        {/* NAVIGATION BUTTONS (Only shown on step 2) */}
        {currentStep === 2 && (
          <View style={styles.buttonContainer}>

            {/* Back Button - Returns to grid size selection */}
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backButtonText}>⬅️</Text>
            </TouchableOpacity>

            {/* Next Button Container with Flash Animation */}
            <Animated.View style={[styles.nextButtonContainer, { opacity: flashAnim }]}>
              <TouchableOpacity
                style={[
                  styles.nextButton,
                  // Apply disabled styling if no image source selected
                  !selectedImageSource && styles.nextButtonDisabled
                ]}
                onPress={handleNext}
                disabled={!selectedImageSource}  // Prevent navigation without selection
              >
                <Text style={[
                  styles.nextButtonText,
                  // Apply disabled text styling if button is disabled
                  !selectedImageSource && styles.nextButtonTextDisabled
                ]}>
                  ➡️
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        )}
      </View>

      {/* Build Information for Development */}
      <BuildInfo />
    </View>
  );
}

// === STYLESHEET DEFINITIONS ===

/**
 * StyleSheet for HomeScreen Component
 *
 * Design Philosophy:
 * - Neutral colors (ready for theming)
 * - Large touch targets (minimum 60px for accessibility)
 * - Clear visual hierarchy with shadows and borders
 * - Responsive design with landscape-specific adjustments
 * - Child-friendly proportions and spacing
 */
const styles = StyleSheet.create({

  // === MAIN LAYOUT CONTAINERS ===

  /**
   * container: Root container for entire screen
   * Uses light gray background suitable for all age groups
   */
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },

  /**
   * content: Main content area with centered layout
   * Provides consistent padding and centers all elements
   */
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },

  /**
   * stepContainer: Container for each configuration step
   * Centers content vertically and horizontally within available space
   */
  stepContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // === GRID SIZE SELECTION STYLING ===

  /**
   * gridOptionsContainer: Container for grid size buttons
   * Default: Horizontal layout with space distribution
   * Portrait mode: Spreads buttons across available width
   */
  gridOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },

  /**
   * gridOptionsLandscape: Landscape-specific grid layout
   * Centers buttons with consistent spacing for better landscape experience
   */
  gridOptionsLandscape: {
    justifyContent: 'center',
    gap: 30,  // Fixed spacing between buttons
  },

  /**
   * gridButton: Individual grid size selection button
   * Large touch target with visual depth via shadows
   * Minimum size optimized for child interaction
   */
  gridButton: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 20,
    margin: 8,
    minWidth: 80,   // Ensures adequate touch area
    minHeight: 80,  // Minimum height for accessibility
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#dee2e6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,   // Android shadow equivalent
  },

  /**
   * selectedGridButton: Selected state styling for grid buttons
   * Blue theme with scaling animation to indicate selection
   */
  selectedGridButton: {
    backgroundColor: '#e3f2fd',  // Light blue background
    borderColor: '#2196f3',      // Blue border
    transform: [{ scale: 1.1 }], // 10% size increase for emphasis
  },

  /**
   * gridButtonContent: Content container within grid buttons
   * Centers the visual grid representation
   */
  gridButtonContent: {
    alignItems: 'center',
  },

  /**
   * gridVisual: Container for grid square visualization
   * Uses relative positioning to contain absolutely positioned squares
   */
  gridVisual: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },

  /**
   * gridSquare: Individual squares within grid visualization
   * Represents where game cards will be positioned
   * Dark gray color provides good contrast against white button background
   */
  gridSquare: {
    width: 12,
    height: 12,
    backgroundColor: '#6c757d',
    margin: 1,
    borderRadius: 2,  // Slightly rounded corners for friendlier appearance
  },

  /**
   * gridButtonText: Text styling for grid button labels
   * Note: Currently not used as text was removed for cleaner visual interface
   */
  gridButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#495057',
    textAlign: 'center',
  },

  /**
   * selectedGridButtonText: Text styling for selected grid buttons
   * Blue color to match selected button theme
   */
  selectedGridButtonText: {
    color: '#1976d2',
  },

  // === IMAGE SOURCE SELECTION STYLING ===

  /**
   * imageSourceContainer: Container for image source buttons
   * Uses flexWrap to accommodate multiple buttons in rows
   * Responsive layout that adapts to available space
   */
  imageSourceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',  // Allows buttons to wrap to new rows
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },

  /**
   * imageSourceLandscape: Landscape-specific image source layout
   * Centers buttons with consistent spacing for landscape orientation
   */
  imageSourceLandscape: {
    justifyContent: 'center',
    gap: 20,  // Fixed spacing between buttons
  },

  /**
   * imageSourceButton: Individual image source selection button
   * Larger than grid buttons to accommodate emoji display
   * 40% width ensures 2 buttons per row in portrait mode
   */
  imageSourceButton: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 20,
    margin: 8,
    width: '40%',      // Two buttons per row in portrait
    minHeight: 100,    // Adequate height for emoji display
    minWidth: 120,     // Minimum width for landscape mode
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#dee2e6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },

  /**
   * selectedImageSourceButton: Selected state for image source buttons
   * Green theme to differentiate from grid selection (blue)
   */
  selectedImageSourceButton: {
    backgroundColor: '#e8f5e8',   // Light green background
    borderColor: '#4caf50',       // Green border
    transform: [{ scale: 1.1 }],  // Scale animation for selection feedback
  },

  /**
   * imageSourceEmoji: Styling for emoji icons in image source buttons
   * Large size for easy recognition and child-friendly interaction
   */
  imageSourceEmoji: {
    fontSize: 40,  // Large emoji size for visibility
  },

  /**
   * imageSourceText: Text styling for image source descriptions
   * Note: Currently not used as descriptive text was removed
   */
  imageSourceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#495057',
    textAlign: 'center',
  },

  /**
   * selectedImageSourceText: Text styling for selected image source
   * Green color to match selected button theme
   */
  selectedImageSourceText: {
    color: '#388e3c',
  },

  // === NAVIGATION BUTTON STYLING ===

  /**
   * buttonContainer: Container for Back and Next buttons
   * Horizontal layout with space distribution and consistent spacing
   */
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 20,
    gap: 15,  // Consistent spacing between buttons
  },

  /**
   * backButton: Back navigation button
   * Circular design with gray theme to indicate secondary action
   * Fixed dimensions ensure consistent appearance
   */
  backButton: {
    backgroundColor: '#6c757d',  // Neutral gray background
    width: 60,                   // Fixed width for circular appearance
    height: 60,                  // Fixed height for circular appearance
    borderRadius: 30,            // Half of width/height for perfect circle
    borderWidth: 3,
    borderColor: '#495057',      // Darker gray border
    shadowColor: '#6c757d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /**
   * backButtonText: Text styling for back button emoji
   * Optimized for emoji rendering without font padding issues
   */
  backButtonText: {
    color: '#ffffff',
    fontSize: 24,
    textAlign: 'center',
  },

  /**
   * nextButtonContainer: Container for Next button with animation
   * Flex: 1 allows it to fill remaining space after Back button
   * Separated to isolate animation effects
   */
  nextButtonContainer: {
    flex: 1,
    marginLeft: 10,
  },

  /**
   * nextButton: Primary action button for proceeding to next screen
   * Blue theme indicates primary action, matching app color scheme
   * Horizontal expansion provides larger touch target
   */
  nextButton: {
    backgroundColor: '#007bff',   // Primary blue color
    height: 60,                   // Matches back button height
    borderRadius: 30,             // Rounded pill shape
    borderWidth: 3,
    borderColor: '#0056b3',       // Darker blue border
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,                // Prominent shadow for primary action
    justifyContent: 'center',
    alignItems: 'center',
  },

  /**
   * nextButtonDisabled: Disabled state styling for Next button
   * Gray theme with reduced shadow to indicate unavailable state
   */
  nextButtonDisabled: {
    backgroundColor: '#6c757d',
    borderColor: '#495057',
    shadowOpacity: 0,    // Remove shadow for disabled state
    elevation: 0,        // Remove Android shadow
  },

  /**
   * nextButtonText: Text styling for Next button emoji
   * Optimized for clear emoji rendering and accessibility
   */
  nextButtonText: {
    color: '#ffffff',
    fontSize: 24,
    textAlign: 'center',
  },

  /**
   * nextButtonTextDisabled: Text styling for disabled Next button
   * Muted color to indicate unavailable state
   */
  nextButtonTextDisabled: {
    color: '#adb5bd',
  },
});