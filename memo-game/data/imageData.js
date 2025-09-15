/**
 * imageData.js - Universal Image Data Management for Memory Game
 *
 * This module provides a universal interface for managing all types of images
 * in the memory game, including emojis, gallery photos, and bundled assets.
 *
 * Universal Image Format:
 * {
 *   id: string,           // Unique identifier
 *   type: 'emoji' | 'gallery' | 'asset',
 *   displayContent: string | uri,  // Emoji character or image URI
 *   name: string,         // Descriptive name
 *   category: string,     // Category classification
 *   thumbnail?: string,   // Optional thumbnail for large images
 * }
 *
 * Key Features:
 * - Single interface for all image types
 * - Consistent data structure across emoji/gallery/assets
 * - Optimized for carousel rendering
 * - Support for async image loading
 * - Built-in thumbnail generation for gallery images
 *
 * TODO: Gallery Performance Optimization
 * - Currently limited to 100 recent photos to prevent memory crashes
 * - Future: Implement pagination/lazy loading for large galleries
 * - Future: Add image caching and optimization
 */

import * as ImagePicker from 'expo-image-picker';
import { getAllEmojis } from './emojiData';

/**
 * Universal image item structure
 * @typedef {Object} UniversalImageItem
 * @property {string} id - Unique identifier for tracking
 * @property {'emoji'|'gallery'|'asset'} type - Type of image source
 * @property {string} displayContent - Emoji character or image URI
 * @property {string} name - Descriptive name for accessibility
 * @property {string} category - Category classification
 * @property {string} [thumbnail] - Optional thumbnail URI for optimization
 */

/**
 * Convert emoji data to universal format
 * @returns {UniversalImageItem[]} Array of emoji items in universal format
 */
export const getUniversalEmojis = () => {
  const emojis = getAllEmojis();
  return emojis.map(emoji => ({
    id: `emoji_${emoji.id}`,
    type: 'emoji',
    displayContent: emoji.emoji,
    name: emoji.name,
    category: emoji.category,
  }));
};

/**
 * Pick gallery images using ImagePicker - user selects photos to browse in carousel
 * This approach works because ImagePicker provides proper file:// URIs
 * @param {number} maxImages - Maximum number of images to select (default 20)
 * @returns {Promise<UniversalImageItem[]>} Array of selected gallery images in universal format
 */
export const loadGalleryImages = async (maxImages = 20) => {
  try {
    // Request media library permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      throw new Error('Gallery permission is required to select photos for the game');
    }

    // Launch image picker with multiple selection
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      allowsEditing: false,
      quality: 0.8,
      orderedSelection: true,
      selectionLimit: maxImages,
    });

    if (result.canceled || !result.assets) {
      // If user cancels, return empty array (will trigger error handling)
      throw new Error('Please select some photos to continue');
    }

    // Convert selected images to universal format
    const validAssets = result.assets.map((asset, index) => ({
      id: `gallery_${Date.now()}_${index}`,
      type: 'gallery',
      displayContent: asset.uri, // ImagePicker provides proper file:// URIs
      name: asset.fileName || `Photo ${index + 1}`,
      category: 'gallery',
      thumbnail: asset.uri,
      width: asset.width,
      height: asset.height,
    }));

    console.log(`User selected ${validAssets.length} gallery images for carousel`);
    console.log(`First image URI: ${validAssets[0]?.displayContent}`);

    return validAssets;

  } catch (error) {
    console.error('Error selecting gallery images:', error);
    throw error;
  }
};

/**
 * Get bundled asset images (Peppa, Bluey, etc.)
 * @param {string} assetSet - Asset set name ('peppa' | 'bluey')
 * @returns {UniversalImageItem[]} Array of asset items in universal format
 */
export const getAssetImages = (assetSet) => {
  // TODO: Implement when asset sets are added
  // For now, return placeholder structure
  const placeholderAssets = {
    peppa: [
      {
        id: 'peppa_1',
        type: 'asset',
        displayContent: require('../assets/icon.png'), // Will be actual Peppa images
        name: 'Peppa Pig',
        category: 'peppa',
      },
    ],
    bluey: [
      {
        id: 'bluey_1',
        type: 'asset',
        displayContent: require('../assets/icon.png'), // Will be actual Bluey images
        name: 'Bluey',
        category: 'bluey',
      },
    ],
  };

  return placeholderAssets[assetSet] || [];
};

/**
 * Get images based on source type from HomeScreen selection
 * @param {string} imageSource - Source type ('emoji' | 'gallery' | 'peppa' | 'bluey')
 * @param {number} [maxGalleryImages] - Max gallery images to select (default 20)
 * @returns {Promise<UniversalImageItem[]>} Array of images in universal format
 */
export const getImagesBySource = async (imageSource, maxGalleryImages = 20) => {
  switch (imageSource) {
    case 'emoji':
      return getUniversalEmojis();

    case 'gallery':
      return await loadGalleryImages(maxGalleryImages);

    case 'peppa':
      return getAssetImages('peppa');

    case 'bluey':
      return getAssetImages('bluey');

    default:
      throw new Error(`Unknown image source: ${imageSource}`);
  }
};

/**
 * Utility function to check if an image needs async loading
 * @param {UniversalImageItem} imageItem - Image item to check
 * @returns {boolean} True if image requires async loading
 */
export const requiresAsyncLoading = (imageItem) => {
  return imageItem.type === 'gallery' || imageItem.type === 'asset';
};

/**
 * Utility function to get display component props based on image type
 * @param {UniversalImageItem} imageItem - Image item to get props for
 * @returns {Object} Props for rendering component
 */
export const getDisplayProps = (imageItem) => {
  if (imageItem.type === 'emoji') {
    return {
      component: 'Text',
      props: {
        children: imageItem.displayContent,
        style: { textAlign: 'center' }
      }
    };
  } else {
    // For gallery images, ImagePicker provides proper file:// URIs
    return {
      component: 'Image',
      props: {
        source: { uri: imageItem.displayContent },
        style: { width: '100%', height: '100%', resizeMode: 'cover' }
      }
    };
  }
};