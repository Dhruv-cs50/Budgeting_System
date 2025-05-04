import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CustomButton from '../components/common/CustomButton';
import { colors, spacing, typography } from '../theme/colors';
import api from '../services/api';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CATEGORIES = [
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

const HomeScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEmpty, setIsEmpty] = useState(false);
  const nav = useNavigation();

  const fetchUserDataByEmail = useCallback(async (email) => {
    setLoading(true);
    setError(null);
    try {
      if (!email) {
        setError('No user email found. Please log in again.');
        setLoading(false);
        return;
      }
      const user = await api.getUserByEmail(email);
      if (!user || user.error) {
        setError('User not found. Please log in again.');
        setLoading(false);
        return;
      }
      const purchases = user.purchases || [];
      const now = new Date();
      const currentMonthPurchases = purchases.filter(p => {
        const d = new Date(p.purchaseDate);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      });
    
      const totalSpent = currentMonthPurchases.reduce((sum, p) => sum + (p.purchaseCost || 0), 0);
      const remainingBudget = user.totalMonthlyBudget - totalSpent;
      const spendingByCategory = CATEGORIES.map(cat => {
        const amount = currentMonthPurchases
          .filter(p => p.purchaseCategory === cat)
          .reduce((sum, p) => sum + (p.purchaseCost || 0), 0);
        return { name: cat, amount };
      });
      setUserData({
        balance: user.currentBalance,
        monthlyBudget: user.totalMonthlyBudget,
        spent: totalSpent,
        remainingBudget,
        spendingCategories: spendingByCategory
      });
    } catch (err) {
      setError('Failed to load user data. Please check your connection or try again.');
      setLoading(false);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      const getUserEmailAndFetch = async () => {
        try {
          const storedUserEmail = await AsyncStorage.getItem('userEmail');
          console.log('Loaded userEmail from AsyncStorage:', storedUserEmail);
          await fetchUserDataByEmail(storedUserEmail);
        } catch (err) {
          setError('Failed to load user info. Please log in again.');
          setLoading(false);
        }
      };
      getUserEmailAndFetch();
    }, [fetchUserDataByEmail])
  );

  useEffect(() => {
    const unsubscribe = nav.addListener('tabPress', () => {
      AsyncStorage.getItem('userEmail').then(email => fetchUserDataByEmail(email));
    });
    return unsubscribe;
  }, [nav, fetchUserDataByEmail]);

  const renderTransactionItem = (transaction) => (
    <TouchableOpacity
      key={transaction.id}
      style={styles.transactionItem}
      onPress={() => navigation.navigate('TransactionDetails', { transaction })}
    >
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionTitle}>{transaction.title}</Text>
        <Text style={styles.transactionCategory}>{transaction.category}</Text>
      </View>
      <View style={styles.transactionAmount}>
        <Text
          style={[
            styles.amountText,
            transaction.amount > 0 ? styles.incomeText : styles.expenseText,
          ]}
        >
          {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)}
        </Text>
        <Text style={styles.transactionDate}>{transaction.date}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryItem = (category) => (
    <View key={category.name} style={styles.categoryItem}>
      <View style={styles.categoryHeader}>
        <Text style={styles.categoryName}>{category.name}</Text>
        <Text style={styles.categoryAmount}>${Number(category.amount || 0).toFixed(2)}</Text>
      </View>
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            {
              width: Number(userData.spent) > 0
                ? `${(Number(category.amount || 0) / Number(userData.spent || 1)) * 100}%`
                : '0%',
            },
          ]}
        />
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <CustomButton
          title="Retry"
          onPress={() => setLoading(true)}
        />
      </View>
    );
  }

  if (isEmpty) {
    return (
      <LinearGradient
        colors={[colors.background.light, colors.primary.light]}
        style={styles.container}
      >
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Welcome to Your Budgeting App!</Text>
          <Text style={styles.emptyText}>
            You don't have any transactions or data yet. Start by adding your first transaction or setting up your budget.
          </Text>
          <CustomButton
            title="Add Transaction"
            onPress={() => navigation.navigate('AddTransaction')}
            size="large"
            style={styles.emptyButton}
          />
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[colors.background.light, colors.primary.light]}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Current Balance</Text>
            <Text style={styles.balanceAmount}>${Number(userData.balance || 0).toFixed(2)}</Text>
          </View>
          <View style={styles.budgetCard}>
            <Text style={styles.budgetTitle}>Monthly Budget</Text>
            <Text style={styles.budgetAmount}>
              ${Number(userData.remainingBudget || 0).toFixed(2)} left / ${Number(userData.monthlyBudget || 0).toFixed(2)}
            </Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${(Number(userData.spent || 0) / Number(userData.monthlyBudget || 1)) * 100}%` },
                ]}
              />
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Spending Categories</Text>
          {userData.spendingCategories.map(renderCategoryItem)}
        </View>
        <View style={styles.fabContainer}>
          <CustomButton
            title="Add Transaction"
            onPress={() => navigation.navigate('AddTransaction')}
            size="large"
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    fontSize: typography.h2.fontSize,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: typography.body.fontSize,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  emptyButton: {
    width: '80%',
  },
  errorText: {
    color: colors.error,
    fontSize: typography.body.fontSize,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: spacing.lg,
  },
  balanceCard: {
    backgroundColor: colors.background.main,
    borderRadius: spacing.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: colors.common.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  balanceLabel: {
    fontSize: typography.body.fontSize,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  balanceAmount: {
    fontSize: typography.h1.fontSize,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  budgetCard: {
    backgroundColor: colors.background.main,
    borderRadius: spacing.md,
    padding: spacing.lg,
    elevation: 2,
    shadowColor: colors.common.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  budgetTitle: {
    fontSize: typography.body.fontSize,
    color: colors.text.secondary,
  },
  budgetAmount: {
    fontSize: typography.body.fontSize,
    color: colors.text.primary,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.background.dark,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary.light,
    borderRadius: 4,
  },
  section: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.h3.fontSize,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  categoryItem: {
    marginBottom: spacing.md,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  categoryName: {
    fontSize: typography.body.fontSize,
    color: colors.text.primary,
  },
  categoryAmount: {
    fontSize: typography.body.fontSize,
    color: colors.text.primary,
    fontWeight: '600',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background.main,
    padding: spacing.md,
    borderRadius: spacing.md,
    marginBottom: spacing.sm,
    elevation: 1,
    shadowColor: colors.common.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: typography.body.fontSize,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  transactionCategory: {
    fontSize: typography.caption.fontSize,
    color: colors.text.secondary,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  incomeText: {
    color: colors.primary.light,
  },
  expenseText: {
    color: '#ff4444',
  },
  transactionDate: {
    fontSize: typography.caption.fontSize,
    color: colors.text.secondary,
  },
  fabContainer: {
    position: 'absolute',
    bottom: spacing.xl,
    left: spacing.lg,
    right: spacing.lg,
  },
});

export default HomeScreen;
