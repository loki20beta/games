/**
 * emojiData.js - Comprehensive Emoji Dataset for Memory Game
 *
 * This module provides a curated collection of emojis suitable for children's
 * memory games. Emojis are organized by categories and optimized for visual
 * distinction and child appeal.
 *
 * Key Features:
 * - Carefully curated for child-friendly content
 * - Organized by logical categories for future filtering
 * - High visual contrast for easy recognition
 * - Cross-platform compatibility tested
 * - Excludes complex or inappropriate emojis
 *
 * Usage:
 * - Import getAllEmojis() for complete dataset
 * - Import getEmojisByCategory() for filtered selection
 * - Each emoji includes character, name, and category metadata
 */

/**
 * Emoji data structure
 * @typedef {Object} EmojiItem
 * @property {string} emoji - The actual emoji character
 * @property {string} name - Descriptive name for accessibility
 * @property {string} category - Category classification
 * @property {number} id - Unique identifier for tracking
 */

/**
 * FACES & EMOTIONS CATEGORY
 * Classic smiley faces and emotion expressions
 * High recognition value for young children
 */
const facesAndEmotions = [
  { id: 1, emoji: '😀', name: 'grinning face', category: 'faces' },
  { id: 2, emoji: '😃', name: 'grinning face with big eyes', category: 'faces' },
  { id: 3, emoji: '😄', name: 'grinning face with smiling eyes', category: 'faces' },
  { id: 4, emoji: '😁', name: 'beaming face with smiling eyes', category: 'faces' },
  { id: 5, emoji: '😊', name: 'smiling face with smiling eyes', category: 'faces' },
  { id: 6, emoji: '😇', name: 'smiling face with halo', category: 'faces' },
  { id: 7, emoji: '🙂', name: 'slightly smiling face', category: 'faces' },
  { id: 8, emoji: '😉', name: 'winking face', category: 'faces' },
  { id: 9, emoji: '😍', name: 'smiling face with heart-eyes', category: 'faces' },
  { id: 10, emoji: '🥰', name: 'smiling face with hearts', category: 'faces' },
  { id: 11, emoji: '😘', name: 'face blowing a kiss', category: 'faces' },
  { id: 12, emoji: '🤗', name: 'smiling face with open hands', category: 'faces' },
  { id: 13, emoji: '🤔', name: 'thinking face', category: 'faces' },
  { id: 14, emoji: '😎', name: 'smiling face with sunglasses', category: 'faces' },
  { id: 15, emoji: '🥳', name: 'partying face', category: 'faces' },
];

/**
 * ANIMALS CATEGORY
 * Common animals that children easily recognize
 * Mix of domestic and wild animals
 */
const animals = [
  { id: 16, emoji: '🐶', name: 'dog face', category: 'animals' },
  { id: 17, emoji: '🐱', name: 'cat face', category: 'animals' },
  { id: 18, emoji: '🐭', name: 'mouse face', category: 'animals' },
  { id: 19, emoji: '🐹', name: 'hamster', category: 'animals' },
  { id: 20, emoji: '🐰', name: 'rabbit face', category: 'animals' },
  { id: 21, emoji: '🦊', name: 'fox', category: 'animals' },
  { id: 22, emoji: '🐻', name: 'bear', category: 'animals' },
  { id: 23, emoji: '🐼', name: 'panda', category: 'animals' },
  { id: 24, emoji: '🐨', name: 'koala', category: 'animals' },
  { id: 25, emoji: '🐯', name: 'tiger face', category: 'animals' },
  { id: 26, emoji: '🦁', name: 'lion', category: 'animals' },
  { id: 27, emoji: '🐮', name: 'cow face', category: 'animals' },
  { id: 28, emoji: '🐷', name: 'pig face', category: 'animals' },
  { id: 29, emoji: '🐸', name: 'frog', category: 'animals' },
  { id: 30, emoji: '🐵', name: 'monkey face', category: 'animals' },
  { id: 31, emoji: '🦄', name: 'unicorn', category: 'animals' },
  { id: 32, emoji: '🐝', name: 'honeybee', category: 'animals' },
  { id: 33, emoji: '🐛', name: 'bug', category: 'animals' },
  { id: 34, emoji: '🦋', name: 'butterfly', category: 'animals' },
  { id: 35, emoji: '🐌', name: 'snail', category: 'animals' },
];

