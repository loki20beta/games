/**
 * GameScreen.js - Main Memory Game Interface
 *
 * This screen contains the core memory game functionality where users play
 * the matching game with their selected images and grid configuration.
 *
 * Current Status: BASIC IMPLEMENTATION IN PROGRESS
 *
 * Implemented Functionality:
 * - Receives complete game configuration from SelectionScreen
 * - Generates game board with selected images in chosen grid layout
 * - Dynamic grid layouts for 2x2, 4x4, 6x6 configurations
 * - Responsive card sizing and spacing
 *
 * TODO - Next Features:
 * - Implement Card component with flip animations
 * - Add card tap interactions and game logic
 * - Implement match detection and win conditions
 * - Add sound effects and haptic feedback
 * - Create win screen and restart functionality
 *
 * Navigation Flow:
 * - Previous: SelectionScreen (via restart/back)
 * - Next: Win screen or restart to HomeScreen
 *
 * Expected Props from Navigation:
 * - gridSize: '2x2' | '4x4' | '6x6'
 * - imageSource: 'emoji' | 'gallery' | 'peppa' | 'bluey'
 * - selectedImages: Array of chosen images in universal format
 * - totalCards: number for grid layout (4, 16, or 36)
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import BuildInfo from '../components/BuildInfo';
import Card from '../components/Card';

/**
 * GameScreen Component - Main Memory Game Interface
 *
 * Receives game configuration from SelectionScreen and creates the memory game board.
 * Implements responsive grid layouts and prepares game cards for interaction.
 *
 * @param {Object} route - Navigation route containing complete game configuration
 * @param {Object} navigation - Navigation object for screen transitions
 * @returns {JSX.Element} The memory game interface with dynamic grid
 */
