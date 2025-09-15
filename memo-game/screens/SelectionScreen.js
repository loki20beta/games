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
  PanResponder,
  Image,
  Alert
} from 'react-native';
import { getImagesBySource, getDisplayProps, requiresAsyncLoading } from '../data/imageData';
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

  // Universal carousel state management
  const [availableImages, setAvailableImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isCarouselInitialized, setIsCarouselInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Circular carousel configuration
  const VISIBLE_ITEMS = 5; // Total items visible (center + 2 on each side)
  const COPIES_COUNT = 3; // Number of times to repeat the emoji array (minimum 3 for infinite scroll)

  // Animation references
  const scrollViewRef = useRef(null);
  const carouselPosition = useRef(new Animated.Value(0)).current;
  const selectionAnimations = useRef(new Map()).current;
  const flashAnim = useRef(new Animated.Value(1)).current;

  // Dynamic carousel sizing based on screen dimensions and orientation
  const getCarouselDimensions = () => {
    const screenWidth = screenData.width;
    const screenHeight = screenData.height;
    const availableHeight = screenHeight - 200; // Account for selection area and navigation

    // Calculate optimal item size based on orientation
    let itemSize;
    if (isLandscape) {
      // In landscape, prioritize width but limit height
      itemSize = Math.min(
        Math.floor((screenWidth - 120) / 5), // 5 items visible with margins
        Math.floor(availableHeight * 0.7)    // 70% of available height
      );
    } else {
      // In portrait, use more of the available height
      itemSize = Math.min(
        Math.floor((screenWidth - 100) / 3.5), // 3.5 items visible
        Math.floor(availableHeight * 0.8)      // 80% of available height
      );
    }

    // Ensure minimum and maximum sizes
    itemSize = Math.max(80, Math.min(itemSize, 150));

    return {
      itemSize,
      itemSpacing: Math.floor(itemSize * 0.15), // 15% of item size
      emojiSize: Math.floor(itemSize * 0.5)     // 50% of item size
    };
  };

  const { itemSize, itemSpacing, emojiSize } = getCarouselDimensions();

  // Load images based on source type when component mounts
  useEffect(() => {
    const loadImages = async () => {
      try {
        setIsLoading(true);
        const images = await getImagesBySource(imageSource);
        setAvailableImages(images);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading images:', error);
        setIsLoading(false);

        // Show user-friendly error message
        Alert.alert(
          'Unable to Load Images',
          error.message.includes('permission')
            ? 'Please allow access to your photos to select gallery images.'
            : 'There was a problem loading the images. Please try again.',
          [
            {
              text: 'Go Back',
              onPress: () => navigation.goBack(),
              style: 'cancel'
            },
            {
              text: 'Try Again',
              onPress: () => loadImages()
            }
          ]
        );
      }
    };

    loadImages();
  }, [imageSource]);

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
    if (!isCarouselInitialized && availableImages.length > 0 && scrollViewRef.current && !isLoading) {
      const middleStartIndex = getMiddleCopyStartIndex();
      const itemWidth = itemSize + itemSpacing;
      const initialScrollPosition = middleStartIndex * itemWidth;

      // Set initial scroll position after a small delay to ensure ScrollView is ready
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ x: initialScrollPosition, animated: false });
        setCarouselIndex(middleStartIndex);
        setIsCarouselInitialized(true);
      }, 100);
    }
  }, [availableImages.length, isCarouselInitialized, isLoading]);

  // Start flashing animation when selection is complete
  useEffect(() => {
    if (selectedImages.length === requiredImages) {
      startFlashAnimation();
    } else {
      stopFlashAnimation();
    }
  }, [selectedImages.length, requiredImages]);

  /**
   * Create circular carousel data for infinite scrolling
   * Creates exactly COPIES_COUNT copies of the image array
   *
   * @returns {Array} Extended array with repeated items for circular scrolling
   */
  const createCircularCarouselData = () => {
    if (availableImages.length === 0) return [];

    const circularArray = [];
    for (let copy = 0; copy < COPIES_COUNT; copy++) {
      circularArray.push(...availableImages);
    }

    return circularArray;
  };

  /**
   * Get the middle copy index - where we want to "center" the infinite scroll
   * @returns {number} Starting index of the middle copy
   */
  const getMiddleCopyStartIndex = () => {
    return availableImages.length; // Second copy (index 1) is the "middle"
  };