/**
 * FOOD CATEGORY
 * Popular foods that children recognize and enjoy
 * Mix of fruits, treats, and common meals
 */
const food = [
  { id: 36, emoji: '🍎', name: 'red apple', category: 'food' },
  { id: 37, emoji: '🍌', name: 'banana', category: 'food' },
  { id: 38, emoji: '🍓', name: 'strawberry', category: 'food' },
  { id: 39, emoji: '🍊', name: 'tangerine', category: 'food' },
  { id: 40, emoji: '🍉', name: 'watermelon', category: 'food' },
  { id: 41, emoji: '🍇', name: 'grapes', category: 'food' },
  { id: 42, emoji: '🥝', name: 'kiwi fruit', category: 'food' },
  { id: 43, emoji: '🍑', name: 'cherries', category: 'food' },
  { id: 44, emoji: '🥕', name: 'carrot', category: 'food' },
  { id: 45, emoji: '🌽', name: 'corn', category: 'food' },
  { id: 46, emoji: '🍕', name: 'pizza', category: 'food' },
  { id: 47, emoji: '🍔', name: 'hamburger', category: 'food' },
  { id: 48, emoji: '🌭', name: 'hot dog', category: 'food' },
  { id: 49, emoji: '🍦', name: 'soft ice cream', category: 'food' },
  { id: 50, emoji: '🍪', name: 'cookie', category: 'food' },
  { id: 51, emoji: '🎂', name: 'birthday cake', category: 'food' },
  { id: 52, emoji: '🧁', name: 'cupcake', category: 'food' },
  { id: 53, emoji: '🍭', name: 'lollipop', category: 'food' },
  { id: 54, emoji: '🍬', name: 'candy', category: 'food' },
  { id: 55, emoji: '🥛', name: 'glass of milk', category: 'food' },
];

/**
 * OBJECTS CATEGORY
 * Everyday objects and toys familiar to children
 * Transportation, toys, and common items
 */
const objects = [
  { id: 56, emoji: '⚽', name: 'soccer ball', category: 'objects' },
  { id: 57, emoji: '🏀', name: 'basketball', category: 'objects' },
  { id: 58, emoji: '🎾', name: 'tennis', category: 'objects' },
  { id: 59, emoji: '🏈', name: 'american football', category: 'objects' },
  { id: 60, emoji: '⚾', name: 'baseball', category: 'objects' },
  { id: 61, emoji: '🎯', name: 'bullseye', category: 'objects' },
  { id: 62, emoji: '🏓', name: 'ping pong', category: 'objects' },
  { id: 63, emoji: '🎮', name: 'video game', category: 'objects' },
  { id: 64, emoji: '🧸', name: 'teddy bear', category: 'objects' },
  { id: 65, emoji: '🎁', name: 'wrapped gift', category: 'objects' },
  { id: 66, emoji: '🎈', name: 'balloon', category: 'objects' },
  { id: 67, emoji: '🎪', name: 'circus tent', category: 'objects' },
  { id: 68, emoji: '🎨', name: 'artist palette', category: 'objects' },
  { id: 69, emoji: '🎭', name: 'performing arts', category: 'objects' },
  { id: 70, emoji: '🎵', name: 'musical note', category: 'objects' },
  { id: 71, emoji: '🎸', name: 'guitar', category: 'objects' },
  { id: 72, emoji: '🥁', name: 'drum', category: 'objects' },
  { id: 73, emoji: '🎺', name: 'trumpet', category: 'objects' },
  { id: 74, emoji: '🎹', name: 'musical keyboard', category: 'objects' },
  { id: 75, emoji: '📚', name: 'books', category: 'objects' },
];

/**
 * TRANSPORTATION CATEGORY
 * Vehicles and transportation methods
 * Land, sea, and air vehicles children recognize
 */
