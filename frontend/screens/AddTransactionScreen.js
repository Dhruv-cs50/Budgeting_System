/**
 * AddTransactionScreen Component
 * 
 * A screen that allows users to add new financial transactions.
 * Supports both income and expense transactions with different fields
 * and validation rules for each type.
 * 
 * @component
 */

import React, { useState, useEffect } from 'react';
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
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

/**
 * Available transaction categories
 * @constant
 * @type {string[]}
 */
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

/**
 * Mock financial goals for testing
 * @constant
 * @type {Array<{id: number, title: string}>}
 */
const mockGoals = [
  { id: 1, title: 'Emergency Fund' },
  { id: 2, title: 'New Car' },
  { id: 3, title: 'Vacation' },
];

/**
 * AddTransactionScreen component for adding new transactions
 * 
 * @param {Object} props - Component props
 * @param {Object} props.navigation - Navigation object for screen navigation
 * @returns {JSX.Element} AddTransactionScreen component
 */
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
  const [selectedGoalId, setSelectedGoalId] = useState('');
  const [goals, setGoals] = useState([]);

  /**
   * Effect hook to fetch user's financial goals
   */
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const email = await AsyncStorage.getItem('userEmail');
        const user = await api.getUserByEmail(email);
        const userGoals = user.financialGoals || [];
        setGoals(userGoals);
      } catch (e) {
        setGoals([]);
      }
    };
    fetchGoals();
  }, []);

  /**
   * Validates the form data and sets error messages
   * @returns {boolean} True if form is valid, false otherwise
   */
  const validateForm = () => {
    const newErrors = {};
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(formData.amount)) {
      newErrors.amount = 'Amount must be a number';
    }
    if (formData.type === 'expense' && !formData.category) {
      newErrors.category = 'Category is required';
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles changes to form input fields
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
   * Handles date selection from the date picker
   * @param {Date} date - Selected date
   */
  const handleDateConfirm = (date) => {
    setFormData(prev => ({
      ...prev,
      date,
    }));
    setDatePickerVisible(false);
  };

  /**
   * Handles form submission and creates a new transaction
   * @async
   */
  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const email = await AsyncStorage.getItem('userEmail');
        if (!email) {
          alert('User email not found. Please log in again.');
          return;
        }
        const user = await api.getUserByEmail(email);
        const userId = user.user_id || user.userId || user.id;
        if (!userId) {
          alert('User not found');
          return;
        }
        const amount = Math.abs(parseFloat(formData.amount));
        const newTransaction = {
          name: formData.notes || 'Transaction',
          purchaseCategory: formData.type === 'expense' ? formData.category : '',
          purchaseCost: formData.type === 'expense' ? -amount : amount,
          purchaseDate: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString(),
        };
        if (formData.type === 'income' && selectedGoalId !== '' && selectedGoalId !== null && selectedGoalId !== undefined) {
          newTransaction.goalId = parseInt(selectedGoalId, 10);
          console.log('Assigning goalId to transaction:', newTransaction.goalId);
        }
        console.log('Transaction to add:', newTransaction);
        const addTxRes = await fetch(`http://192.168.55.153:5001/api/data/purchase/users/${userId}/transactions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTransaction),
        });
        if (!addTxRes.ok) {
          const errData = await addTxRes.json();
          console.error('Failed to add transaction:', errData);
          alert('Error: Failed to add transaction.');
          return;
        }
        const addTxData = await addTxRes.json();
        console.log('Transaction added:', addTxData);
        if (formData.type === 'income' && selectedGoalId !== '' && selectedGoalId !== null && selectedGoalId !== undefined) {
          const goalId = parseInt(selectedGoalId, 10);
          console.log('Patching goal:', { userId, goalId, amount });
          await api.updateGoalAmount(userId, goalId, amount);
        }
        if (formData.type === 'income') {
          const newBalance = (user.currentBalance || 0) + amount;
          const url = `http://192.168.55.153:5001/users/email/${encodeURIComponent(email)}`;
          const payload = { currentBalance: newBalance };
          try {
            const patchRes = await fetch(url, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });
            const patchData = await patchRes.json();
            if (!patchRes.ok) {
              console.error('Failed to update balance:', patchData);
              alert('Failed to update balance after income transaction.');
              return;
            }
          } catch (e) {
            console.error('Network or server error (PATCH):', e);
            alert('Network or server error while updating balance.');
            return;
          }
        }
        navigation.goBack();
      } catch (error) {
        console.error('Network or server error:', error);
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
        <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: spacing.xl * 4 }]}>
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

            {formData.type === 'expense' && (
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
            )}

            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setDatePickerVisible(true)}
            >
              <Text style={styles.dateButtonText}>
                {formData.date ? new Date(formData.date).toLocaleDateString() : 'Select Date'}
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

            {formData.type === 'income' && (
              <View style={styles.goalSelector}>
                <Text style={styles.label}>Assign to Goal (Optional)</Text>
                <Picker
                  selectedValue={selectedGoalId}
                  onValueChange={(value) => setSelectedGoalId(value)}
                  style={styles.picker}
                >
                  <Picker.Item label="None" value="" />
                  {goals.map((goal) => (
                    <Picker.Item
                      key={goal.id}
                      label={goal.title}
                      value={goal.id.toString()}
                    />
                  ))}
                </Picker>
              </View>
            )}

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
  goalSelector: {
    marginBottom: spacing.lg,
  },
  picker: {
    width: '100%',
    height: 50,
  },
});

export default AddTransactionScreen;
