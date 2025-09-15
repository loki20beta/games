# 🧠 Memo Cards Game - Work Plan & TODO List

## 📋 Project Overview
Building a React Native + Expo memory matching game with customizable grid sizes, image selection, and swipe-based interactions.

## 🎯 Development Phases

### Phase 1: Project Setup & Core Infrastructure
**Goal**: Set up Expo project with navigation and essential dependencies

### Phase 2: Home Screen Development
**Goal**: Create the main screen for game configuration

### Phase 3: Image Selection System
**Goal**: Build emoji and gallery image selection with swipe interface

### Phase 4: Game Engine Development
**Goal**: Implement core memory game logic and UI

### Phase 5: Polish & Testing
**Goal**: Add animations, sounds, and final polish

---

## ✅ TODO List

### 🏗 Phase 1: Project Setup & Core Infrastructure
- [ ] **P1.1** Initialize Expo React Native project in memo-game folder
- [ ] **P1.2** Install core dependencies (react-navigation, gesture-handler, reanimated)
- [ ] **P1.3** Install image picker dependency (expo-image-picker)
- [ ] **P1.4** Set up navigation structure (Stack Navigator)
- [ ] **P1.5** Create basic app shell with navigation
- [ ] **P1.6** Set up project configuration files (app.json, babel.config.js)
- [ ] **P1.7** Test basic app runs on simulator/device

### 🏠 Phase 2: Home Screen Development
- [ ] **P2.1** Create HomeScreen component structure
- [ ] **P2.2** Implement grid size selector (2x2, 4x4, 6x6 options)
- [ ] **P2.3** Implement image source selector (Emoji/Gallery toggle)
- [ ] **P2.4** Add "Next" button with navigation to SelectionScreen
- [ ] **P2.5** Style HomeScreen with appealing UI design
- [ ] **P2.6** Add form validation for required selections
- [ ] **P2.7** Implement state management for user selections

### 🖼 Phase 3: Image Selection System
- [ ] **P3.1** Create SelectionScreen base component
- [ ] **P3.2** Build EmojiCarousel component
  - [ ] P3.2a Create horizontal scrollable emoji list
  - [ ] P3.2b Implement smooth swipe gestures
  - [ ] P3.2c Add emoji data set (diverse selection)
- [ ] **P3.3** Build GalleryCarousel component
  - [ ] P3.3a Integrate expo-image-picker
  - [ ] P3.3b Request gallery permissions
  - [ ] P3.3c Create horizontal scrollable image list
  - [ ] P3.3d Handle image loading and caching
- [ ] **P3.4** Create SelectButton component (floating bottom-right)
- [ ] **P3.5** Implement selection state management
  - [ ] P3.5a Track selected images array
  - [ ] P3.5b Prevent duplicate selections
  - [ ] P3.5c Show selection progress indicator
- [ ] **P3.6** Auto-navigation when required images selected
- [ ] **P3.7** Add smooth transitions and animations

### 🎮 Phase 4: Game Engine Development
- [ ] **P4.1** Create GameScreen base component
- [ ] **P4.2** Build Card component
  - [ ] P4.2a Design face-down card appearance
  - [ ] P4.2b Implement flip animation
  - [ ] P4.2c Handle card tap interactions
- [ ] **P4.3** Implement game grid layout
  - [ ] P4.3a Dynamic grid based on selected size
  - [ ] P4.3b Responsive card sizing
  - [ ] P4.3c Proper spacing and alignment
- [ ] **P4.4** Create game logic utilities
  - [ ] P4.4a Implement card shuffling algorithm (utils/shuffle.js)
  - [ ] P4.4b Create card pairing system
  - [ ] P4.4c Implement match detection logic
- [ ] **P4.5** Implement game state management
  - [ ] P4.5a Track flipped cards
  - [ ] P4.5b Handle card matching logic
  - [ ] P4.5c Manage game completion detection
- [ ] **P4.6** Add game interactions
  - [ ] P4.6a Card flip on tap
  - [ ] P4.6b Delay before mismatch flip-back
  - [ ] P4.6c Matched pairs stay revealed
- [ ] **P4.7** Create win condition handling
  - [ ] P4.7a Detect game completion
  - [ ] P4.7b Show success screen/modal
  - [ ] P4.7c Add play again functionality

### 🎨 Phase 5: Polish & Testing
- [ ] **P5.1** Add sound effects
  - [ ] P5.1a Card flip sound
  - [ ] P5.1b Match success sound
  - [ ] P5.1c Game completion sound
- [ ] **P5.2** Enhance animations
  - [ ] P5.2a Smooth card flip transitions
  - [ ] P5.2b Match celebration animation
  - [ ] P5.2c Screen transition animations
- [ ] **P5.3** Improve UI/UX
  - [ ] P5.3a Add loading states
  - [ ] P5.3b Implement haptic feedback
  - [ ] P5.3c Add visual feedback for selections
- [ ] **P5.4** Performance optimization
  - [ ] P5.4a Optimize image loading
  - [ ] P5.4b Memory management for large grids
  - [ ] P5.4c Animation performance tuning
- [ ] **P5.5** Testing & Bug fixes
  - [ ] P5.5a Test on iOS simulator
  - [ ] P5.5b Test on Android simulator
  - [ ] P5.5c Test various grid sizes
  - [ ] P5.5d Test with different image sources
- [ ] **P5.6** Documentation
  - [ ] P5.6a Create README for memo-game
  - [ ] P5.6b Document component APIs
  - [ ] P5.6c Add setup instructions

---

## 🏗 Component Architecture

```
memo-game/
├── App.js (Main app entry point)
├── components/
│   ├── Card.js (Individual game card)
│   ├── EmojiCarousel.js (Emoji selection carousel)
│   ├── GalleryCarousel.js (Gallery image carousel)
│   └── SelectButton.js (Floating select button)
├── screens/
│   ├── HomeScreen.js (Game setup screen)
│   ├── SelectionScreen.js (Image selection screen)
│   └── GameScreen.js (Main game screen)
├── utils/
│   └── shuffle.js (Card shuffling utilities)
└── assets/
    └── placeholder.png (Default placeholder image)
```

---

## 📱 User Flow Summary
1. **HomeScreen**: Select grid size (2x2, 4x4, 6x6) → Choose source (Emoji/Gallery) → Tap "Next"
2. **SelectionScreen**: Swipe through images → Tap "Select" to add → Auto-advance when enough selected
3. **GameScreen**: Tap cards to flip → Match pairs → Win screen on completion

---

## 🎯 Success Criteria
- [ ] Game runs smoothly on iOS and Android
- [ ] All grid sizes work correctly (2x2, 4x4, 6x6)
- [ ] Both emoji and gallery image sources functional
- [ ] Smooth swipe gestures and animations
- [ ] Satisfying audio and visual feedback
- [ ] Clean, intuitive user interface
- [ ] Proper error handling and edge cases

---

## 📦 Key Dependencies
```bash
expo install react-navigation react-native-gesture-handler react-native-reanimated expo-image-picker
```

**Priority**: High = P1-P4 (Core functionality), Medium = P5 (Polish)
**Estimated Timeline**: 2-3 weeks for full implementation