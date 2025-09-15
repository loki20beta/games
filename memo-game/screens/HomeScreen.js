import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions
} from 'react-native';

export default function HomeScreen({ navigation }) {
  const [selectedGridSize, setSelectedGridSize] = useState(null);
  const [selectedImageSource, setSelectedImageSource] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [screenData, setScreenData] = useState(Dimensions.get('window'));
  const flashAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const onChange = (result) => {
      setScreenData(result.window);
    };

    const subscription = Dimensions.addEventListener('change', onChange);
    return () => subscription?.remove();
  }, []);

  const isLandscape = screenData.width > screenData.height;

  const gridOptions = [
    { label: 'Small', value: '2x2', totalCards: 4, rows: 2, cols: 2 },
    { label: 'Medium', value: '4x4', totalCards: 16, rows: 4, cols: 4 },
    { label: 'Big', value: '6x6', totalCards: 36, rows: 6, cols: 6 },
  ];

  const imageSourceOptions = [
    { label: '😊', value: 'emoji' },
    { label: '📷', value: 'gallery' },
    { label: '🐷', value: 'peppa' },
    { label: '🐶', value: 'bluey' },
  ];

  useEffect(() => {
    if (currentStep === 2 && selectedImageSource) {
      startFlashAnimation();
    }
  }, [selectedImageSource, currentStep]);

  const startFlashAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(flashAnim, { duration: 500, toValue: 0.3, useNativeDriver: true }),
        Animated.timing(flashAnim, { duration: 500, toValue: 1, useNativeDriver: true }),
      ])
    ).start();
  };

  const stopFlashAnimation = () => {
    flashAnim.stopAnimation();
    flashAnim.setValue(1);
  };

  const handleGridSelection = (gridValue) => {
    setSelectedGridSize(gridValue);
    setTimeout(() => {
      setCurrentStep(2);
    }, 300); // Small delay to show selection feedback
  };

  const handleImageSourceSelection = (sourceValue) => {
    setSelectedImageSource(sourceValue);
  };

  const handleNext = () => {
    if (currentStep === 1 && selectedGridSize) {
      setCurrentStep(2);
      stopFlashAnimation();
      return;
    }

    if (currentStep === 2 && selectedImageSource) {
      const selectedGrid = gridOptions.find(option => option.value === selectedGridSize);
      const requiredImages = selectedGrid.totalCards / 2;

      navigation.navigate('Selection', {
        gridSize: selectedGridSize,
        imageSource: selectedImageSource,
        requiredImages: requiredImages,
        totalCards: selectedGrid.totalCards,
      });
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
    setSelectedImageSource(null);
    stopFlashAnimation();
  };

  const renderGridVisual = (rows, cols) => {
    const squares = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        squares.push(
          <View
            key={`${row}-${col}`}
            style={[
              styles.gridSquare,
              {
                position: 'absolute',
                left: col * 14,
                top: row * 14
              }
            ]}
          />
        );
      }
    }
    return (
      <View style={[styles.gridVisual, { width: cols * 12 + (cols - 1) * 2, height: rows * 12 + (rows - 1) * 2 }]}>
        {squares}
      </View>
    );
  };

  const renderGridOption = (option) => (
    <TouchableOpacity
      key={option.value}
      style={[
        styles.gridButton,
        selectedGridSize === option.value && styles.selectedGridButton
      ]}
      onPress={() => handleGridSelection(option.value)}
    >
      <View style={styles.gridButtonContent}>
        {renderGridVisual(option.rows, option.cols)}
      </View>
    </TouchableOpacity>
  );

  const renderImageSourceOption = (option) => (
    <TouchableOpacity
      key={option.value}
      style={[
        styles.imageSourceButton,
        selectedImageSource === option.value && styles.selectedImageSourceButton
      ]}
      onPress={() => handleImageSourceSelection(option.value)}
    >
      <Text style={styles.imageSourceEmoji}>
        {option.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {currentStep === 1 && (
          <View style={styles.stepContainer}>
            <View style={[styles.gridOptionsContainer, isLandscape && styles.gridOptionsLandscape]}>
              {gridOptions.map(renderGridOption)}
            </View>
          </View>
        )}

        {currentStep === 2 && (
          <View style={styles.stepContainer}>
            <View style={[styles.imageSourceContainer, isLandscape && styles.imageSourceLandscape]}>
              {imageSourceOptions.map(renderImageSourceOption)}
            </View>
          </View>
        )}

        {currentStep === 2 && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backButtonText}>⬅️</Text>
            </TouchableOpacity>
            <Animated.View style={[styles.nextButtonContainer, { opacity: flashAnim }]}>
              <TouchableOpacity
                style={[
                  styles.nextButton,
                  !selectedImageSource && styles.nextButtonDisabled
                ]}
                onPress={handleNext}
                disabled={!selectedImageSource}
              >
                <Text style={[
                  styles.nextButtonText,
                  !selectedImageSource && styles.nextButtonTextDisabled
                ]}>
                  ➡️
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: 40,
  },
  stepContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
    marginBottom: 30,
  },
  gridOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  gridOptionsLandscape: {
    justifyContent: 'center',
    gap: 30,
  },
  gridButton: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 20,
    margin: 8,
    minWidth: 80,
    minHeight: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#dee2e6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  selectedGridButton: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
    transform: [{ scale: 1.1 }],
  },
  gridButtonContent: {
    alignItems: 'center',
  },
  gridVisual: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  gridSquare: {
    width: 12,
    height: 12,
    backgroundColor: '#6c757d',
    margin: 1,
    borderRadius: 2,
  },
  gridButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#495057',
    textAlign: 'center',
  },
  selectedGridButtonText: {
    color: '#1976d2',
  },
  imageSourceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  imageSourceLandscape: {
    justifyContent: 'center',
    gap: 20,
  },
  imageSourceButton: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 20,
    margin: 8,
    width: '40%',
    minHeight: 100,
    minWidth: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#dee2e6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  selectedImageSourceButton: {
    backgroundColor: '#e8f5e8',
    borderColor: '#4caf50',
    transform: [{ scale: 1.1 }],
  },
  imageSourceEmoji: {
    fontSize: 40,
  },
  imageSourceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#495057',
    textAlign: 'center',
  },
  selectedImageSourceText: {
    color: '#388e3c',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 20,
    gap: 15,
  },
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
  backButtonText: {
    color: '#ffffff',
    fontSize: 24,
    textAlign: 'center',
  },
  nextButtonContainer: {
    flex: 1,
    marginLeft: 10,
  },
  nextButton: {
    backgroundColor: '#007bff',
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
  nextButtonDisabled: {
    backgroundColor: '#6c757d',
    borderColor: '#495057',
    shadowOpacity: 0,
    elevation: 0,
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 24,
    textAlign: 'center',
  },
  nextButtonTextDisabled: {
    color: '#adb5bd',
  },
});