export default function GameScreen({ route, navigation }) {
  // Extract complete game configuration from navigation
  const { gridSize, imageSource, selectedImages, totalCards } = route.params || {};

  // Game state management
  const [gameCards, setGameCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [screenDimensions, setScreenDimensions] = useState(Dimensions.get('window'));

  // Safe area visualization
  const insets = useSafeAreaInsets();

  // Parse grid configuration
  const gridConfig = getGridConfiguration(gridSize);

  /**
   * Initialize game board when component mounts or configuration changes
   */
  useEffect(() => {
    if (selectedImages && selectedImages.length > 0) {
      const cards = createGameCards(selectedImages, totalCards);
      setGameCards(cards);
    }
  }, [selectedImages, totalCards]);

  /**
   * Update dimensions on orientation changes
   */
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenDimensions(window);
    });
    return () => subscription?.remove();
  }, []);

  /**
   * Check for win condition when matched pairs change
   */
  useEffect(() => {
    if (gameCards.length > 0 && matchedPairs > 0) {
      const totalPairs = gameCards.length / 2;
      if (matchedPairs === totalPairs) {
        setGameWon(true);
        // TODO: Show win celebration animation
        // TODO: Play win sound effect
        console.log('🎉 Game won!');
      }
    }
  }, [matchedPairs, gameCards.length]);

  // Calculate responsive card dimensions
  const cardDimensions = calculateCardDimensions(screenDimensions, gridConfig, insets);

  /**
   * Handle card press - implement basic flip logic
   * @param {Object} card - The card that was pressed
   */
  const handleCardPress = (card) => {
    // Prevent interaction if processing or card already flipped/matched
    if (isProcessing || card.isFlipped || card.isMatched) {
      return;
    }

    // If two cards are already flipped, don't allow more
    if (flippedCards.length >= 2) {
      return;
    }

    // Flip the card
    const updatedCards = gameCards.map(c =>
      c.id === card.id ? { ...c, isFlipped: true } : c
    );
    setGameCards(updatedCards);

    const newFlippedCards = [...flippedCards, card.id];
    setFlippedCards(newFlippedCards);

    // If this is the second card flipped, check for match
    if (newFlippedCards.length === 2) {
      setIsProcessing(true);

      // Get the two flipped card objects
      const card1 = updatedCards.find(c => c.id === newFlippedCards[0]);
      const card2 = updatedCards.find(c => c.id === newFlippedCards[1]);

      // Check if they match (same pairId)
      if (card1.pairId === card2.pairId) {
        // Match found! Mark cards as matched
        setTimeout(() => {
          setGameCards(prevCards => {
            const matchedCards = prevCards.map(c =>
              (c.id === card1.id || c.id === card2.id)
                ? { ...c, isMatched: true }
                : c
            );
            return matchedCards;
          });
          setFlippedCards([]);
          setMatchedPairs(prev => prev + 1);
          setIsProcessing(false);

          // TODO: Play match sound effect
        }, 800);
      } else {
        // No match - flip cards back after delay
        setTimeout(() => {
          setGameCards(prevCards => {
            const flippedBackCards = prevCards.map(c =>
              (c.id === card1.id || c.id === card2.id)
                ? { ...c, isFlipped: false }
                : c
            );
            return flippedBackCards;
          });
          setFlippedCards([]);
          setIsProcessing(false);

          // TODO: Play mismatch sound effect
        }, 1500);
      }
    }
  };

  /**
   * Restart the current game with same configuration
   */
  const handleRestart = () => {
    if (selectedImages && selectedImages.length > 0) {
      const cards = createGameCards(selectedImages, totalCards);
      setGameCards(cards);
      setFlippedCards([]);
      setIsProcessing(false);
      setMatchedPairs(0);
      setGameWon(false);
    }
  };

  /**
   * Go back to selection screen to pick new images
   */
  const handleNewGame = () => {
    navigation.goBack();
  };

  /**
   * Go back to home screen to change grid size or image source
   */
  const handleBackToHome = () => {
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* 
        SAFE AREA VISUALIZATION (DEBUGGING TOOL - COMMENTED OUT)
        
        This red rectangle overlay was used to visualize the safe area boundaries
        and verify that our grid calculations matched the actual available space.
        
        Key findings from this visualization:
        - Safe area insets don't account for navigation header and status bar
        - In landscape mode, status bar is hidden but navigation header remains
        - Physical pixel measurements helped reconcile React Native logical pixels
        - Red rectangle height vs card grid height comparison revealed unused space
        
        Usage: Uncomment to debug safe area calculations
      */}
      {/* <View style={[
        styles.safeAreaVisualization,
        {
          top: insets.top,
          left: insets.left,
          right: insets.right,
          bottom: insets.bottom,
        }
      ]} /> */}

      {/* Game Board */}
      <View style={[styles.gameBoard, {
        // Position the game board to fill the safe area
        position: 'absolute',
        top: insets.top,
        left: insets.left,
        right: insets.right,
        bottom: insets.bottom,
      }]}>
        <View style={[styles.gameGrid, {
          // Grid should fill the entire safe area exactly
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          // Ensure grid container constrains card height
          overflow: 'hidden',
          // 
          // GREEN DEBUG BORDER (COMMENTED OUT)
          // This green border was used to visualize the grid container boundaries
          // and verify that cards were positioned correctly within the grid.
          // 
          // Key findings from this visualization:
          // - Grid container should exactly match the red safe area rectangle
          // - Cards should fill the entire grid container without overflow
          // - Absolute positioning ensures precise card placement
          // 
          // Usage: Uncomment to debug grid container boundaries
          // borderWidth: 2,
          // borderColor: '#00ff00',
        }]}>
          {gameCards.map((card, index) => {
            const row = Math.floor(index / gridConfig.columns);
            const col = index % gridConfig.columns;
            
            // Calculate exact position for each card within the full grid container
            // Position cards to fill the entire grid container space
            const left = col * (cardDimensions.cardWidth + cardDimensions.margin);
            const top = row * (cardDimensions.cardHeight + cardDimensions.margin);
            
            return (
              <View
                key={card.id}
                style={[
                  styles.cardWrapper,
                  {
                    position: 'absolute',
                    left: left,
                    top: top,
                    width: cardDimensions.cardWidth,
                    height: cardDimensions.cardHeight,
                  }
                ]}
              >
                <Card
                  card={card}
                  onPress={handleCardPress}
                  cardWidth={cardDimensions.cardWidth}
                  cardHeight={cardDimensions.cardHeight}
                  disabled={isProcessing}
                />
              </View>
            );
          })}
        </View>
      </View>

      {/* 
        DEBUG INFORMATION DISPLAY (COMMENTED OUT)
        
        This debug overlay was used to display real-time calculations and measurements
        during development to verify that our card sizing and positioning was correct.
        
        Key information displayed:
        - Grid dimensions and card sizes in logical and physical pixels
        - Available space calculations after safe area and UI element adjustments
        - Margin calculations and last card position verification
        - Safe area inset values for debugging layout issues
        
        Usage: Uncomment to debug card calculations and measurements
      */}
      {/* <View style={styles.debugInfo}>
        <Text style={styles.debugText}>
          Grid: {gridSize} | Cards: {cardDimensions.cardWidth}x{cardDimensions.cardHeight} | 
          Available: {cardDimensions.availableWidth}x{cardDimensions.availableHeight}
        </Text>
        <Text style={styles.debugText}>
          Margins: {cardDimensions.margin} | Last Card Pos: {((gridConfig.columns - 1) * (cardDimensions.cardWidth + cardDimensions.margin) + cardDimensions.cardWidth)}x{((gridConfig.rows - 1) * (cardDimensions.cardHeight + cardDimensions.margin) + cardDimensions.cardHeight)}
        </Text>
        <Text style={styles.debugText}>
          Grid fills entire safe area - no size calculation needed
        </Text>
        <Text style={styles.debugText}>
          Safe Area: T:{insets.top} L:{insets.left} R:{insets.right} B:{insets.bottom}
        </Text>
      </View> */}

      {/* Build Information for Development */}
      <BuildInfo />
    </SafeAreaView>
  );
}

