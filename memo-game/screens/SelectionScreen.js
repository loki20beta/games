/**
 * SelectionScreen.js - Custom Carousel-Based Image Selection Interface
 *
 * This screen implements a custom carousel/slider interface for selecting images
 * in the memory game. Features dynamic scaling, smooth animations, and intuitive
 * touch interactions designed for children ages 3+.
 *
 * Key Features:
 * - Horizontal carousel with momentum scrolling and acceleration
 * - Dynamic scaling (center item largest, sides progressively smaller)
 * - Top selection area that adapts to grid size requirements
 * - Smooth animations for selection/deselection
 * - Universal interface for emojis, photos, and themed content
 *
 * Navigation Flow:
 * - Receives configuration from HomeScreen via route params
 * - Auto-navigates to GameScreen when required images are selected
 * - Back button returns to HomeScreen with state preserved
 *
 * Design Implementation:
 * - Based on specifications in docs/ui-for-image-selection.md
 * - 5-level scaling system (100% center, 25% edges)
 * - Touch-friendly interface optimized for small fingers
 * - Responsive layout supporting both portrait and landscape
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  PanResponder
} from 'react-native';
import { getAllEmojis } from '../data/emojiData';

/**
 * SelectionScreen Component - Custom Carousel Image Selection
 *
 * Implements the custom carousel interface specified in the design document.
 * Handles emoji selection with dynamic scaling, smooth animations, and
 * intuitive touch interactions suitable for children.
 *
 * @param {Object} route - Navigation route containing game configuration
 * @param {Object} navigation - Navigation object for screen transitions
 * @returns {JSX.Element} The custom carousel selection interface
 */
