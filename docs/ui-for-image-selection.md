# 🎨 Custom Image Selection UI Design

## 📋 Overview
This document defines the custom UI design for image selection in the Kids Memory Game. This interface will be used across all image sources: emojis, photos, Peppa Pig, Bluey, and future content.

---

## 🎯 Core Design Concept

### **Carousel/Slider Selector**
- **Primary Interface**: Horizontal scrollable carousel for browsing all available images
- **Acceleration Support**: Fast swiping with momentum for quick navigation through large collections
- **Visual Focus**: Central item is prominently displayed and emphasized

### **Dynamic Scaling Visual Hierarchy**
- **Center Item**: Largest size (primary focus point)
- **Adjacent Items**: Medium size (secondary focus)
- **Peripheral Items**: Progressively smaller toward edges
- **Smooth Transitions**: Animated scaling as items move through positions

---

## 🎮 Interaction Design

### **Selection Mechanism**
1. **Tap to Select**: Tap any visible item in carousel to select it
2. **Auto-Remove**: Selected item disappears from carousel immediately
3. **Visual Feedback**: Smooth animation showing item moving to selection area

### **Selection Display Area**
- **Location**: Top of screen
- **Dynamic Size**: Adapts to required number of items based on grid size
  - 2x2 grid: 2 selection slots
  - 4x4 grid: 8 selection slots
  - 6x6 grid: 18 selection slots
- **Grid Layout**: Items arranged in neat rows matching game grid proportions

### **Deselection Process**
- **Tap to Remove**: Tap any item in selection area to deselect
- **Return to Carousel**: Deselected item reappears in original carousel position
- **Smooth Animation**: Visual transition from selection area back to carousel

---

## 🔄 Navigation & Flow

### **Carousel Behavior**
- **Swipe Left/Right**: Navigate through available images
- **Momentum Scrolling**: Fast swipes continue with deceleration
- **Snap to Center**: Items automatically align to center position
- **Infinite Loop**: Carousel wraps around at ends (optional)

### **Visual States**
- **Available**: Normal appearance in carousel
- **Selected**: Removed from carousel, appears in top selection area
- **Hover/Touch**: Slight scale increase on touch feedback

---

## 📱 Layout Structure

```
┌─────────────────────────────────────┐
│  SELECTION AREA (Top)               │
│  [📦] [📦] [📦] ... (Grid Layout)   │
├─────────────────────────────────────┤
│                                     │
│  CAROUSEL (Center)                  │
│  [🔸] [🔹] [🔷] [🔹] [🔸]          │
│   ↑      ↑      ↑      ↑      ↑    │
│  small  med   LARGE   med   small   │
│                                     │
│  Navigation Area (Bottom)           │
│  [← Back]              [Next →]    │
└─────────────────────────────────────┘
```

---

## 🎨 Visual Design Specifications

### **Size Scaling System**
- **Center Item**: 100% scale (e.g., 80px)
- **Adjacent Items**: 75% scale (e.g., 60px)
- **Peripheral Items**: 50% scale (e.g., 40px)
- **Far Items**: 25% scale (e.g., 20px)

### **Selection Area Design**
- **Grid Layout**: Matches chosen grid size proportions
- **Item Size**: Consistent medium size (e.g., 50px)
- **Spacing**: Comfortable gaps for touch targets
- **Background**: Subtle container to show available slots

### **Animation Specifications**
- **Selection**: 300ms smooth transition from carousel to selection area
- **Deselection**: 300ms smooth transition back to carousel
- **Carousel Movement**: 200ms snap-to-center animation
- **Scale Changes**: 150ms smooth scaling as items move through positions

---

## 🔧 Technical Requirements

### **Data Management**
- **Available Items**: Dynamic list that removes selected items
- **Selected Items**: Array tracking chosen items in selection order
- **Original Dataset**: Immutable reference for restoration

### **State Management**
- **Carousel Position**: Current center item index
- **Selection State**: Array of selected items with metadata
- **UI State**: Animation states, touch states, loading states

### **Performance Considerations**
- **Lazy Loading**: Only render visible carousel items + buffer
- **Smooth Scrolling**: 60fps scroll performance
- **Memory Management**: Efficient image handling for large datasets

---

## 🎯 Universal Application

### **Adaptable for All Image Sources**
- **Emojis**: Native Unicode emoji characters
- **Photos**: User gallery images with thumbnails
- **Peppa Pig**: Bundled character assets
- **Bluey**: Bundled character assets
- **Future Content**: Any image-based content

### **Consistent Behavior**
- Same interaction patterns across all image types
- Same visual hierarchy and scaling
- Same selection/deselection flow
- Adaptive sizing based on content type

---

## ✅ Success Criteria

### **Usability Goals**
- [ ] Intuitive for children ages 3+
- [ ] Fast navigation through large image collections
- [ ] Clear visual feedback for all interactions
- [ ] Easy correction of selection mistakes

### **Technical Goals**
- [ ] Smooth 60fps animations
- [ ] Responsive touch interactions
- [ ] Memory-efficient for large image sets
- [ ] Works on both portrait and landscape orientations

---

## 🚀 Implementation Priority

1. **Phase 1**: Basic carousel with emoji dataset
2. **Phase 2**: Selection area and interaction logic
3. **Phase 3**: Animations and visual polish
4. **Phase 4**: Performance optimization
5. **Phase 5**: Adaptation for other image sources

---

*This design creates a unified, child-friendly interface that scales from simple emoji selection to complex photo browsing while maintaining consistent behavior across all content types.*