/**
 * Get grid configuration based on selected grid size
 * @param {string} gridSize - Grid size ('2x2' | '4x4' | '6x6')
 * @returns {Object} Grid configuration with rows, columns, and totalCards
 */
function getGridConfiguration(gridSize) {
  const configs = {
    '2x2': { rows: 2, columns: 2, totalCards: 4 },
    '4x4': { rows: 4, columns: 4, totalCards: 16 },
    '6x6': { rows: 6, columns: 6, totalCards: 36 },
  };
  return configs[gridSize] || configs['2x2'];
}

/**
 * Create game cards array with pairs and shuffling
 * @param {Array} selectedImages - Array of selected images from SelectionScreen
 * @param {number} totalCards - Total number of cards needed for grid
 * @returns {Array} Array of game card objects with image pairs
 */
function createGameCards(selectedImages, totalCards) {
  const pairsNeeded = totalCards / 2;

  // Take only the number of images needed for pairs
  const imagesToUse = selectedImages.slice(0, pairsNeeded);

  // Create pairs of each image
  const cardPairs = [];
  imagesToUse.forEach((image, index) => {
    // Create two cards for each image (a pair)
    cardPairs.push(
      {
        id: `card_${index}_a`,
        pairId: index,
        image: image,
        isFlipped: false,
        isMatched: false,
      },
      {
        id: `card_${index}_b`,
        pairId: index,
        image: image,
        isFlipped: false,
        isMatched: false,
      }
    );
  });

  // Shuffle the cards using Fisher-Yates algorithm
  const shuffledCards = [...cardPairs];
  for (let i = shuffledCards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledCards[i], shuffledCards[j]] = [shuffledCards[j], shuffledCards[i]];
  }

  return shuffledCards;
}

/**
 * Calculate responsive card dimensions based on screen size, safe area, and grid configuration
 * Ensures proper rectangular grid formation within safe area boundaries
 * @param {Object} screenDimensions - Screen width and height
 * @param {Object} gridConfig - Grid configuration (rows, columns)
 * @param {Object} insets - Safe area insets from useSafeAreaInsets
 * @returns {Object} Card sizing and spacing information
 */
