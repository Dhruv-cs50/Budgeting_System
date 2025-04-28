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

const WelcomeScreen = ({ navigation }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigation.navigate('Login');
    }
  };

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
    color: colors.text.secondary,
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