const transportation = [
  { id: 76, emoji: '🚗', name: 'automobile', category: 'transportation' },
  { id: 77, emoji: '🚕', name: 'taxi', category: 'transportation' },
  { id: 78, emoji: '🚙', name: 'sport utility vehicle', category: 'transportation' },
  { id: 79, emoji: '🚌', name: 'bus', category: 'transportation' },
  { id: 80, emoji: '🚎', name: 'trolleybus', category: 'transportation' },
  { id: 81, emoji: '🏎️', name: 'racing car', category: 'transportation' },
  { id: 82, emoji: '🚓', name: 'police car', category: 'transportation' },
  { id: 83, emoji: '🚑', name: 'ambulance', category: 'transportation' },
  { id: 84, emoji: '🚒', name: 'fire engine', category: 'transportation' },
  { id: 85, emoji: '🚐', name: 'minibus', category: 'transportation' },
  { id: 86, emoji: '🚚', name: 'delivery truck', category: 'transportation' },
  { id: 87, emoji: '🚛', name: 'articulated lorry', category: 'transportation' },
  { id: 88, emoji: '🚜', name: 'tractor', category: 'transportation' },
  { id: 89, emoji: '🏍️', name: 'motorcycle', category: 'transportation' },
  { id: 90, emoji: '🚲', name: 'bicycle', category: 'transportation' },
  { id: 91, emoji: '✈️', name: 'airplane', category: 'transportation' },
  { id: 92, emoji: '🚁', name: 'helicopter', category: 'transportation' },
  { id: 93, emoji: '🚂', name: 'locomotive', category: 'transportation' },
  { id: 94, emoji: '🚢', name: 'ship', category: 'transportation' },
  { id: 95, emoji: '⛵', name: 'sailboat', category: 'transportation' },
];

/**
 * NATURE CATEGORY
 * Natural elements, weather, and outdoor items
 * Sun, moon, plants, and weather phenomena
 */
const nature = [
  { id: 96, emoji: '🌞', name: 'sun with face', category: 'nature' },
  { id: 97, emoji: '🌝', name: 'full moon face', category: 'nature' },
  { id: 98, emoji: '⭐', name: 'star', category: 'nature' },
  { id: 99, emoji: '🌟', name: 'glowing star', category: 'nature' },
  { id: 100, emoji: '⚡', name: 'lightning bolt', category: 'nature' },
  { id: 101, emoji: '🌈', name: 'rainbow', category: 'nature' },
  { id: 102, emoji: '🔥', name: 'fire', category: 'nature' },
  { id: 103, emoji: '❄️', name: 'snowflake', category: 'nature' },
  { id: 104, emoji: '☀️', name: 'sun', category: 'nature' },
  { id: 105, emoji: '⛅', name: 'sun behind cloud', category: 'nature' },
  { id: 106, emoji: '☁️', name: 'cloud', category: 'nature' },
  { id: 107, emoji: '🌧️', name: 'cloud with rain', category: 'nature' },
  { id: 108, emoji: '🌩️', name: 'cloud with lightning', category: 'nature' },
  { id: 109, emoji: '🌨️', name: 'cloud with snow', category: 'nature' },
  { id: 110, emoji: '🌪️', name: 'tornado', category: 'nature' },
  { id: 111, emoji: '🌊', name: 'water wave', category: 'nature' },
  { id: 112, emoji: '🌳', name: 'deciduous tree', category: 'nature' },
  { id: 113, emoji: '🌲', name: 'evergreen tree', category: 'nature' },
  { id: 114, emoji: '🌵', name: 'cactus', category: 'nature' },
  { id: 115, emoji: '🌹', name: 'rose', category: 'nature' },
  { id: 116, emoji: '🌻', name: 'sunflower', category: 'nature' },
  { id: 117, emoji: '🌷', name: 'tulip', category: 'nature' },
  { id: 118, emoji: '🌺', name: 'hibiscus', category: 'nature' },
  { id: 119, emoji: '🌸', name: 'cherry blossom', category: 'nature' },
  { id: 120, emoji: '🍄', name: 'mushroom', category: 'nature' },
];

/**
 * SYMBOLS CATEGORY
 * Simple shapes and symbols for basic recognition
 * Hearts, stars, basic geometric shapes
 */