export default function SelectionScreen({ route, navigation }) {
  // Extract navigation parameters from HomeScreen
  const { gridSize, imageSource, requiredImages, totalCards } = route.params;

  // Screen dimensions for responsive layout
  const [screenData, setScreenData] = useState(Dimensions.get('window'));
  const isLandscape = screenData.width > screenData.height;

  // Carousel state management
  const [availableEmojis, setAvailableEmojis] = useState(getAllEmojis());
  const [selectedEmojis, setSelectedEmojis] = useState([]);
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Animation references
  const scrollViewRef = useRef(null);
  const carouselPosition = useRef(new Animated.Value(0)).current;
  const selectionAnimations = useRef(new Map()).current;
  const flashAnim = useRef(new Animated.Value(1)).current;

  // Constants for carousel behavior
  const ITEM_SIZE = 80; // Center item size
  const ITEM_SPACING = 20; // Space between items
  const VISIBLE_ITEMS = 5; // Number of visible items

  // Listen for screen orientation changes
  useEffect(() => {
    const onChange = (result) => {
      setScreenData(result.window);
    };

    const subscription = Dimensions.addEventListener('change', onChange);
    return () => subscription?.remove();
  }, []);

  // Start flashing animation when selection is complete
  useEffect(() => {
    if (selectedEmojis.length === requiredImages) {
      startFlashAnimation();
    } else {
      stopFlashAnimation();
    }
  }, [selectedEmojis.length, requiredImages]);

  /**
   * Start flashing animation for Next button
   * Matches HomeScreen animation behavior
   */
  const startFlashAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(flashAnim, { duration: 500, toValue: 0.3, useNativeDriver: true }),
        Animated.timing(flashAnim, { duration: 500, toValue: 1, useNativeDriver: true }),
      ])
    ).start();
  };

  /**
   * Stop flashing animation and reset opacity
   */
  const stopFlashAnimation = () => {
    flashAnim.stopAnimation();
    flashAnim.setValue(1);
  };

  /**
   * Handle Next button press to navigate to GameScreen
   * Only enabled when sufficient images are selected
   */
  const handleNext = () => {
    if (selectedEmojis.length === requiredImages) {
      stopFlashAnimation();
      navigation.navigate('Game', {
        gridSize,
        imageSource,
        selectedEmojis,
        totalCards
      });
    }
  };

  /**
   * Calculate scaling factor based on item position relative to center
   * Implements 5-level scaling system from design specification
   *
   * @param {number} index - Item index in carousel
   * @param {number} centerIndex - Current center item index
   * @returns {number} Scale factor (0.25 to 1.0)
   */
  const getScaleFactor = (index, centerIndex) => {
    const distance = Math.abs(index - centerIndex);
    switch (distance) {
      case 0: return 1.0;    // Center: 100%
      case 1: return 0.75;   // Adjacent: 75%
      case 2: return 0.5;    // Secondary: 50%
      default: return 0.25;  // Peripheral: 25%
    }
  };

  /**
   * Calculate opacity for fade effect on peripheral items
   * Enhances depth perception in carousel
   *
   * @param {number} index - Item index in carousel
   * @param {number} centerIndex - Current center item index
   * @returns {number} Opacity value (0.3 to 1.0)
   */
  const getOpacity = (index, centerIndex) => {
    const distance = Math.abs(index - centerIndex);
    return Math.max(0.3, 1 - (distance * 0.2));
  };

  /**
   * Handle emoji selection from carousel
   * Animates item from carousel to selection area and removes from available items
   *
   * @param {Object} emoji - Emoji object to select
   * @param {number} index - Index of emoji in available array
   */
  const handleEmojiSelect = (emoji, index) => {
    // Prevent selection if already at limit
    if (selectedEmojis.length >= requiredImages) return;

    // Create selection animation
    const animValue = new Animated.Value(0);
    selectionAnimations.set(emoji.id, animValue);

    // Animate selection transition
    Animated.timing(animValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Update state after animation starts
    setTimeout(() => {
      setSelectedEmojis(prev => [...prev, emoji]);
      setAvailableEmojis(prev => prev.filter(item => item.id !== emoji.id));
      selectionAnimations.delete(emoji.id);
    }, 150); // Halfway through animation
  };

  /**
   * Handle emoji deselection from selection area
   * Returns emoji to carousel and removes from selected items
   *
   * @param {Object} emoji - Emoji object to deselect
   * @param {number} index - Index of emoji in selected array
   */
  const handleEmojiDeselect = (emoji, index) => {
    // Remove from selected and return to available
    setSelectedEmojis(prev => prev.filter(item => item.id !== emoji.id));
    setAvailableEmojis(prev => [...prev, emoji].sort((a, b) => a.id - b.id));
  };

  /**
   * Handle carousel scroll to update center index
   * Enables dynamic scaling based on scroll position
   *
   * @param {Object} event - Scroll event object
   */
  const handleScroll = (event) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const itemWidth = ITEM_SIZE + ITEM_SPACING;
    const newIndex = Math.round(scrollX / itemWidth);

    if (newIndex !== carouselIndex && newIndex >= 0 && newIndex < availableEmojis.length) {
      setCarouselIndex(newIndex);
    }
  };

  /**
   * Calculate selection area layout based on grid size
   * Creates appropriate number of slots arranged in grid pattern
   *
   * @returns {Object} Layout configuration for selection area
   */
  const getSelectionLayout = () => {
    const slotsPerRow = gridSize === '2x2' ? 2 : gridSize === '4x4' ? 4 : 6;
    const rows = Math.ceil(requiredImages / slotsPerRow);
    return { slotsPerRow, rows, totalSlots: requiredImages };
  };

  /**
   * Render individual carousel item with dynamic scaling and touch handling
   *
   * @param {Object} emoji - Emoji data object
   * @param {number} index - Item index in carousel
   * @returns {JSX.Element} Rendered carousel item
   */
  const renderCarouselItem = (emoji, index) => {
    const scale = getScaleFactor(index, carouselIndex);
    const opacity = getOpacity(index, carouselIndex);
    const size = ITEM_SIZE * scale;

    return (
      <TouchableOpacity
        key={emoji.id}
        style={[
          styles.carouselItem,
          {
            width: size,
            height: size,
            marginHorizontal: ITEM_SPACING / 2,
            opacity: opacity,
          }
        ]}
        onPress={() => handleEmojiSelect(emoji, index)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.carouselEmoji,
            {
              fontSize: size * 0.6, // Emoji size relative to container
              includeFontPadding: false,
              textAlignVertical: 'center',
            }
          ]}
        >
          {emoji.emoji}
        </Text>
      </TouchableOpacity>
    );
  };

  /**
   * Render selection area with selected emojis
   * Creates grid layout matching game grid proportions
   *
   * @returns {JSX.Element} Selection area component
   */
  const renderSelectionArea = () => {
    const layout = getSelectionLayout();
    const slots = [];

    // Create slots for selected items
    for (let i = 0; i < layout.totalSlots; i++) {
      const emoji = selectedEmojis[i];
      slots.push(
        <TouchableOpacity
          key={i}
          style={[
            styles.selectionSlot,
            emoji ? styles.selectionSlotFilled : styles.selectionSlotEmpty
          ]}
          onPress={emoji ? () => handleEmojiDeselect(emoji, i) : undefined}
          activeOpacity={emoji ? 0.7 : 1}
        >
          {emoji && (
            <Text style={styles.selectionEmoji}>
              {emoji.emoji}
            </Text>
          )}
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.selectionArea}>
        <Text style={styles.selectionTitle}>
          Select {requiredImages} Images ({selectedEmojis.length}/{requiredImages})
        </Text>
        <View
          style={[
            styles.selectionGrid,
            {
              width: layout.slotsPerRow * 60 + (layout.slotsPerRow - 1) * 10,
            }
          ]}
        >
          {slots}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Selection Area at Top */}
      {renderSelectionArea()}

      {/* Carousel Area in Center */}
      <View style={styles.carouselContainer}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContent}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          snapToInterval={ITEM_SIZE + ITEM_SPACING}
          decelerationRate="fast"
          bounces={false}
        >
          {availableEmojis.map((emoji, index) => renderCarouselItem(emoji, index))}
        </ScrollView>
      </View>

      {/* Navigation Area at Bottom */}
      <View style={styles.navigationArea}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>⬅️</Text>
        </TouchableOpacity>

        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {requiredImages - selectedEmojis.length} more needed
          </Text>
        </View>

        <Animated.View style={[styles.nextButtonContainer, { opacity: flashAnim }]}>
          <TouchableOpacity
            style={[
              styles.nextButton,
              selectedEmojis.length !== requiredImages && styles.nextButtonDisabled
            ]}
            onPress={handleNext}
            disabled={selectedEmojis.length !== requiredImages}
          >
            <Text style={[
              styles.nextButtonText,
              selectedEmojis.length !== requiredImages && styles.nextButtonTextDisabled
            ]}>
              ➡️
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

