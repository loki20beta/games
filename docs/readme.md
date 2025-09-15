
🧠 Kids Memo Cards Game – Agent Setup README

This document outlines the goals, features, and starting plan for building a kid-friendly Memo Card Game using React Native + Expo. Designed specifically for children ages 3 and up.

⸻

🎯 Goal

Create a simple, colorful, and engaging memory matching game designed for young children (3+ years) with step-by-step setup, big buttons, and visual learning elements.

⸻

🧩 Key Features (Kid-Friendly Design)
	1.	Step-by-Step Setup
	•	First: Choose grid size with visual representations (Small, Medium, Big)
	•	Then: Choose between colorful emojis or family photos
	•	Big, colorful buttons that are easy for small fingers
	2.	Visual Grid Size Selection
	•	Buttons show actual grid layout visually
	•	Simple names: Small (2x2), Medium (4x4), Big (6x6)
	•	Flashing "Next" button when selection is made
	3.	Child-Friendly Image Selection
	•	After choosing image source, a carousel or horizontal swipe view appears:
	•	Shows available emojis or gallery images.
	•	User swipes left/right to browse.
	•	A floating “Select” button in the bottom-right adds an image to the selection list.
	4.	Auto-Start Game
	•	When the selected number of images = half of total field slots, game starts automatically (each image will appear twice on the board).
	5.	Game UI
	•	Grid of face-down cards.
	•	Tap to reveal, match two to remove.
	•	Win screen when all matches are found.

⸻

🔧 Tech Stack
	•	React Native
	•	Expo SDK
	•	React Navigation
	•	Expo Image Picker (for gallery access)
	•	Gesture Handler / Reanimated (for smooth swiping)
	•	React Native SVG or emoji rendering for cards

⸻

🗂 Suggested File Structure

/memo-game
├── App.js
├── /components
│   ├── Card.js
│   ├── EmojiCarousel.js
│   ├── GalleryCarousel.js
│   └── SelectButton.js
├── /screens
│   ├── HomeScreen.js
│   ├── SelectionScreen.js
│   └── GameScreen.js
├── /utils
│   └── shuffle.js
└── /assets
    └── placeholder.png


⸻

📲 User Flow
	1.	HomeScreen
	•	Choose grid size (dropdown or buttons).
	•	Choose image source: Emoji / Gallery.
	•	Tap “Next”.
	2.	SelectionScreen
	•	Swipe through images (EmojiCarousel or GalleryCarousel).
	•	Tap “Select” to add image.
	•	Once enough images are selected → navigate to GameScreen.
	3.	GameScreen
	•	Memory game grid.
	•	Match pairs.
	•	Show win screen on completion.

⸻

✅ Tasks for Agent
	1.	✅ Initialise Expo project with navigation and gesture handler.
	2.	✅ Build HomeScreen with size and source pickers.
	3.	✅ Build carousel view for image selection (EmojiCarousel and GalleryCarousel).
	4.	✅ Integrate image picker using expo-image-picker.
	5.	✅ Track selected images and auto-start when ready.
	6.	✅ Build game logic:
	•	Shuffle deck.
	•	Tap-to-reveal with match-checking.
	•	Delay flip-back on mismatch.
	•	Some satisfying default system click sound.	
	•	Show success screen when done.

⸻

🧠 Tips
	•	Match logic: pair ids and manage flipped state.
	•	Use React.Context or simple prop drilling to pass user selections to the game.
	•	Use emojis via plain Text or flat list.
	•	For gallery images, convert to Image components.

⸻

📦 Dependencies (suggested)

expo install react-navigation react-native-gesture-handler react-native-reanimated expo-image-picker


⸻