/**
 * Check if scroll position needs repositioning for infinite scroll
 * @param {number} scrollX - Current scroll position
 * @returns {number|null} New scroll position if repositioning needed, null otherwise
 */
const getRepositionedScrollX = (scrollX) => {
  const itemWidth = itemSize + itemSpacing;
  const currentIndex = Math.round(scrollX / itemWidth);
  const arrayLength = availableImages.length;
  const buffer = 5; // Simple fixed buffer

  // Array structure: [copy1: 0 to arrayLength-1][copy2: arrayLength to 2*arrayLength-1][copy3: 2*arrayLength to 3*arrayLength-1]
  // We want to keep the user in copy2 (middle copy) for seamless infinite scrolling

  // If scrolling left into first copy (too close to start), jump to equivalent position in copy2
  if (currentIndex < buffer) {
    return (currentIndex + arrayLength) * itemWidth;
  }

  // If scrolling right into third copy (too close to end), jump to equivalent position in copy2
  if (currentIndex >= (2 * arrayLength) - buffer) {
    return (currentIndex - arrayLength) * itemWidth;
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
    if (selectedImages.length === requiredImages) {
      stopFlashAnimation();
      navigation.navigate('Game', {
        gridSize,
        imageSource,
        selectedImages,
        totalCards
      });
    }
  };

  // Removed dynamic scaling functions - all emojis now equal size

  /**
   * Handle image selection from carousel
   * Animates item from carousel to selection area and removes from available items
   *
   * @param {Object} image - Image object to select
   * @param {number} circularIndex - Index of image in circular array
   */
  const handleImageSelect = (image, circularIndex) => {
    // Prevent selection if already at limit
    if (selectedImages.length >= requiredImages) return;

    // Check if image is already selected
    if (selectedImages.find(selected => selected.id === image.id)) return;

    // Create selection animation
    const animValue = new Animated.Value(0);
    selectionAnimations.set(image.id, animValue);

    // Animate selection transition
    Animated.timing(animValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Update state after animation starts
    setTimeout(() => {
      setSelectedImages(prev => [...prev, image]);
      setAvailableImages(prev => prev.filter(item => item.id !== image.id));
      selectionAnimations.delete(image.id);

      // Reset carousel initialization to handle the updated available images
      setIsCarouselInitialized(false);
    }, 150); // Halfway through animation
  };

  /**
   * Handle image deselection from selection area
   * Returns image to carousel and removes from selected items
   *
   * @param {Object} image - Image object to deselect
   * @param {number} index - Index of image in selected array
   */
  const handleImageDeselect = (image, index) => {
    // Remove from selected and return to available
    setSelectedImages(prev => prev.filter(item => item.id !== image.id));
    setAvailableImages(prev => [...prev, image].sort((a, b) => a.id.localeCompare(b.id)));

    // Reset carousel initialization to handle the updated available images
    setIsCarouselInitialized(false);
  };

  /**
   * Handle carousel scroll to update center index and implement infinite scroll
   * @param {Object} event - Scroll event object
   */
  const handleScroll = (event) => {
    if (!isCarouselInitialized) return;

    const scrollX = event.nativeEvent.contentOffset.x;
    const itemWidth = itemSize + itemSpacing;
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
          const itemWidth = itemSize + itemSpacing;
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
   * Render individual carousel item with universal image support
   *
   * @param {Object} image - Universal image data object
   * @param {number} circularIndex - Item index in circular carousel
   * @returns {JSX.Element} Rendered carousel item
   */
  const renderCarouselItem = (image, circularIndex) => {
    if (!image) return null;

    // Check if this image is already selected (compare by original image, not circular position)
    const originalImageIndex = circularIndex % availableImages.length;
    const originalImage = availableImages[originalImageIndex];
    const isSelected = selectedImages.find(selected => selected.id === originalImage?.id);

    // Get display props based on image type
    const displayProps = getDisplayProps(image);

    return (
      <TouchableOpacity
        key={`image-${circularIndex}`} // Unique key for circular rendering
        style={[
          styles.carouselItem,
          {
            width: itemSize,
            height: itemSize,
            marginHorizontal: itemSpacing / 2,
            opacity: isSelected ? 0.3 : 1.0, // Dim selected items, full opacity for others
          }
        ]}
        onPress={() => handleImageSelect(originalImage, circularIndex)}
        activeOpacity={0.7}
        disabled={isSelected} // Disable if already selected
      >
        {displayProps.component === 'Text' ? (
          <Text
            style={[
              styles.carouselEmoji,
              { fontSize: emojiSize },
              displayProps.props.style
            ]}
          >
            {displayProps.props.children}
          </Text>
        ) : (
          <Image
            {...displayProps.props}
            style={[
              displayProps.props.style,
              {
                width: itemSize * 0.8, // Slightly smaller than container for padding
                height: itemSize * 0.8,
                borderRadius: 8,
              }
            ]}
          />
        )}
      </TouchableOpacity>
    );
  };

  /**
   * Render selection area with selected images
   * Creates grid layout matching game grid proportions
   *
   * @returns {JSX.Element} Selection area component
   */
  const renderSelectionArea = () => {
    const layout = getSelectionLayout();
    const slots = [];

    // Create slots for selected items
    for (let i = 0; i < layout.totalSlots; i++) {
      const image = selectedImages[i];
      slots.push(
        <TouchableOpacity
          key={i}
          style={[
            styles.selectionSlot,
            image ? styles.selectionSlotFilled : styles.selectionSlotEmpty
          ]}
          onPress={image ? () => handleImageDeselect(image, i) : undefined}
          activeOpacity={image ? 0.7 : 1}
        >
          {image && (
            <>
              {image.type === 'emoji' ? (
                <Text style={styles.selectionEmoji}>
                  {image.displayContent}
                </Text>
              ) : (
                <Image
                  source={{ uri: image.displayContent }}
                  style={styles.selectionImage}
                />
              )}
            </>
          )}
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.selectionArea}>
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

  // Show loading state while images are being loaded
  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>
          {imageSource === 'gallery' ? 'Loading your photos...' : 'Loading images...'}
        </Text>
        <BuildInfo />
      </View>
    );
  }

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
          snapToInterval={itemSize + itemSpacing}
          decelerationRate="fast"
          bounces={false}
          overScrollMode="never"
        >
          {createCircularCarouselData().map((image, circularIndex) =>
            renderCarouselItem(image, circularIndex)
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
        </View>

        <Animated.View style={[styles.nextButtonContainer, { opacity: flashAnim }]}>
          <TouchableOpacity
            style={[
              styles.nextButton,
              selectedImages.length !== requiredImages && styles.nextButtonDisabled
            ]}
            onPress={handleNext}
            disabled={selectedImages.length !== requiredImages}
          >
            <Text style={[
              styles.nextButtonText,
              selectedImages.length !== requiredImages && styles.nextButtonTextDisabled
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
   * selectionImage: Image display within selection slots
   * Optimized sizing for gallery photos and assets
   */
  selectionImage: {
    width: 40,
    height: 40,
    borderRadius: 6,
    resizeMode: 'cover',
  },

  /**
   * CAROUSEL AREA STYLES
   * Center section with horizontal scrolling carousel
   */
  carouselContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 10,
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
   * Dynamic sizing based on screen dimensions and orientation
   */
  carouselItem: {
    // width and height are now set dynamically in component
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
    // marginHorizontal is now set dynamically in component
  },

  /**
   * carouselEmoji: Emoji display within carousel items
   * Dynamic sizing based on screen dimensions and orientation
   */
  carouselEmoji: {
    // fontSize is now set dynamically in component
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
   * progressContainer: Empty container for layout spacing
   * Maintains navigation button alignment without text labels
   */
  progressContainer: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
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

  /**
   * LOADING STATE STYLES
   * Styles for loading screen while images are being fetched
   */
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 20,
  },
});