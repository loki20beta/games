/**
 * Card.js - Memory Game Card Component
 *
 * Individual card component for the memory game with flip animations,
 * touch interactions, and support for both emojis and gallery images.
 *
 * Features:
 * - Smooth flip animations using React Native Animated
 * - Face-down and face-up states
 * - Touch interaction handling
 * - Universal support for emojis and gallery images
 * - Responsive sizing and visual feedback
 * - Matched/unmatched state management
 *
 * Card States:
 * - Face down (initial state)
 * - Face up (showing image/emoji)
 * - Matched (permanently face up with subtle styling)
 * - Disabled (during animations or when matched)
 *
 * Props Expected:
 * - card: Card data object with image, states, and IDs
 * - onPress: Callback function when card is tapped
 * - cardSize: Dynamic size for responsive layout
 * - disabled: Boolean to prevent interactions during animations
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  StyleSheet
} from 'react-native';
import { getDisplayProps } from '../data/imageData';

/**
 * Card Component - Individual Memory Game Card
 *
 * Renders a single card with flip animation and handles user interactions.
 * Supports both emoji and gallery image display with universal styling.
 *
 * @param {Object} props - Component props
 * @param {Object} props.card - Card data object
 * @param {Function} props.onPress - Callback when card is pressed
 * @param {number} props.cardWidth - Card width
 * @param {number} props.cardHeight - Card height
 * @param {boolean} props.disabled - Whether card interactions are disabled
 * @returns {JSX.Element} Animated memory card component
 */
export default function Card({ card, onPress, cardWidth, cardHeight, disabled = false }) {
  // Animation value for flip effect (0 = face down, 1 = face up)
  const flipAnimation = useRef(new Animated.Value(card.isFlipped ? 1 : 0)).current;

  /**
   * Update flip animation when card flip state changes
   */
  useEffect(() => {
    Animated.timing(flipAnimation, {
      toValue: card.isFlipped ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [card.isFlipped, flipAnimation]);

  /**
   * Handle card press - only allow if not disabled and not already matched
   */
  const handlePress = () => {
    if (!disabled && !card.isMatched && onPress) {
      onPress(card);
    }
  };

  // Calculate rotation for flip animation
  const frontRotateY = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backRotateY = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  // Get display properties based on image type
  const displayProps = getDisplayProps(card.image);

  // Calculate dynamic styles
  const cardContainerStyle = {
    width: cardWidth,
    height: cardHeight,
  };

  const dynamicCardStyle = {
    ...cardContainerStyle,
    opacity: card.isMatched ? 0.8 : 1,
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || card.isMatched}
      style={[styles.cardContainer, cardContainerStyle]}
      activeOpacity={0.8}
    >
      <View style={[styles.card, dynamicCardStyle]}>
        {/* Card Back (Face Down) */}
        <Animated.View
          style={[
            styles.cardFace,
            styles.cardBack,
            { transform: [{ rotateY: frontRotateY }] }
          ]}
        >
          <View style={styles.cardBackContent}>
            {/* Clean card back with no symbols or text */}
          </View>
        </Animated.View>

        {/* Card Front (Face Up with Image/Emoji) */}
        <Animated.View
          style={[
            styles.cardFace,
            styles.cardFront,
            { transform: [{ rotateY: backRotateY }] }
          ]}
        >
          <View style={styles.cardFrontContent}>
            {displayProps.component === 'Text' ? (
              <Text style={[styles.cardEmoji, { fontSize: Math.min(cardWidth, cardHeight) * 0.4 }]}>
                {displayProps.props.children}
              </Text>
            ) : (
              <Image
                source={displayProps.props.source}
                style={[
                  styles.cardImage,
                  {
                    width: cardWidth - 8,
                    height: cardHeight - 8,
                  }
                ]}
                resizeMode="cover"
              />
            )}
          </View>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
}

/**
 * Card component styles
 */
const styles = StyleSheet.create({
  /**
   * cardContainer: Outer container for touch handling
   */
  cardContainer: {
    // Dynamic dimensions set via props
  },

  /**
   * card: Main card container with 3D perspective
   */
  card: {
    flex: 1,
    position: 'relative',
  },

  /**
   * cardFace: Base style for both card faces (front/back)
   */
  cardFace: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backfaceVisibility: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },

  /**
   * cardBack: Face-down styling (brain icon and text)
   */
  cardBack: {
    backgroundColor: '#4a90e2',
    borderWidth: 2,
    borderColor: '#357abd',
  },

  /**
   * cardBackContent: Content container for face-down state
   */
  cardBackContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },


  /**
   * cardFront: Face-up styling (shows selected image/emoji)
   */
  cardFront: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e1e8ed',
  },

  /**
   * cardFrontContent: Content container for face-up state
   */
  cardFrontContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },

  /**
   * cardEmoji: Emoji display styling
   */
  cardEmoji: {
    textAlign: 'center',
    // Dynamic fontSize set via props
  },

  /**
   * cardImage: Gallery image display styling
   */
  cardImage: {
    borderRadius: 8,
    // Dynamic dimensions set via props
  },
});