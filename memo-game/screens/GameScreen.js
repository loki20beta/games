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
import { View, Text, StyleSheet, Dimensions, SafeAreaView, TouchableOpacity } from 'react-native';
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
  const cardDimensions = calculateCardDimensions(screenDimensions, gridConfig);

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
    <SafeAreaView style={styles.container}>
      {/* Game Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Memory Game</Text>
        <Text style={styles.gridInfo}>{gridSize} • {imageSource}</Text>
      </View>

      {/* Game Board */}
      <View style={styles.gameBoard}>
        <View style={[styles.gameGrid, {
          width: cardDimensions.gridWidth,
          height: cardDimensions.gridHeight
        }]}>
          {gameCards.map((card, index) => (
            <View
              key={card.id}
              style={[
                styles.cardWrapper,
                {
                  marginHorizontal: cardDimensions.margin / 2,
                  marginVertical: cardDimensions.margin / 2,
                }
              ]}
            >
              <Card
                card={card}
                onPress={handleCardPress}
                cardSize={cardDimensions.cardSize}
                disabled={isProcessing}
              />
            </View>
          ))}
        </View>
      </View>

      {/* Game Controls */}
      <View style={styles.controls}>
        <Text style={[styles.gameStatus, gameWon && styles.gameWonStatus]}>
          {gameWon
            ? '🎉 Congratulations! You won!'
            : `${matchedPairs} of ${gameCards.length / 2} pairs matched`
          }
          {isProcessing && !gameWon && ' • Processing...'}
        </Text>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.restartButton]}
            onPress={handleRestart}
          >
            <Text style={styles.actionButtonText}>🔄 Restart</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.newGameButton]}
            onPress={handleNewGame}
          >
            <Text style={styles.actionButtonText}>🖼️ New Images</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.homeButton]}
            onPress={handleBackToHome}
          >
            <Text style={styles.actionButtonText}>🏠 Home</Text>
          </TouchableOpacity>
        </View>
      </View>

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
 * Calculate responsive card dimensions based on screen size and grid configuration
 * @param {Object} screenDimensions - Screen width and height
 * @param {Object} gridConfig - Grid configuration (rows, columns)
 * @returns {Object} Card sizing and spacing information
 */
function calculateCardDimensions(screenDimensions, gridConfig) {
  const { width: screenWidth, height: screenHeight } = screenDimensions;
  const { rows, columns } = gridConfig;

  // Reserve space for header, controls, and padding
  const headerHeight = 80;
  const controlsHeight = 120; // Increased to accommodate buttons
  const buildInfoHeight = 40;
  const verticalPadding = 40;

  const availableWidth = screenWidth - 40; // 20px padding on each side
  const availableHeight = screenHeight - headerHeight - controlsHeight - buildInfoHeight - verticalPadding;

  // Calculate card size based on available space
  const maxCardWidth = (availableWidth - (columns - 1) * 8) / columns; // 8px margin between cards
  const maxCardHeight = (availableHeight - (rows - 1) * 8) / rows;

  // Use the smaller dimension to ensure cards are square and fit in both dimensions
  const cardSize = Math.min(maxCardWidth, maxCardHeight, 120); // Max 120px for larger grids

  // Calculate actual grid dimensions
  const margin = 8;
  const gridWidth = (cardSize * columns) + (margin * (columns - 1));
  const gridHeight = (cardSize * rows) + (margin * (rows - 1));

  return {
    cardSize: Math.floor(cardSize),
    margin,
    gridWidth,
    gridHeight,
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
   * header: Game screen header with title and configuration info
   */
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'center',
    height: 80,
  },

  /**
   * title: Main game title
   */
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },

  /**
   * gridInfo: Shows current grid size and image source
   */
  gridInfo: {
    fontSize: 14,
    color: '#6c757d',
    textTransform: 'capitalize',
  },

  /**
   * gameBoard: Main game area container
   */
  gameBoard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  /**
   * gameGrid: Container for the card grid layout
   */
  gameGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /**
   * cardWrapper: Wrapper for individual cards with spacing
   */
  cardWrapper: {
    // Dynamic margins set in component
  },


  /**
   * controls: Game controls and status area
   */
  controls: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
    height: 120,
  },

  /**
   * gameStatus: Current game status text
   */
  gameStatus: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
  },

  /**
   * gameWonStatus: Special styling for win message
   */
  gameWonStatus: {
    color: '#28a745',
    fontWeight: 'bold',
    fontSize: 16,
  },

  /**
   * actionButtons: Container for game action buttons
   */
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },

  /**
   * actionButton: Base styling for action buttons
   */
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },

  /**
   * actionButtonText: Text styling for action buttons
   */
  actionButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },

  /**
   * restartButton: Restart game button styling
   */
  restartButton: {
    backgroundColor: '#17a2b8',
  },

  /**
   * newGameButton: New game button styling
   */
  newGameButton: {
    backgroundColor: '#28a745',
  },

  /**
   * homeButton: Home button styling
   */
  homeButton: {
    backgroundColor: '#6c757d',
  },
});