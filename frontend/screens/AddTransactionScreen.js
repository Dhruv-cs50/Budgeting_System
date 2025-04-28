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
    date: new Date(),
    notes: '',
    type: 'expense',
  });
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
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

  const handleSubmit = () => {
    if (validateForm()) {
      navigation.goBack();
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
                {formData.date.toLocaleDateString()}
              </Text>
            </TouchableOpacity>

            <CustomInput
              label="Notes"
              value={formData.notes}
              onChangeText={(value) => handleChange('notes', value)}
              placeholder="Add notes (optional)"
              multiline
              numberOfLines={3}
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
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.h1.fontSize,
    fontWeight: 'bold',
    color: colors.text.primary,
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
    marginBottom: spacing.xl,
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
