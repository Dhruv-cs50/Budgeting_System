import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, G, Circle } from 'react-native-svg';
import { colors, spacing, typography } from '../theme/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { useFocusEffect } from '@react-navigation/native';

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

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - spacing.lg * 2;
const CHART_RADIUS = CHART_WIDTH / 2.5;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const CHART_COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#96CEB4', // Green
  '#FFEEAD', // Yellow
  '#D4A5A5', // Pink
  '#9B786F', // Brown
  '#A8E6CF', // Mint
  '#FFD3B6', // Orange
];

const AnalyticsScreen = () => {
  const [monthlySpending, setMonthlySpending] = useState([]);
  const [categorySpending, setCategorySpending] = useState([]);
  const [savings, setSavings] = useState({ current: 0, goal: 0, monthlyTarget: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAndProcessData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const email = await AsyncStorage.getItem('userEmail');
      if (!email) throw new Error('No user email found. Please log in again.');
      
      const user = await api.getUserByEmail(email);
      if (!user || user.error) throw new Error('User not found. Please log in again.');
      
      const purchases = user.purchases || [];
      console.log('Fetched purchases for analytics:', purchases.length);

      // --- Monthly Spending (last 4 months) ---
      const now = new Date();
      const monthlyTotals = Array(12).fill(0);
      purchases.forEach(tx => {
        if (tx.purchaseDate) {
          const date = new Date(tx.purchaseDate);
          const monthIdx = date.getMonth();
          // Only count expenses (negative purchaseCost) for spending charts
          if (date.getFullYear() === now.getFullYear() && tx.purchaseCost < 0) {
            monthlyTotals[monthIdx] += Math.abs(Number(tx.purchaseCost)) || 0;
          }
        }
      });

      const currentMonth = now.getMonth();
      const monthsToShow = 4;
      const barData = [];
      for (let i = monthsToShow - 1; i >= 0; i--) {
        const idx = (currentMonth - i + 12) % 12;
        barData.push({
          month: MONTHS[idx],
          amount: monthlyTotals[idx],
        });
      }
      setMonthlySpending(barData);

      // --- Category Spending (current month) ---
      const currentMonthPurchases = purchases.filter(p => {
        const d = new Date(p.purchaseDate);
        const isCurrentMonth = d.getMonth() === now.getMonth() && 
                             d.getFullYear() === now.getFullYear();
        const isExpense = p.purchaseCost < 0;
        console.log('Purchase:', {
          date: p.purchaseDate,
          isCurrentMonth,
          isExpense,
          cost: p.purchaseCost,
          category: p.purchaseCategory
        });
        return isCurrentMonth && isExpense;
      });

      console.log('Current month purchases:', currentMonthPurchases);

      const categoryTotals = {};
      CATEGORIES.forEach(cat => { categoryTotals[cat] = 0; });
      
      currentMonthPurchases.forEach(tx => {
        const cat = tx.purchaseCategory || 'Other';
        if (!categoryTotals.hasOwnProperty(cat)) categoryTotals[cat] = 0;
        categoryTotals[cat] += Math.abs(Number(tx.purchaseCost)) || 0;
      });

      console.log('Category totals:', categoryTotals);

      const total = Object.values(categoryTotals).reduce((a, b) => a + b, 0);
      console.log('Total spending:', total);

      const pieData = CATEGORIES.map(cat => ({
        category: cat,
        amount: categoryTotals[cat],
        percentage: total ? Math.round((categoryTotals[cat] / total) * 100) : 0,
      })).filter(item => item.amount > 0); // Only show categories with spending

      setCategorySpending(pieData);

      // --- Savings ---
      setSavings({
        current: user.currentBalance || 0,
        goal: user.savingsGoal || 0,
        monthlyTarget: user.monthlySavingsTarget || 0,
      });
    } catch (e) {
      console.error('Error loading analytics:', e);
      setError(e.message || 'Failed to load analytics data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      console.log('Analytics screen focused, refreshing data...');
      fetchAndProcessData();
    }, [fetchAndProcessData])
  );

  const renderBarChart = () => {
    if (!monthlySpending.length) return null;
    const maxAmount = Math.max(...monthlySpending.map(item => item.amount), 1);
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Monthly Spending</Text>
        <View style={styles.barChart}>
          {monthlySpending.map((item, index) => {
            const barHeight = (item.amount / maxAmount) * 150;
            return (
              <View key={index} style={styles.barContainer}>
                <View style={[styles.bar, { height: barHeight }]} />
                <Text style={styles.barLabel}>{item.month}</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const renderPieChart = () => {
    if (!categorySpending.length) {
      console.log('No category spending data to display');
      return null;
    }

    console.log('Category spending data:', categorySpending);
    const total = categorySpending.reduce((sum, item) => sum + item.amount, 0);
    console.log('Total spending:', total);

    let startAngle = -Math.PI / 2; // Start from top (12 o'clock position)
    
    const createPieSegment = (amount) => {
      const percentage = (amount / total) * 100;
      console.log('Creating segment:', { amount, percentage, startAngle });
      
      // Calculate the segment's angle
      const segmentAngle = (percentage / 100) * 2 * Math.PI;
      const endAngle = startAngle + segmentAngle;
      
      // Calculate start and end points
      const startX = CHART_RADIUS + Math.cos(startAngle) * CHART_RADIUS;
      const startY = CHART_RADIUS + Math.sin(startAngle) * CHART_RADIUS;
      const endX = CHART_RADIUS + Math.cos(endAngle) * CHART_RADIUS;
      const endY = CHART_RADIUS + Math.sin(endAngle) * CHART_RADIUS;
      
      // Create the SVG arc path
      const largeArcFlag = percentage > 50 ? 1 : 0;
      const pathData = [
        'M', CHART_RADIUS, CHART_RADIUS,
        'L', startX, startY,
        'A', CHART_RADIUS, CHART_RADIUS, 0, largeArcFlag, 1, endX, endY,
        'Z'
      ].join(' ');
      
      // Update start angle for next segment
      startAngle = endAngle;
      
      return pathData;
    };

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Spending by Category</Text>
        <View style={styles.pieChartContainer}>
          <Svg width={CHART_RADIUS * 2} height={CHART_RADIUS * 2}>
            {categorySpending.length === 1 ? (
              <Circle
                cx={CHART_RADIUS}
                cy={CHART_RADIUS}
                r={CHART_RADIUS}
                fill={CHART_COLORS[0]}
              />
            ) : (
              categorySpending.map((item, index) => (
                <Path
                  key={index}
                  d={createPieSegment(item.amount)}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                  stroke="white"
                  strokeWidth="1"
                />
              ))
            )}
          </Svg>
        </View>
        <View style={styles.legend}>
          {categorySpending.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View
                style={[
                  styles.legendColor,
                  { backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }
                ]}
              />
              <Text style={styles.legendText}>
                {item.category}: ${item.amount.toFixed(2)} ({Math.round((item.amount / total) * 100)}%)
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderSavingsCard = () => {
    const progress = savings.goal ? (savings.current / savings.goal) * 100 : 0;
    return (
      <View style={styles.savingsCard}>
        <Text style={styles.savingsTitle}>Savings Progress</Text>
        <View style={styles.savingsProgress}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
        <View style={styles.savingsInfo}>
          <View>
            <Text style={styles.savingsLabel}>Current</Text>
            <Text style={styles.savingsAmount}>${savings.current}</Text>
          </View>
          <View>
            <Text style={styles.savingsLabel}>Goal</Text>
            <Text style={styles.savingsAmount}>${savings.goal}</Text>
          </View>
          <View>
            <Text style={styles.savingsLabel}>Monthly Target</Text>
            <Text style={styles.savingsAmount}>${savings.monthlyTarget}</Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}> 
        <ActivityIndicator size="large" color={colors.primary.main} />
      </View>
    );
  }
  if (error) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}> 
        <Text style={{ color: colors.error, fontSize: 18, marginBottom: 16 }}>{error}</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={[colors.background.light, colors.primary.light]}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Analytics</Text>
        </View>
        {renderBarChart()}
        {renderPieChart()}
        {renderSavingsCard()}
      </ScrollView>
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
  chartContainer: {
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
  chartTitle: {
    fontSize: typography.h3.fontSize,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  barChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 200,
  },
  barContainer: {
    alignItems: 'center',
    width: (CHART_WIDTH - spacing.lg * 2) / 4,
  },
  bar: {
    width: 30,
    backgroundColor: colors.primary.light,
    borderTopLeftRadius: spacing.sm,
    borderTopRightRadius: spacing.sm,
  },
  barLabel: {
    marginTop: spacing.sm,
    fontSize: typography.caption.fontSize,
    color: colors.text.secondary,
  },
  pieChartContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  legend: {
    marginTop: spacing.lg,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: spacing.sm,
  },
  legendText: {
    fontSize: typography.body.fontSize,
    color: colors.text.primary,
  },
  savingsCard: {
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
  savingsTitle: {
    fontSize: typography.h3.fontSize,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  savingsProgress: {
    height: 8,
    backgroundColor: colors.background.dark,
    borderRadius: 4,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary.light,
    borderRadius: 4,
  },
  savingsInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  savingsLabel: {
    fontSize: typography.caption.fontSize,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  savingsAmount: {
    fontSize: typography.body.fontSize,
    fontWeight: '600',
    color: colors.text.primary,
  },
});

export default AnalyticsScreen;
