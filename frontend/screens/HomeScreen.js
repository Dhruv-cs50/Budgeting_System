import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CustomButton from '../components/common/CustomButton';
import { colors, spacing, typography } from '../theme/colors';

//mock data for testing
const mockData = {
  balance: 2500.00,
  monthlyBudget: 3000.00,
  spent: 1500.00,
  recentTransactions: [
    { id: 1, title: 'Grocery Shopping', amount: -85.50, category: 'Food', date: 'Today' },
    { id: 2, title: 'Salary', amount: 3000.00, category: 'Income', date: 'Yesterday' },
    { id: 3, title: 'Netflix', amount: -15.99, category: 'Entertainment', date: 'Yesterday' },
    { id: 4, title: 'Gas Station', amount: -45.00, category: 'Transport', date: '2 days ago' },
  ],
  spendingCategories: [
    { name: 'Food', amount: 450.00, percentage: 30 },
    { name: 'Transport', amount: 200.00, percentage: 13 },
    { name: 'Entertainment', amount: 150.00, percentage: 10 },
    { name: 'Bills', amount: 700.00, percentage: 47 },
  ],
};

const HomeScreen = ({ navigation }) => {
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
        <Text style={styles.categoryAmount}>${category.amount.toFixed(2)}</Text>
      </View>
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${category.percentage}%` },
          ]}
        />
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={[colors.background.light, colors.primary.light]}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Current Balance</Text>
            <Text style={styles.balanceAmount}>${mockData.balance.toFixed(2)}</Text>
          </View>

          <View style={styles.budgetCard}>
            <View style={styles.budgetHeader}>
              <Text style={styles.budgetTitle}>Monthly Budget</Text>
              <Text style={styles.budgetAmount}>
                ${mockData.spent.toFixed(2)} / ${mockData.monthlyBudget.toFixed(2)}
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${(mockData.spent / mockData.monthlyBudget) * 100}%`,
                  },
                ]}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Spending Categories</Text>
          {mockData.spendingCategories.map(renderCategoryItem)}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => navigation.navigate('TransactionsHistory')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          {mockData.recentTransactions.map(renderTransactionItem)}
        </View>
      </ScrollView>

      <View style={styles.fabContainer}>
        <CustomButton
          title="Add Transaction"
          onPress={() => navigation.navigate('AddTransaction')}
          size="large"
        />
      </View>
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
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.h3.fontSize,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  viewAllText: {
    color: colors.primary.main,
    fontSize: typography.body.fontSize,
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
