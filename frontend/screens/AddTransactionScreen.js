import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from 'react-native-modal-datetime-picker';
import CustomInput from '../components/common/CustomInput';
import CustomButton from '../components/common/CustomButton';
import { colors, spacing, typography } from '../theme/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const categories = [
  'Food',
  'Transport',
  'Entertainment',
  'Bills',
  'Shopping',
  'Health',
  'Education',
  'Income',
  'Other',
];

const AddTransactionScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    type: 'expense',
  });
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(formData.amount)) {
      newErrors.amount = 'Amount must be a number';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
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

  const handleDateConfirm = (date) => {
    setFormData(prev => ({
      ...prev,
      date,
    }));
    setDatePickerVisible(false);
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const email = await AsyncStorage.getItem('userEmail');
        const user = await api.getUserByEmail(email);
        const userId = user.user_id || user.userId || user.id;
        if (!userId) {
          alert('User not found');
          return;
        }
        const newTransaction = {
          name: formData.notes || 'Transaction',
          purchaseCategory: formData.category,
          purchaseCost: parseFloat(formData.amount),
          purchaseDate: new Date().toISOString(),
        };
        const response = await fetch(`http://192.168.4.63:5001/api/data/purchase/users/${userId}/transactions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTransaction),
        });
        if (response.ok) {
          navigation.goBack();
        } else {
          alert('Error: Failed to add transaction.');
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
            <Text style={styles.title}>Add Transaction</Text>
            <Text style={styles.subtitle}>Enter your transaction details</Text>
          </View>

          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                formData.type === 'expense' && styles.typeButtonActive,
              ]}
              onPress={() => handleChange('type', 'expense')}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  formData.type === 'expense' && styles.typeButtonTextActive,
                ]}
              >
                Expense
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                formData.type === 'income' && styles.typeButtonActive,
              ]}
              onPress={() => handleChange('type', 'income')}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  formData.type === 'income' && styles.typeButtonTextActive,
                ]}
              >
                Income
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <CustomInput
              label="Amount"
              value={formData.amount}
              onChangeText={(value) => handleChange('amount', value)}
              placeholder="Enter amount"
              keyboardType="numeric"
              error={errors.amount}
            />

            <View style={styles.categoryContainer}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.categoryGrid}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryButton,
                      formData.category === category && styles.categoryButtonActive,
                    ]}
                    onPress={() => handleChange('category', category)}
                  >
                    <Text
                      style={[
                        styles.categoryButtonText,
                        formData.category === category && styles.categoryButtonTextActive,
                      ]}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.category && (
                <Text style={styles.errorText}>{errors.category}</Text>
              )}
            </View>

            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setDatePickerVisible(true)}
            >
              <Text style={styles.dateButtonText}>
                {formData.date}
              </Text>
            </TouchableOpacity>

            <CustomInput
              label="Notes"
              value={formData.notes}
              onChangeText={(value) => handleChange('notes', value)}
              placeholder="Add notes (optional)"
              multiline
              numberOfLines={4}
            />

            <CustomButton
              title="Add Transaction"
              onPress={handleSubmit}
              size="large"
              style={styles.submitButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <DateTimePicker
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={() => setDatePickerVisible(false)}
      />
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
  typeSelector: {
    flexDirection: 'row',
    marginBottom: spacing.xl,
    backgroundColor: colors.background.main,
    borderRadius: spacing.md,
    padding: spacing.xs,
  },
  typeButton: {
    flex: 1,
    padding: spacing.md,
    alignItems: 'center',
    borderRadius: spacing.sm,
  },
  typeButtonActive: {
    backgroundColor: colors.primary.light,
  },
  typeButtonText: {
    fontSize: typography.body.fontSize,
    color: colors.text.secondary,
  },
  typeButtonTextActive: {
    color: colors.text.light,
    fontWeight: '600',
  },
  form: {
    marginTop: spacing.xl,
  },
  categoryContainer: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.body.fontSize,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  categoryButton: {
    backgroundColor: colors.background.main,
    padding: spacing.sm,
    borderRadius: spacing.sm,
    margin: spacing.xs,
    minWidth: '30%',
    alignItems: 'center',
  },
  categoryButtonActive: {
    backgroundColor: colors.primary.light,
  },
  categoryButtonText: {
    fontSize: typography.body.fontSize,
    color: colors.text.primary,
  },
  categoryButtonTextActive: {
    color: colors.text.light,
    fontWeight: '600',
  },
  dateButton: {
    backgroundColor: colors.background.main,
    padding: spacing.md,
    borderRadius: spacing.md,
    marginBottom: spacing.lg,
  },
  dateButtonText: {
    fontSize: typography.body.fontSize,
    color: colors.text.primary,
  },
  errorText: {
    color: '#ff4444',
    fontSize: typography.caption.fontSize,
    marginTop: spacing.xs,
  },
  submitButton: {
    marginTop: spacing.xl,
  },
});

export default AddTransactionScreen;
