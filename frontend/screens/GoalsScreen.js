import React, { useState } from 'react';
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

const mockGoals = [
  {
    id: 1,
    title: 'Emergency Fund',
    targetAmount: 10000,
    currentAmount: 5000,
    targetDate: '2025-12-31',
    category: 'Savings',
  },
  {
    id: 2,
    title: 'New Car',
    targetAmount: 25000,
    currentAmount: 10000,
    targetDate: '2025-06-30',
    category: 'Vehicle',
  },
  {
    id: 3,
    title: 'Vacation',
    targetAmount: 5000,
    currentAmount: 2000,
    targetDate: '2025-08-15',
    category: 'Travel',
  },
];

const GoalsScreen = () => {
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    targetAmount: '',
    targetDate: new Date(),
    category: '',
  });

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
      // If selected date is before April 28, 2025, set it to April 28, 2025
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

  const handleAddGoal = () => {
    // Handle goal creation here
    setIsAddingGoal(false);
    setNewGoal({
      title: '',
      targetAmount: '',
      targetDate: new Date(),
      category: '',
    });
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
        <TextInput
          style={styles.input}
          placeholder="Goal Title"
          value={newGoal.title}
          onChangeText={(text) => setNewGoal(prev => ({ ...prev, title: text }))}
          placeholderTextColor={colors.text.secondary}
        />
        <TextInput
          style={styles.input}
          placeholder="Target Amount"
          value={newGoal.targetAmount}
          onChangeText={(text) => setNewGoal(prev => ({ ...prev, targetAmount: text }))}
          keyboardType="numeric"
          placeholderTextColor={colors.text.secondary}
        />
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setDatePickerVisible(true)}
        >
          <Text style={styles.dateButtonText}>
            {formatDate(newGoal.targetDate)}
          </Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Category"
          value={newGoal.category}
          onChangeText={(text) => setNewGoal(prev => ({ ...prev, category: text }))}
          placeholderTextColor={colors.text.secondary}
        />
        <View style={styles.formButtons}>
          <CustomButton
            title="Cancel"
            onPress={() => setIsAddingGoal(false)}
            variant="outline"
            style={styles.cancelButton}
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

        {mockGoals.map(renderGoalCard)}
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
  cancelButton: {
    flex: 1,
    marginRight: spacing.sm,
  },
  saveButton: {
    flex: 1,
    marginLeft: spacing.sm,
  },
});

export default GoalsScreen;
