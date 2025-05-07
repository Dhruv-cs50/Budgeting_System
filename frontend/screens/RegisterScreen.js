/**
 * RegisterScreen Component
 * 
 * The registration screen of the application that handles new user sign-up.
 * This screen provides a comprehensive form for users to create their account
 * with personal and financial information.
 * 
 * @component
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CustomInput from '../components/common/CustomInput';
import CustomButton from '../components/common/CustomButton';
import { colors, spacing, typography } from '../theme/colors';

/**
 * Test account credentials for development purposes
 * @type {{name: string, email: string, password: string}}
 */
const TEST_ACCOUNT = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123'
};

/**
 * RegisterScreen component for new user registration
 * 
 * @param {Object} props - Component props
 * @param {Object} props.navigation - Navigation object from React Navigation
 * @returns {JSX.Element} RegisterScreen component
 */
const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    occupation: '',
    monthlyIncome: '',
    phoneNumber: '',
    preferredCurrency: '',
    language: '',
    currentBalance: '',
    totalMonthlyBudget: '',
  });
  const [errors, setErrors] = useState({});

  /**
   * Validates all form fields and sets error messages
   * @returns {boolean} Whether the form is valid
   */
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Updates form data and clears field-specific errors
   * @param {string} field - Field name to update
   * @param {string} value - New value for the field
   */
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  /**
   * Handles the registration process
   * Validates form data and makes API request to create new user
   * @async
   */
  const handleRegister = async () => {
    if (validateForm()) {
      const dataToSend = {
        fullName: formData.name || null,
        email: formData.email || null,
        password: formData.password || null,
        dateOfBirth: formData.dateOfBirth || null,
        occupation: formData.occupation || null,
        monthlyIncome: formData.monthlyIncome ? parseFloat(formData.monthlyIncome) : 0,
        phoneNumber: formData.phoneNumber || null,
        preferredCurrency: formData.preferredCurrency || null,
        language: formData.language || null,
        currentBalance: formData.currentBalance ? parseFloat(formData.currentBalance) : 0,
        totalMonthlyBudget: formData.totalMonthlyBudget ? parseFloat(formData.totalMonthlyBudget) : 0
      };

      try {
        const response = await fetch('http://192.168.55.153:5001/api/data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSend),
        });

        if (response.ok) {
          Alert.alert(
            'Registration Successful',
            'Your account has been created successfully!',
            [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
          );
        } else {
          const errorData = await response.json();
          Alert.alert('Error', errorData.message || 'Failed to register. Please try again.');
        }
      } catch (error) {
        Alert.alert('Network Error', 'Unable to connect to the server. Please try again later.');
      }
    }
  };

  /**
   * Fills the form with test account credentials
   */
  const handleUseTestAccount = () => {
    setFormData({
      name: TEST_ACCOUNT.name,
      email: TEST_ACCOUNT.email,
      password: TEST_ACCOUNT.password,
      confirmPassword: TEST_ACCOUNT.password,
      dateOfBirth: '',
      occupation: '',
      monthlyIncome: '',
      phoneNumber: '',
      preferredCurrency: '',
      language: '',
      currentBalance: '',
      totalMonthlyBudget: '',
    });
  };

  return (
    <LinearGradient
      colors={[colors.background.light, colors.primary.light]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to get started</Text>
          </View>

          <View style={styles.form}>
            <CustomInput
              label="Full Name"
              value={formData.name}
              onChangeText={(value) => handleChange('name', value)}
              placeholder="Enter your full name"
              error={errors.name}
            />

            <CustomInput
              label="Email"
              value={formData.email}
              onChangeText={(value) => handleChange('email', value)}
              placeholder="Enter your email"
              keyboardType="email-address"
              error={errors.email}
              autoCapitalize="none"
            />

            <CustomInput
              label="Password"
              value={formData.password}
              onChangeText={(value) => handleChange('password', value)}
              placeholder="Create a password"
              secureTextEntry
              error={errors.password}
            />

            <CustomInput
              label="Confirm Password"
              value={formData.confirmPassword}
              onChangeText={(value) => handleChange('confirmPassword', value)}
              placeholder="Confirm your password"
              secureTextEntry
              error={errors.confirmPassword}
            />

            <CustomInput
              label="Date of Birth"
              value={formData.dateOfBirth}
              onChangeText={(value) => handleChange('dateOfBirth', value)}
              placeholder="YYYY-MM-DD"
              error={errors.dateOfBirth}
            />

            <CustomInput
              label="Occupation"
              value={formData.occupation}
              onChangeText={(value) => handleChange('occupation', value)}
              placeholder="Enter your occupation"
              error={errors.occupation}
            />

            <CustomInput
              label="Monthly Income"
              value={formData.monthlyIncome}
              onChangeText={(value) => handleChange('monthlyIncome', value)}
              placeholder="Enter your monthly income"
              keyboardType="numeric"
              error={errors.monthlyIncome}
            />

            <CustomInput
              label="Phone Number"
              value={formData.phoneNumber}
              onChangeText={(value) => handleChange('phoneNumber', value)}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              error={errors.phoneNumber}
            />

            <CustomInput
              label="Preferred Currency"
              value={formData.preferredCurrency}
              onChangeText={(value) => handleChange('preferredCurrency', value)}
              placeholder="Enter your preferred currency"
              error={errors.preferredCurrency}
            />

            <CustomInput
              label="Language"
              value={formData.language}
              onChangeText={(value) => handleChange('language', value)}
              placeholder="Enter your preferred language"
              error={errors.language}
            />

            <CustomInput
              label="Current Balance"
              value={formData.currentBalance}
              onChangeText={(value) => handleChange('currentBalance', value)}
              placeholder="Enter your current balance"
              keyboardType="numeric"
              error={errors.currentBalance}
            />

            <CustomInput
              label="Total Monthly Budget"
              value={formData.totalMonthlyBudget}
              onChangeText={(value) => handleChange('totalMonthlyBudget', value)}
              placeholder="Enter your total monthly budget"
              keyboardType="numeric"
              error={errors.totalMonthlyBudget}
            />

            <CustomButton
              title="Sign Up"
              onPress={handleRegister}
              size="large"
              style={styles.registerButton}
            />

            <TouchableOpacity
              style={styles.testAccountButton}
              onPress={handleUseTestAccount}
            >
              <Text style={styles.testAccountText}>Use Test Account</Text>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
  },
  header: {
    marginTop: spacing.xl * 2,
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.h1.fontSize,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.body.fontSize,
    color: colors.text.secondary,
  },
  form: {
    marginTop: spacing.xl,
  },
  registerButton: {
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  testAccountButton: {
    backgroundColor: colors.background.main,
    padding: spacing.md,
    borderRadius: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  testAccountText: {
    color: colors.text.secondary,
    fontSize: typography.body.fontSize,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  loginText: {
    color: colors.text.secondary,
  },
  loginLink: {
    color: colors.primary.main,
    fontWeight: '600',
  },
});

export default RegisterScreen; 