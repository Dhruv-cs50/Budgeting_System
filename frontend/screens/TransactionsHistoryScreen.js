import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, typography } from '../theme/colors';

// mock data for testing
const mockTransactions = [
  {
    id: '1',
    title: 'Grocery Shopping',
    amount: -75.50,
    category: 'Food',
    date: '2024-03-15',
  },
  {
    id: '2',
    title: 'Salary Deposit',
    amount: 3000.00,
    category: 'Income',
    date: '2024-03-14',
  },
  {
    id: '3',
    title: 'Netflix Subscription',
    amount: -15.99,
    category: 'Entertainment',
    date: '2024-03-13',
  },
  {
    id: '4',
    title: 'Gas Station',
    amount: -45.00,
    category: 'Transport',
    date: '2024-03-12',
  },
];

const categories = ['All', 'Food', 'Transport', 'Entertainment', 'Bills', 'Income'];

const TransactionsHistoryScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = mockTransactions.filter(transaction => {
    const matchesCategory = selectedCategory === 'All' || transaction.category === selectedCategory;
    const matchesSearch = transaction.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderTransactionItem = ({ item }) => (
    <TouchableOpacity
      style={styles.transactionItem}
      onPress={() => navigation.navigate('TransactionDetails', { transaction: item })}
    >
      <View style={styles.transactionLeft}>
        <Text style={styles.transactionTitle}>{item.title}</Text>
        <Text style={styles.transactionCategory}>{item.category}</Text>
      </View>
      <View style={styles.transactionRight}>
        <Text
          style={[
            styles.transactionAmount,
            item.amount > 0 ? styles.incomeAmount : styles.expenseAmount,
          ]}
        >
          ${Math.abs(item.amount).toFixed(2)}
        </Text>
        <Text style={styles.transactionDate}>{formatDate(item.date)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={[colors.background.light, colors.primary.light]}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Transactions</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search transactions"
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.text.secondary}
        />
      </View>

      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === item && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory === item && styles.categoryButtonTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {filteredTransactions.length > 0 ? (
        <FlatList
          data={filteredTransactions}
          renderItem={renderTransactionItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.transactionsList}
        />
      ) : (
        <View style={styles.noTransactionsContainer}>
          <Text style={styles.noTransactionsText}>No transactions found</Text>
        </View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
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
  searchContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  searchInput: {
    backgroundColor: colors.background.main,
    padding: spacing.md,
    borderRadius: spacing.md,
    fontSize: typography.body.fontSize,
    color: colors.text.primary,
  },
  categoriesContainer: {
    marginBottom: spacing.md,
  },
  categoriesList: {
    paddingHorizontal: spacing.lg,
  },
  categoryButton: {
    backgroundColor: colors.background.main,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: spacing.md,
    marginRight: spacing.sm,
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
  transactionsList: {
    paddingHorizontal: spacing.lg,
  },
  transactionItem: {
    backgroundColor: colors.background.main,
    padding: spacing.md,
    borderRadius: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  transactionLeft: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: typography.body.fontSize,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  transactionCategory: {
    fontSize: typography.caption.fontSize,
    color: colors.text.secondary,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  incomeAmount: {
    color: colors.success,
  },
  expenseAmount: {
    color: colors.error,
  },
  transactionDate: {
    fontSize: typography.caption.fontSize,
    color: colors.text.secondary,
  },
  noTransactionsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noTransactionsText: {
    fontSize: typography.body.fontSize,
    color: colors.text.secondary,
  },
});

export default TransactionsHistoryScreen; 