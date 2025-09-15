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
import BuildInfo from '../components/BuildInfo';

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
  const [isCarouselInitialized, setIsCarouselInitialized] = useState(false);

  // Circular carousel configuration
  const VISIBLE_ITEMS = 5; // Total items visible (center + 2 on each side)
  const COPIES_COUNT = 3; // Number of times to repeat the emoji array (minimum 3 for infinite scroll)

  // Animation references
  const scrollViewRef = useRef(null);
  const carouselPosition = useRef(new Animated.Value(0)).current;
  const selectionAnimations = useRef(new Map()).current;
  const flashAnim = useRef(new Animated.Value(1)).current;

  // Constants for carousel behavior
  const ITEM_SIZE = 80; // Center item size
  const ITEM_SPACING = 20; // Space between items

  // Listen for screen orientation changes
  useEffect(() => {
    const onChange = (result) => {
      setScreenData(result.window);
    };

    const subscription = Dimensions.addEventListener('change', onChange);
    return () => subscription?.remove();
  }, []);

  // Initialize carousel position to start from middle copy for infinite scroll
  useEffect(() => {
    if (!isCarouselInitialized && availableEmojis.length > 0 && scrollViewRef.current) {
      const middleStartIndex = getMiddleCopyStartIndex();
      const itemWidth = ITEM_SIZE + ITEM_SPACING;
      const initialScrollPosition = middleStartIndex * itemWidth;

      // Set initial scroll position after a small delay to ensure ScrollView is ready
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ x: initialScrollPosition, animated: false });
        setCarouselIndex(middleStartIndex);
        setIsCarouselInitialized(true);
      }, 100);
    }
  }, [availableEmojis.length, isCarouselInitialized]);

  // Start flashing animation when selection is complete
  useEffect(() => {
    if (selectedEmojis.length === requiredImages) {
      startFlashAnimation();
    } else {
      stopFlashAnimation();
    }
  }, [selectedEmojis.length, requiredImages]);

  /**
   * Create circular carousel data for infinite scrolling
   * Creates exactly COPIES_COUNT copies of the emoji array
   *
   * @returns {Array} Extended array with repeated items for circular scrolling
   */
  const createCircularCarouselData = () => {
    if (availableEmojis.length === 0) return [];

    const circularArray = [];
    for (let copy = 0; copy < COPIES_COUNT; copy++) {
      circularArray.push(...availableEmojis);
    }

    return circularArray;
  };

  /**
   * Get the middle copy index - where we want to "center" the infinite scroll
   * @returns {number} Starting index of the middle copy
   */
  const getMiddleCopyStartIndex = () => {
    return availableEmojis.length; // Second copy (index 1) is the "middle"
  };

  /**
   * Check if scroll position needs repositioning for infinite scroll
   * @param {number} scrollX - Current scroll position
   * @returns {number|null} New scroll position if repositioning needed, null otherwise
   */
  const getRepositionedScrollX = (scrollX) => {
    const itemWidth = ITEM_SIZE + ITEM_SPACING;
    const currentIndex = Math.round(scrollX / itemWidth);

    const firstCopyEnd = availableEmojis.length; // End of first copy
    const secondCopyStart = availableEmojis.length; // Start of middle copy
    const secondCopyEnd = availableEmojis.length * 2; // End of middle copy
    const buffer = Math.ceil(availableEmojis.length / 4); // Buffer zone

    // If we're too far left (in first copy), jump to equivalent position in middle copy
    if (currentIndex < buffer) {
      const equivalentMiddleIndex = currentIndex + availableEmojis.length;
      return equivalentMiddleIndex * itemWidth;
    }

    // If we're too far right (in last copy), jump to equivalent position in middle copy
    if (currentIndex >= secondCopyEnd - buffer) {
      const equivalentMiddleIndex = currentIndex - availableEmojis.length;
      return equivalentMiddleIndex * itemWidth;
    }

    return null;
  };

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
   * @param {number} circularIndex - Index of emoji in circular array
   */
  const handleEmojiSelect = (emoji, circularIndex) => {
    // Prevent selection if already at limit
    if (selectedEmojis.length >= requiredImages) return;

    // Check if emoji is already selected
    if (selectedEmojis.find(selected => selected.id === emoji.id)) return;

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

      // Reset carousel initialization to handle the updated available emojis
      setIsCarouselInitialized(false);
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

    // Reset carousel initialization to handle the updated available emojis
    setIsCarouselInitialized(false);
  };

  /**
   * Handle carousel scroll to update center index and implement infinite scroll
   * @param {Object} event - Scroll event object
   */
  const handleScroll = (event) => {
    if (!isCarouselInitialized) return;

    const scrollX = event.nativeEvent.contentOffset.x;
    const itemWidth = ITEM_SIZE + ITEM_SPACING;
    const newIndex = Math.round(scrollX / itemWidth);

    const circularData = createCircularCarouselData();
    if (newIndex !== carouselIndex && newIndex >= 0 && newIndex < circularData.length) {
      setCarouselIndex(newIndex);
    }
  };

  /**
   * Handle scroll end to reposition for infinite scroll
   * This is called when user stops scrolling
   */
  const handleScrollEnd = (event) => {
    if (!isCarouselInitialized) return;

    const scrollX = event.nativeEvent.contentOffset.x;
    const repositionX = getRepositionedScrollX(scrollX);

    if (repositionX !== null) {
      // Add a small delay to ensure scroll has fully stopped
      setTimeout(() => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({ x: repositionX, animated: false });
          const itemWidth = ITEM_SIZE + ITEM_SPACING;
          const newIndex = Math.round(repositionX / itemWidth);
          setCarouselIndex(newIndex);
        }
      }, 100);
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
   * @param {number} circularIndex - Item index in circular carousel
   * @returns {JSX.Element} Rendered carousel item
   */
  const renderCarouselItem = (emoji, circularIndex) => {
    if (!emoji) return null;

    const scale = getScaleFactor(circularIndex, carouselIndex);
    const opacity = getOpacity(circularIndex, carouselIndex);
    const size = ITEM_SIZE * scale;

    // Check if this emoji is already selected (compare by original emoji, not circular position)
    const originalEmojiIndex = circularIndex % availableEmojis.length;
    const originalEmoji = availableEmojis[originalEmojiIndex];
    const isSelected = selectedEmojis.find(selected => selected.id === originalEmoji?.id);

    return (
      <TouchableOpacity
        key={`emoji-${circularIndex}`} // Unique key for circular rendering
        style={[
          styles.carouselItem,
          {
            width: size,
            height: size,
            marginHorizontal: ITEM_SPACING / 2,
            opacity: isSelected ? 0.3 : opacity, // Dim selected items
          }
        ]}
        onPress={() => handleEmojiSelect(originalEmoji, circularIndex)}
        activeOpacity={0.7}
        disabled={isSelected} // Disable if already selected
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
          onMomentumScrollEnd={handleScrollEnd}
          onScrollEndDrag={handleScrollEnd}
          scrollEventThrottle={16}
          snapToInterval={ITEM_SIZE + ITEM_SPACING}
          decelerationRate="fast"
          bounces={false}
          overScrollMode="never"
        >
          {createCircularCarouselData().map((emoji, circularIndex) =>
            renderCarouselItem(emoji, circularIndex)
          )}
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

      {/* Build Information for Development */}
      <BuildInfo />
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
   * Centers carousel items and provides appropriate padding for circular scrolling
   */
  carouselContent: {
    paddingHorizontal: 50, // Reduced padding for circular layout
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