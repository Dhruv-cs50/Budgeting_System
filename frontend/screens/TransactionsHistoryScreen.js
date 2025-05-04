import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, typography } from '../theme/colors';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';


const TransactionsHistoryScreen = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const email = await AsyncStorage.getItem('userEmail');
      const user = await api.getUserByEmail(email);
      const purchases = user.purchases || [];
      purchases.sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));
      setTransactions(purchases);
    } catch (err) {
      setError('Failed to load transactions.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <LinearGradient colors={[colors.background.light, colors.primary.light]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Transactions</Text>
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : transactions.length === 0 ? (
          <Text style={styles.placeholderText}>No transactions yet. Add your first transaction to get started!</Text>
        ) : (
          transactions.map((transaction, idx) => (
            <View key={idx} style={styles.transactionItem}>
              <Text style={styles.transactionTitle}>{transaction.name || 'Transaction'}</Text>
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionCategory}>{transaction.purchaseCategory}</Text>
                <Text style={styles.transactionAmount}>
                  ${Number(transaction.purchaseCost || 0).toFixed(2)}
                </Text>
              </View>
              <Text style={styles.transactionDate}>
                {transaction.purchaseDate ? new Date(transaction.purchaseDate).toLocaleDateString() : 'No Date'}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  header: {
    fontSize: typography.h2.fontSize,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.lg,
    textAlign: 'left',
  },
  loadingText: {
    color: colors.text.secondary,
    fontSize: typography.body.fontSize,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.body.fontSize,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  placeholderText: {
    color: colors.text.secondary,
    fontSize: typography.body.fontSize,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  transactionItem: {
    backgroundColor: colors.background.main,
    borderRadius: spacing.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    elevation: 1,
    shadowColor: colors.common.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  transactionTitle: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  transactionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  transactionCategory: {
    color: colors.text.secondary,
    fontSize: typography.caption.fontSize,
  },
  transactionAmount: {
    color: colors.text.primary,
    fontWeight: 'bold',
    fontSize: typography.body.fontSize,
  },
  transactionDate: {
    color: colors.text.secondary,
    fontSize: typography.caption.fontSize,
    textAlign: 'right',
  },
});

export default TransactionsHistoryScreen; 