const symbols = [
  { id: 121, emoji: '❤️', name: 'red heart', category: 'symbols' },
  { id: 122, emoji: '🧡', name: 'orange heart', category: 'symbols' },
  { id: 123, emoji: '💛', name: 'yellow heart', category: 'symbols' },
  { id: 124, emoji: '💚', name: 'green heart', category: 'symbols' },
  { id: 125, emoji: '💙', name: 'blue heart', category: 'symbols' },
  { id: 126, emoji: '💜', name: 'purple heart', category: 'symbols' },
  { id: 127, emoji: '🖤', name: 'black heart', category: 'symbols' },
  { id: 128, emoji: '🤍', name: 'white heart', category: 'symbols' },
  { id: 129, emoji: '💕', name: 'two hearts', category: 'symbols' },
  { id: 130, emoji: '💖', name: 'sparkling heart', category: 'symbols' },
  { id: 131, emoji: '⭐', name: 'star', category: 'symbols' },
  { id: 132, emoji: '✨', name: 'sparkles', category: 'symbols' },
  { id: 133, emoji: '💫', name: 'dizzy', category: 'symbols' },
  { id: 134, emoji: '⚡', name: 'lightning bolt', category: 'symbols' },
  { id: 135, emoji: '🔶', name: 'large orange diamond', category: 'symbols' },
  { id: 136, emoji: '🔷', name: 'large blue diamond', category: 'symbols' },
  { id: 137, emoji: '🔸', name: 'small orange diamond', category: 'symbols' },
  { id: 138, emoji: '🔹', name: 'small blue diamond', category: 'symbols' },
  { id: 139, emoji: '💎', name: 'gem stone', category: 'symbols' },
  { id: 140, emoji: '🌟', name: 'glowing star', category: 'symbols' },
];

/**
 * Complete emoji dataset
 * Combines all categories into single comprehensive array
 * Total: 140 carefully selected emojis
 */
const allEmojis = [
  ...facesAndEmotions,
  ...animals,
  ...food,
  ...objects,
  ...transportation,
  ...nature,
  ...symbols,
];

/**
 * Get all emojis in the dataset
 * @returns {EmojiItem[]} Complete array of all available emojis
 */
export const getAllEmojis = () => {
  return [...allEmojis]; // Return copy to prevent mutation
};

/**
 * Get emojis filtered by category
 * @param {string} category - Category to filter by
 * @returns {EmojiItem[]} Array of emojis in specified category
 */
export const getEmojisByCategory = (category) => {
  return allEmojis.filter(emoji => emoji.category === category);
};

/**
 * Get available categories
 * @returns {string[]} Array of all available category names
 */
export const getCategories = () => {
  return ['faces', 'animals', 'food', 'objects', 'transportation', 'nature', 'symbols'];
};

/**
 * Get random selection of emojis
 * @param {number} count - Number of emojis to select
 * @returns {EmojiItem[]} Array of randomly selected emojis
 */
export const getRandomEmojis = (count) => {
  const shuffled = [...allEmojis].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

/**
 * Find emoji by ID
 * @param {number} id - Unique emoji identifier
 * @returns {EmojiItem|undefined} Emoji object or undefined if not found
 */
export const getEmojiById = (id) => {
  return allEmojis.find(emoji => emoji.id === id);
};

/**
 * Search emojis by name
 * @param {string} searchTerm - Term to search for in emoji names
 * @returns {EmojiItem[]} Array of matching emojis
 */
export const searchEmojis = (searchTerm) => {
  const term = searchTerm.toLowerCase();
  return allEmojis.filter(emoji =>
    emoji.name.toLowerCase().includes(term)
  );
};

/**
 * Dataset statistics
 */
export const getDatasetStats = () => {
  const stats = {
    total: allEmojis.length,
    byCategory: {}
  };

  getCategories().forEach(category => {
    stats.byCategory[category] = getEmojisByCategory(category).length;
  });

  return stats;
};

// Export default for convenient access
export default {
  getAllEmojis,
  getEmojisByCategory,
  getCategories,
  getRandomEmojis,
  getEmojiById,
  searchEmojis,
  getDatasetStats
};