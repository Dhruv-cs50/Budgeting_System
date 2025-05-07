/**
 * WelcomeScreen Component
 * 
 * The initial screen of the application that displays an onboarding carousel.
 * This screen introduces users to the main features of the budgeting app through
 * a series of slides with images and descriptions.
 * @component
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CustomButton from '../components/common/CustomButton';
import { colors, spacing, typography } from '../theme/colors';

const { width } = Dimensions.get('window');

/**
 * Onboarding slides data
 * @type {Array<{id: number, title: string, description: string, image: any}>}
 */
const slides = [
  {
    id: 1,
    title: 'Track Your Expenses',
    description: 'Easily monitor your spending and stay within your budget',
    image: require('../assets/logo.png'),
  },
  {
    id: 2,
    title: 'Set Financial Goals',
    description: 'Create and track your savings goals for a better future',
    image: require('../assets/logo.png'),
  },
  {
    id: 3,
    title: 'Smart Analytics',
    description: 'Get insights into your spending habits with detailed reports',
    image: require('../assets/logo.png'),
  },
];

/**
 * WelcomeScreen component for onboarding users
 * 
 * @param {Object} props - Component props
 * @param {Object} props.navigation - Navigation object from React Navigation
 * @returns {JSX.Element} WelcomeScreen component
 */
const WelcomeScreen = ({ navigation }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  /**
   * Handles the next button press
   * Advances to the next slide or navigates to Login screen if on last slide
   */
  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigation.navigate('Login');
    }
  };

  /**
   * Handles the skip button press
   * Navigates directly to the Login screen
   */
  const handleSkip = () => {
    navigation.navigate('Login');
  };

  return (
    <LinearGradient
      colors={[colors.background.light, colors.primary.light]}
      style={styles.container}
    >
      <View style={styles.skipContainer}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.slideContainer}>
        <Image
          source={slides[currentSlide].image}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>{slides[currentSlide].title}</Text>
        <Text style={styles.description}>{slides[currentSlide].description}</Text>
      </View>

      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              currentSlide === index && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <CustomButton
          title={currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
          onPress={handleNext}
          size="large"
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  skipContainer: {
    alignItems: 'flex-end',
    marginTop: spacing.xl,
  },
  skipText: {
    color: colors.text.primary,
    fontSize: typography.body.fontSize,
  },
  slideContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: width * 0.7,
    height: width * 0.7,
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.h2.fontSize,
    fontWeight: 'bold',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  description: {
    fontSize: typography.body.fontSize,
    color: '#000000',
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.secondary.light,
    marginHorizontal: spacing.xs,
  },
  paginationDotActive: {
    backgroundColor: colors.primary.main,
    width: 16,
  },
  buttonContainer: {
    marginBottom: spacing.xl,
  },
});

export default WelcomeScreen;