function calculateCardDimensions(screenDimensions, gridConfig, insets) {
  /*
    CARD SIZE CALCULATION FUNCTION
    
    This function calculates the optimal card dimensions to fill the entire safe area
    while accounting for UI elements not included in safe area insets.
    
    DEBUGGING TOOLS USED DURING DEVELOPMENT:
    - Step-by-step console logging to trace calculation process
    - Physical pixel conversion to reconcile with screenshot measurements
    - Orientation-specific UI element adjustments
    - Height constraint analysis to identify unused space
    
    Key findings from debugging:
    - Safe area insets don't account for navigation header and status bar
    - In landscape mode, status bar is hidden but navigation header remains
    - Cards need exact height calculation to fill available space completely
    - Physical pixel measurements helped identify calculation discrepancies
    
    Usage: Uncomment console.log statements to debug card calculations
  */
  
  const { width: screenWidth, height: screenHeight } = screenDimensions;
  const { rows, columns } = gridConfig;
  
  // Get device pixel ratio to convert to physical pixels (for debugging)
  const { PixelRatio } = require('react-native');
  const pixelRatio = PixelRatio.get();
  const physicalWidth = screenWidth * pixelRatio;
  const physicalHeight = screenHeight * pixelRatio;
  
  // DEBUGGING: Uncomment to trace calculation process
  // console.log('=== CARD SIZE CALCULATION STEP BY STEP ===');
  // console.log('Step 1 - Input values:');
  // console.log('  screenWidth (logical pixels):', screenWidth);
  // console.log('  screenHeight (logical pixels):', screenHeight);
  // console.log('  rows:', rows);
  // console.log('  columns:', columns);
  // console.log('  insets:', insets);
  // console.log('  Device pixel ratio:', pixelRatio);
  // console.log('  Physical width (actual pixels):', physicalWidth);
  // console.log('  Physical height (actual pixels):', physicalHeight);

  // Calculate available space within safe area
  const availableWidth = screenWidth - insets.left - insets.right;
  const availableHeight = screenHeight - insets.top - insets.bottom;
  
  // Manual adjustment for UI elements not accounted for in safe area insets
  // Status bar (clock, battery, signal icons) + Navigation header
  const statusBarHeight = 44; // Status bar height in logical pixels
  const navigationHeaderHeight = 50; // Navigation header height in logical pixels
  
  // In horizontal orientation, status bar is not visible
  const isLandscape = screenWidth > screenHeight;
  const totalUIHeight = isLandscape ? navigationHeaderHeight : statusBarHeight + navigationHeaderHeight;
  const adjustedAvailableHeight = availableHeight - totalUIHeight;
  
  // DEBUGGING: Uncomment to trace available space calculations
  // console.log('Step 2 - Available space calculation:');
  // console.log('  availableWidth = screenWidth - insets.left - insets.right');
  // console.log('  availableWidth =', screenWidth, '-', insets.left, '-', insets.right, '=', availableWidth);
  // console.log('  availableHeight = screenHeight - insets.top - insets.bottom');
  // console.log('  availableHeight =', screenHeight, '-', insets.top, '-', insets.bottom, '=', availableHeight);
  // console.log('  availableWidth (physical pixels):', Math.floor(availableWidth * pixelRatio));
  // console.log('  availableHeight (physical pixels):', Math.floor(availableHeight * pixelRatio));
  // console.log('  Orientation:', isLandscape ? 'LANDSCAPE' : 'PORTRAIT');
  // console.log('  statusBarHeight (logical):', statusBarHeight, '→ (physical):', Math.floor(statusBarHeight * pixelRatio));
  // console.log('  navigationHeaderHeight (logical):', navigationHeaderHeight, '→ (physical):', Math.floor(navigationHeaderHeight * pixelRatio));
  // console.log('  totalUIHeight (logical):', totalUIHeight, '→ (physical):', Math.floor(totalUIHeight * pixelRatio));
  // console.log('  UI adjustment:', isLandscape ? 'Only navigation header (status bar hidden)' : 'Status bar + navigation header');
  // console.log('  adjustedAvailableHeight (logical):', adjustedAvailableHeight);
  // console.log('  adjustedAvailableHeight (physical pixels):', Math.floor(adjustedAvailableHeight * pixelRatio));
  
  // DEBUGGING: Uncomment to analyze safe area insets
  // console.log('Step 2.1 - Insets analysis:');
  // console.log('  insets.top (logical):', insets.top, '→ (physical):', Math.floor(insets.top * pixelRatio));
  // console.log('  insets.bottom (logical):', insets.bottom, '→ (physical):', Math.floor(insets.bottom * pixelRatio));
  // console.log('  insets.left (logical):', insets.left, '→ (physical):', Math.floor(insets.left * pixelRatio));
  // console.log('  insets.right (logical):', insets.right, '→ (physical):', Math.floor(insets.right * pixelRatio));
  // console.log('  Total insets height (logical):', insets.top + insets.bottom, '→ (physical):', Math.floor((insets.top + insets.bottom) * pixelRatio));
  // console.log('  Total insets width (logical):', insets.left + insets.right, '→ (physical):', Math.floor((insets.left + insets.right) * pixelRatio));
  // 
  // console.log('Step 2.2 - Verification:');
  // console.log('  Expected safe area height (physical): ~2260');
  // console.log('  Calculated safe area height (physical):', Math.floor(availableHeight * pixelRatio));
  // console.log('  Difference:', Math.floor(availableHeight * pixelRatio) - 2260, 'pixels');
  // console.log('  This suggests insets might be missing some UI elements or incorrect');

  // Calculate card dimensions that fill the available space
  const margin = 4; // Margin between cards
  
  // DEBUGGING: Uncomment to trace card dimension calculations
  // console.log('Step 3 - Card dimension calculation:');
  // console.log('  margin:', margin);
  
  // Calculate maximum possible card dimensions to fill the entire safe area
  // Use adjusted height to account for navigation header
  // Cards should fill the available space optimally in both orientations
  const maxCardWidth = (availableWidth - (columns - 1) * margin) / columns;
  const maxCardHeight = (adjustedAvailableHeight - (rows - 1) * margin) / rows;
  
  // DEBUGGING: Uncomment to analyze orientation-specific calculations
  // console.log('Step 3.1 - Orientation analysis:');
  // console.log('  Screen orientation:', screenWidth > screenHeight ? 'LANDSCAPE' : 'PORTRAIT');
  // console.log('  availableWidth:', availableWidth, '→ (physical):', Math.floor(availableWidth * pixelRatio));
  // console.log('  adjustedAvailableHeight:', adjustedAvailableHeight, '→ (physical):', Math.floor(adjustedAvailableHeight * pixelRatio));
  // console.log('  In landscape, availableHeight becomes the "width" for card calculations');
  // console.log('  In landscape, availableWidth becomes the "height" for card calculations');
  // 
  // console.log('  maxCardWidth calculation:');
  // console.log('    (availableWidth - (columns - 1) * margin) / columns');
  // console.log('    (', availableWidth, '- (', columns, '- 1) *', margin, ') /', columns);
  // console.log('    (', availableWidth, '-', (columns - 1), '*', margin, ') /', columns);
  // console.log('    (', availableWidth - (columns - 1) * margin, ') /', columns, '=', maxCardWidth);
  // 
  // console.log('  maxCardHeight calculation:');
  // console.log('    (adjustedAvailableHeight - (rows - 1) * margin) / rows');
  // console.log('    (', adjustedAvailableHeight, '- (', rows, '- 1) *', margin, ') /', rows);
  // console.log('    (', adjustedAvailableHeight, '-', (rows - 1), '*', margin, ') /', rows);
  // console.log('    (', adjustedAvailableHeight - (rows - 1) * margin, ') /', rows, '=', maxCardHeight);
  
  // Ensure minimum viable card size for usability
  const minCardSize = 30;
  
  // DEBUGGING: Uncomment to trace minimum size constraints
  // console.log('Step 4 - Apply minimum size constraint:');
  // console.log('  minCardSize:', minCardSize);
  
  // Calculate final card dimensions - ensure they fit within the available space
  const finalCardWidth = Math.max(maxCardWidth, minCardSize);
  const finalCardHeight = Math.max(maxCardHeight, minCardSize);
  
  // DEBUGGING: Uncomment to trace final card dimensions
  // console.log('  finalCardWidth = Math.max(maxCardWidth, minCardSize)');
  // console.log('  finalCardWidth = Math.max(', maxCardWidth, ',', minCardSize, ') =', finalCardWidth);
  // console.log('  finalCardHeight = Math.max(maxCardHeight, minCardSize)');
  // console.log('  finalCardHeight = Math.max(', maxCardHeight, ',', minCardSize, ') =', finalCardHeight);
  
  // Ensure cards fill the entire available space
  // Calculate the exact height each card should have to fill all available space
  // Use adjusted height to account for navigation header
  const totalMarginHeight = (rows - 1) * margin;
  const availableHeightForCards = adjustedAvailableHeight - totalMarginHeight;
  const exactCardHeightPerRow = availableHeightForCards / rows;
  
  // Use the exact calculated height instead of constraining it
  const constrainedCardHeight = exactCardHeightPerRow;
  
  // DEBUGGING: Uncomment to analyze height constraints and unused space
  // console.log('Step 5.1 - Height constraint analysis:');
  // console.log('  totalMarginHeight:', totalMarginHeight);
  // console.log('  availableHeightForCards:', availableHeightForCards, '→ (physical):', Math.floor(availableHeightForCards * pixelRatio));
  // console.log('  exactCardHeightPerRow:', exactCardHeightPerRow, '→ (physical):', Math.floor(exactCardHeightPerRow * pixelRatio));
  // console.log('  finalCardHeight (before constraint):', finalCardHeight, '→ (physical):', Math.floor(finalCardHeight * pixelRatio));
  // console.log('  constrainedCardHeight (exact):', constrainedCardHeight, '→ (physical):', Math.floor(constrainedCardHeight * pixelRatio));
  // 
  // // Calculate total grid height to see if it matches available space
  // const totalGridHeight = (constrainedCardHeight * rows) + (margin * (rows - 1));
  // const unusedHeight = availableHeightForCards - totalGridHeight;
  // console.log('  totalGridHeight:', totalGridHeight, '→ (physical):', Math.floor(totalGridHeight * pixelRatio));
  // console.log('  unusedHeight:', unusedHeight, '→ (physical):', Math.floor(unusedHeight * pixelRatio));
  // console.log('  This unused height is the empty space below cards');
  // 
  // console.log('Step 5 - Apply height constraint:');
  // console.log('  totalMarginHeight = (rows - 1) * margin');
  // console.log('  totalMarginHeight = (', rows, '- 1) *', margin, '=', totalMarginHeight);
  // console.log('  availableHeightForCards = adjustedAvailableHeight - totalMarginHeight');
  // console.log('  availableHeightForCards =', adjustedAvailableHeight, '-', totalMarginHeight, '=', availableHeightForCards);
  // console.log('  maxCardHeightPerRow = availableHeightForCards / rows');
  // console.log('  maxCardHeightPerRow =', availableHeightForCards, '/', rows, '=', maxCardHeightPerRow);
  // console.log('  constrainedCardHeight = Math.min(finalCardHeight, maxCardHeightPerRow)');
  // console.log('  constrainedCardHeight = Math.min(', finalCardHeight, ',', maxCardHeightPerRow, ') =', constrainedCardHeight);
  // 
  // console.log('Step 6 - Final result:');
  // console.log('  cardWidth (logical pixels):', Math.floor(finalCardWidth));
  // console.log('  cardHeight (logical pixels):', Math.floor(constrainedCardHeight));
  // console.log('  cardWidth (physical pixels):', Math.floor(finalCardWidth * pixelRatio));
  // console.log('  cardHeight (physical pixels):', Math.floor(constrainedCardHeight * pixelRatio));
  // console.log('=== END CALCULATION ===\n');
  
  // Grid will fill the entire safe area, so no need to calculate grid dimensions
  // Cards will be positioned absolutely within the full-size grid container

  return {
    cardWidth: Math.floor(finalCardWidth),
    cardHeight: Math.floor(constrainedCardHeight), // Use constrained height to fit within available space
    margin,
    availableWidth,
    availableHeight,
  };
}