/**
 * Comprehensive styles for custom carousel-based selection interface
 * Implements design specifications from ui-for-image-selection.md
 * Optimized for children ages 3+ with large touch targets and clear visual hierarchy
 */
const styles = StyleSheet.create({
  /**
   * container: Root container with three-section layout
   * - Top: Selection area
   * - Center: Carousel interface
   * - Bottom: Navigation controls
   */
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa', // Matches HomeScreen background
    paddingTop: 10,
  },

  /**
   * SELECTION AREA STYLES
   * Top section showing selected emojis in grid layout
   */
  selectionArea: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  /**
   * selectionTitle: Progress indicator for selection process
   * Shows current progress and required number of selections
   */
  selectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
    textAlign: 'center',
  },

  /**
   * selectionGrid: Container for selection slots
   * Flexible layout that adapts to grid size requirements
   */
  selectionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },

  /**
   * selectionSlot: Individual slot for selected emoji
   * Consistent size with visual feedback for empty/filled states
   */
  selectionSlot: {
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },

  /**
   * selectionSlotEmpty: Styling for unfilled selection slots
   * Dotted border indicates available selection space
   */
  selectionSlotEmpty: {
    borderColor: '#dee2e6',
    borderStyle: 'dashed',
    backgroundColor: '#f8f9fa',
  },

  /**
   * selectionSlotFilled: Styling for slots with selected emojis
   * Solid border and background indicate successful selection
   */
  selectionSlotFilled: {
    borderColor: '#4caf50',
    backgroundColor: '#e8f5e8',
    borderStyle: 'solid',
  },

  /**
   * selectionEmoji: Emoji display within selection slots
   * Optimized size and rendering for clear visibility
   */
  selectionEmoji: {
    fontSize: 28,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  /**
   * CAROUSEL AREA STYLES
   * Center section with horizontal scrolling carousel
   */
  carouselContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },

  /**
   * carouselContent: ScrollView content container
   * Centers carousel items and provides appropriate padding
   */
  carouselContent: {
    paddingHorizontal: 100, // Centering offset
    alignItems: 'center',
  },

  /**
   * carouselItem: Individual carousel item container
   * Dynamic sizing based on position with touch-friendly design
   */
  carouselItem: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#dee2e6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },

  /**
   * carouselEmoji: Emoji display within carousel items
   * Dynamic sizing with proper rendering properties
   */
  carouselEmoji: {
    includeFontPadding: false,
    textAlignVertical: 'center',
    textAlign: 'center',
  },

  /**
   * NAVIGATION AREA STYLES
   * Bottom section with back button and progress indicator
   */
  navigationArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 10,
  },

  /**
   * backButton: Circular back button matching HomeScreen design
   * Consistent styling with other navigation elements
   */
  backButton: {
    backgroundColor: '#6c757d',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#495057',
    shadowColor: '#6c757d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /**
   * backButtonText: Back button emoji icon
   * Large size for easy recognition and touch
   */
  backButtonText: {
    color: '#ffffff',
    fontSize: 24,
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  /**
   * progressContainer: Container for progress text
   * Flexible layout to accommodate varying text lengths
   */
  progressContainer: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },

  /**
   * progressText: Progress indicator text
   * Clear feedback on selection progress and next steps
   */
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
  },

  /**
   * nextButtonContainer: Animated container for Next button
   * Matches HomeScreen flashing animation behavior
   */
  nextButtonContainer: {
    marginLeft: 10,
  },

  /**
   * nextButton: Next button styling matching HomeScreen design
   * Blue primary button that becomes prominent when enabled
   */
  nextButton: {
    backgroundColor: '#007bff',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#0056b3',
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /**
   * nextButtonDisabled: Disabled state for Next button
   * Gray appearance when insufficient selections made
   */
  nextButtonDisabled: {
    backgroundColor: '#6c757d',
    borderColor: '#495057',
    shadowOpacity: 0,
    elevation: 0,
  },

  /**
   * nextButtonText: Next button emoji icon
   * Large size matching back button design
   */
  nextButtonText: {
    color: '#ffffff',
    fontSize: 24,
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  /**
   * nextButtonTextDisabled: Disabled state text color
   * Muted color for disabled button state
   */
  nextButtonTextDisabled: {
    color: '#adb5bd',
  },
});