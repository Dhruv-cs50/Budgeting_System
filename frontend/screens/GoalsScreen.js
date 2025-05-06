import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from 'react-native-modal-datetime-picker';
import CustomButton from '../components/common/CustomButton';
import { colors, spacing, typography } from '../theme/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const BACKEND_URL = 'http://192.168.55.153:5001';

const getUserIdByEmail = async (email) => {
  const res = await fetch(`${BACKEND_URL}/users/email/${encodeURIComponent(email)}`);
  if (!res.ok) throw new Error('User not found');
  const user = await res.json();
  return user.user_id || user.userId;
};

const GoalsScreen = () => {
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    targetAmount: '',
    targetDate: new Date(),
    category: '',
  });
  const [goals, setGoals] = useState([]);

  const fetchGoals = async () => {
    try {
      const email = await AsyncStorage.getItem('userEmail');
      if (!email) throw new Error('User email not found');
      const userId = await getUserIdByEmail(email);
      const response = await fetch(`${BACKEND_URL}/users/${userId}/goals`);
      const data = await response.json();
      if (data.goals) {
        setGoals(data.goals);
      } else {
        setGoals([]);
      }
    } catch (error) {
      setGoals([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchGoals();
    }, [])
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const calculateProgress = (current, target) => {
    return (current / target) * 100;
  };

  const handleDateConfirm = (date) => {
    const minDate = new Date('2025-04-28');
    if (date < minDate) {
      setNewGoal(prev => ({
        ...prev,
        targetDate: minDate,
      }));
    } else {
      setNewGoal(prev => ({
        ...prev,
        targetDate: date,
      }));
    }
    setDatePickerVisible(false);
  };

  const handleAddGoal = async () => {
    try {
      const email = await AsyncStorage.getItem('userEmail');
      if (!email) {
        alert('User email not found. Please log in again.');
        return;
      }
      const userId = await getUserIdByEmail(email);
      const dataToSend = {
        title: newGoal.title,
        targetAmount: parseFloat(newGoal.targetAmount),
        targetDate: newGoal.targetDate.toISOString().split('T')[0],
        category: newGoal.category,
        currentAmount: 0
      };
      const response = await fetch(`${BACKEND_URL}/users/${userId}/goals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });
      if (!response.ok) {
        alert('Failed to add goal');
        return;
      }
      await fetchGoals();
      setIsAddingGoal(false);
      setNewGoal({
        title: '',
        targetAmount: '',
        targetDate: new Date(),
        category: '',
      });
    } catch (error) {
      alert('Network error: ' + error.message);
    }
  };

  const renderGoalCard = (goal) => {
    const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
    
    return (
      <View key={goal.id} style={styles.goalCard}>
        <View style={styles.goalHeader}>
          <Text style={styles.goalTitle}>{goal.title}</Text>
          <Text style={styles.goalCategory}>{goal.category}</Text>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>{progress.toFixed(0)}%</Text>
        </View>

        <View style={styles.goalInfo}>
          <View>
            <Text style={styles.infoLabel}>Current</Text>
            <Text style={styles.infoAmount}>${goal.currentAmount.toLocaleString()}</Text>
          </View>
          <View>
            <Text style={styles.infoLabel}>Target</Text>
            <Text style={styles.infoAmount}>${goal.targetAmount.toLocaleString()}</Text>
          </View>
          <View>
            <Text style={styles.infoLabel}>Target Date</Text>
            <Text style={styles.infoDate}>{formatDate(goal.targetDate)}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderAddGoalForm = () => {
    if (!isAddingGoal) {
      return (
        <CustomButton
          title="Add New Goal"
          onPress={() => setIsAddingGoal(true)}
          size="large"
          style={styles.addButton}
        />
      );
    }

    return (
      <View style={styles.addGoalForm}>
        <Text style={styles.label}>Goal Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Goal Title"
          value={newGoal.title}
          onChangeText={(text) => setNewGoal(prev => ({ ...prev, title: text }))}
          placeholderTextColor={colors.text.secondary}
        />
        <Text style={styles.label}>Target Amount</Text>
        <TextInput
          style={styles.input}
          placeholder="Target Amount"
          value={newGoal.targetAmount}
          onChangeText={(text) => setNewGoal(prev => ({ ...prev, targetAmount: text }))}
          keyboardType="numeric"
          placeholderTextColor={colors.text.secondary}
        />
        <Text style={styles.label}>Target Date</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setDatePickerVisible(true)}
        >
          <Text style={styles.dateButtonText}>
            {formatDate(newGoal.targetDate)}
          </Text>
        </TouchableOpacity>
        <View style={styles.formButtons}>
          <CustomButton
            title="Cancel"
            onPress={() => setIsAddingGoal(false)}
            style={styles.saveButton}
          />
          <CustomButton
            title="Save Goal"
            onPress={handleAddGoal}
            style={styles.saveButton}
          />
        </View>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={[colors.background.light, colors.primary.light]}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Financial Goals</Text>
        </View>

        {goals.map(renderGoalCard)}
        {renderAddGoalForm()}
      </ScrollView>

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
  scrollView: {
    flex: 1,
  },
  header: {
    padding: spacing.lg,
  },
  title: {
    fontSize: typography.h1.fontSize,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  goalCard: {
    backgroundColor: colors.background.main,
    borderRadius: spacing.md,
    padding: spacing.lg,
    margin: spacing.lg,
    elevation: 2,
    shadowColor: colors.common.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  goalTitle: {
    fontSize: typography.h3.fontSize,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  goalCategory: {
    fontSize: typography.caption.fontSize,
    color: colors.text.secondary,
    backgroundColor: colors.background.dark,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.sm,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.background.dark,
    borderRadius: 4,
    marginRight: spacing.md,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary.light,
    borderRadius: 4,
  },
  progressText: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: colors.text.primary,
  },
  goalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoLabel: {
    fontSize: typography.caption.fontSize,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  infoAmount: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: colors.text.primary,
  },
  infoDate: {
    fontSize: typography.body.fontSize,
    color: colors.text.primary,
  },
  addButton: {
    margin: spacing.lg,
  },
  addGoalForm: {
    backgroundColor: colors.background.main,
    borderRadius: spacing.md,
    padding: spacing.lg,
    margin: spacing.lg,
    elevation: 2,
    shadowColor: colors.common.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  input: {
    backgroundColor: colors.background.dark,
    borderRadius: spacing.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    fontSize: typography.body.fontSize,
    color: colors.text.primary,
  },
  dateButton: {
    backgroundColor: colors.background.dark,
    borderRadius: spacing.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  dateButtonText: {
    fontSize: typography.body.fontSize,
    color: colors.text.primary,
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  label: {
    fontSize: typography.caption.fontSize,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
});

export default GoalsScreen;