/**
 * Game screen styles with responsive layouts
 */
const styles = StyleSheet.create({
  /**
   * container: Root container for full-screen game interface
   */
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },


  /**
   * gameBoard: Main game area container
   */
  gameBoard: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // Prevent overflow
  },

  /**
   * gameGrid: Container for the card grid layout
   */
  gameGrid: {
    position: 'relative',
  },

  /**
   * cardWrapper: Wrapper for individual cards with spacing
   */
  cardWrapper: {
    // Dynamic dimensions and margins set in component
  },

  /*
    DEBUGGING STYLES (COMMENTED OUT)
    
    These styles were used for debugging layout issues during development:
    
    1. safeAreaVisualization: Light red overlay to visualize safe area boundaries
       - Used to verify that our grid calculations matched the actual available space
       - Helped identify discrepancies between calculated and measured dimensions
       - Key finding: Safe area insets don't account for navigation header and status bar
    
    2. debugInfo: Black overlay with white text showing real-time calculations
       - Displayed card dimensions, available space, margins, and safe area insets
       - Helped trace step-by-step calculations during development
       - Physical pixel conversion helped reconcile with screenshot measurements
    
    3. debugText: Monospace font for aligned debug information display
    
    Usage: Uncomment these styles to re-enable debugging visualizations
  */
  
  // === SAFE AREA VISUALIZATION STYLING ===
  // safeAreaVisualization: {
  //   position: 'absolute',
  //   backgroundColor: 'rgba(255, 0, 0, 0.3)',
  //   borderWidth: 2,
  //   borderColor: '#ff0000',
  //   zIndex: 999,
  // },

  // === DEBUG INFORMATION STYLING ===
  // debugInfo: {
  //   position: 'absolute',
  //   bottom: 50,
  //   left: 10,
  //   right: 10,
  //   backgroundColor: 'rgba(0, 0, 0, 0.8)',
  //   padding: 8,
  //   borderRadius: 4,
  // },
  // debugText: {
  //   color: 'white',
  //   fontSize: 10,
  //   fontFamily: 'monospace',
  //   marginBottom: 2,
  // },

});