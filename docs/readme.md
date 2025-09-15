
🧠 Memo Cards Game – Agent Setup README

This document outlines the goals, features, and starting plan for building a Memo Card Game using React Native + Expo. It’s written for an autonomous coding agent or AI assistant.

⸻

🎯 Goal

Create a simple, visually engaging memory matching game with a customisable setup and swipe-based image selection.

⸻

🧩 Key Features
	1.	Customizable Field Size
	•	User chooses number of cards (e.g. 2x2, 4x4, 6x6).
	2.	Image Source Choice
	•	User selects between:
	•	Emojis (default emoji set)
	•	Gallery photos (via image picker)
	3.	Swipe-Based Selection
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