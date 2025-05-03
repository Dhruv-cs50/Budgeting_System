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

//mock credentials
const MOCK_CREDENTIALS = {
  email: 'test@example.com',
  password: 'password123'
};

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState(MOCK_CREDENTIALS.email); //pre filled data
  const [password, setPassword] = useState(MOCK_CREDENTIALS.password); //pre filled data for testing
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleLogin = () => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');

    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }

    if (isValid) {
      //for testing purposes, accept either mock credentials or any valid input
      if ((email === MOCK_CREDENTIALS.email && password === MOCK_CREDENTIALS.password) || 
          process.env.NODE_ENV === 'development') {
        navigation.navigate('MainTabs');
      } else {
        Alert.alert(
          'Test Credentials',
          `Please use these credentials for testing:\nEmail: ${MOCK_CREDENTIALS.email}\nPassword: ${MOCK_CREDENTIALS.password}`,
          [{ text: 'OK' }]
        );
      }
    }
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
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </View>

          <View style={styles.form}>
            <CustomInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              error={emailError}
              autoCapitalize="none"
            />

            <CustomInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              error={passwordError}
            />

            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <CustomButton
              title="Sign In"
              onPress={handleLogin}
              size="large"
              style={styles.loginButton}
            />

            <View style={styles.testCredentials}>
              <Text style={styles.testCredentialsText}>Test Credentials:</Text>
              <Text style={styles.testCredentialsText}>Email: {MOCK_CREDENTIALS.email}</Text>
              <Text style={styles.testCredentialsText}>Password: {MOCK_CREDENTIALS.password}</Text>
            </View>

            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.signUpLink}>Sign Up</Text>
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: spacing.lg,
  },
  forgotPasswordText: {
    color: colors.primary.main,
    fontSize: typography.body.fontSize,
  },
  loginButton: {
    marginBottom: spacing.xl,
  },
  testCredentials: {
    backgroundColor: colors.background.main,
    padding: spacing.md,
    borderRadius: spacing.md,
    marginBottom: spacing.xl,
  },
  testCredentialsText: {
    color: colors.text.secondary,
    fontSize: typography.caption.fontSize,
    marginBottom: spacing.xs,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.xl * 2,
  },
  signUpText: {
    color: colors.text.secondary,
    fontSize: typography.body.fontSize,
  },
  signUpLink: {
    color: colors.primary.main,
    fontWeight: '600',
    fontSize: typography.body.fontSize,
    marginLeft: spacing.xs,
  },
});

export default LoginScreen; 