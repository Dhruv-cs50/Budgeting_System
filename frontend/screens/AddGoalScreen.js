import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CustomInput from '../components/common/CustomInput';
import CustomButton from '../components/common/CustomButton';
import { colors, spacing, typography } from '../theme/colors';

const AddGoalScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    title: '',
    targetAmount: '',
    currentAmount: '',
    deadline: new Date().toISOString().split('T')[0],
    description: '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) {
      newErrors.title = 'Title is required';
    }

    if (!formData.targetAmount) {
      newErrors.targetAmount = 'Target amount is required';
    } else if (isNaN(formData.targetAmount)) {
      newErrors.targetAmount = 'Target amount must be a number';
    }

    if (!formData.currentAmount) {
      newErrors.currentAmount = 'Current amount is required';
    } else if (isNaN(formData.currentAmount)) {
      newErrors.currentAmount = 'Current amount must be a number';
    }

    if (!formData.deadline) {
      newErrors.deadline = 'Deadline is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

  const handleSubmit = async () => {
    if (validateForm()) {
      const dataToSend = {
        title: formData.title,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount),
        deadline: formData.deadline,
        description: formData.description,
      };

      try {
        const response = await fetch('http://192.168.55.153:5001/api/goals', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSend),
        });

        if (response.ok) {
          navigation.navigate('MainTabs');
        } else {
          const errorData = await response.json();
          alert('Error: ' + (errorData.message || 'Failed to add goal.'));
        }
      } catch (error) {
        alert('Network error: ' + error.message);
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
            <Text style={styles.title}>Add Goal</Text>
            <Text style={styles.subtitle}>Set your financial goal</Text>
          </View>

          <View style={styles.form}>
            <CustomInput
              label="Goal Title"
              value={formData.title}
              onChangeText={(value) => handleChange('title', value)}
              placeholder="Enter goal title"
              error={errors.title}
            />

            <CustomInput
              label="Target Amount"
              value={formData.targetAmount}
              onChangeText={(value) => handleChange('targetAmount', value)}
              placeholder="Enter target amount"
              keyboardType="numeric"
              error={errors.targetAmount}
            />

            <CustomInput
              label="Current Amount"
              value={formData.currentAmount}
              onChangeText={(value) => handleChange('currentAmount', value)}
              placeholder="Enter current amount"
              keyboardType="numeric"
              error={errors.currentAmount}
            />

            <CustomInput
              label="Deadline"
              value={formData.deadline}
              onChangeText={(value) => handleChange('deadline', value)}
              placeholder="YYYY-MM-DD"
              error={errors.deadline}
            />

            <CustomInput
              label="Description"
              value={formData.description}
              onChangeText={(value) => handleChange('description', value)}
              placeholder="Add description (optional)"
              multiline
              numberOfLines={4}
            />

            <CustomButton
              title="Add Goal"
              onPress={handleSubmit}
              size="large"
              style={styles.submitButton}
            />
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
  submitButton: {
    marginTop: spacing.xl,
  },
});

export default AddGoalScreen; 