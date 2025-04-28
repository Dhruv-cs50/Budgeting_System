import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, G } from 'react-native-svg';
import { colors, spacing, typography } from '../theme/colors';

//mock data
const mockData = {
  monthlySpending: [
    { month: 'Jan', amount: 2500 },
    { month: 'Feb', amount: 2800 },
    { month: 'Mar', amount: 2200 },
    { month: 'Apr', amount: 3000 },
  ],
  categorySpending: [
    { category: 'Food', amount: 450, percentage: 30 },
    { category: 'Transport', amount: 200, percentage: 13 },
    { category: 'Entertainment', amount: 150, percentage: 10 },
    { category: 'Bills', amount: 700, percentage: 47 },
  ],
  savings: {
    current: 5000,
    goal: 10000,
    monthlyTarget: 1000,
  },
};

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - spacing.lg * 2;
const CHART_RADIUS = CHART_WIDTH / 2.5;

const AnalyticsScreen = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');

  const renderBarChart = () => {
    const maxAmount = Math.max(...mockData.monthlySpending.map(item => item.amount));
    
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Monthly Spending</Text>
        <View style={styles.barChart}>
          {mockData.monthlySpending.map((item, index) => {
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
    const total = mockData.categorySpending.reduce((sum, item) => sum + item.percentage, 0);
    let startAngle = 0;

    const createPieSegment = (percentage) => {
      const angle = (percentage / 100) * 2 * Math.PI;
      const endAngle = startAngle + angle;
      
      // Calculate the path
      const x1 = CHART_RADIUS + CHART_RADIUS * Math.cos(startAngle);
      const y1 = CHART_RADIUS + CHART_RADIUS * Math.sin(startAngle);
      const x2 = CHART_RADIUS + CHART_RADIUS * Math.cos(endAngle);
      const y2 = CHART_RADIUS + CHART_RADIUS * Math.sin(endAngle);
      
      // Create the arc path
      const largeArcFlag = angle > Math.PI ? 1 : 0;
      const path = `
        M ${CHART_RADIUS} ${CHART_RADIUS}
        L ${x1} ${y1}
        A ${CHART_RADIUS} ${CHART_RADIUS} 0 ${largeArcFlag} 1 ${x2} ${y2}
        Z
      `;
      
      startAngle = endAngle;
      return path;
    };

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Spending by Category</Text>
        <View style={styles.pieChartContainer}>
          <Svg width={CHART_RADIUS * 2} height={CHART_RADIUS * 2}>
            <G>
              {mockData.categorySpending.map((item, index) => (
                <Path
                  key={index}
                  d={createPieSegment(item.percentage)}
                  fill={colors.primary.light}
                  opacity={0.4 + (index * 0.15)}
                />
              ))}
            </G>
          </Svg>
        </View>
        <View style={styles.legend}>
          {mockData.categorySpending.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View
                style={[
                  styles.legendColor,
                  {
                    backgroundColor: colors.primary.light,
                    opacity: 0.4 + (index * 0.15),
                  },
                ]}
              />
              <Text style={styles.legendText}>
                {item.category} ({item.percentage}%)
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderSavingsCard = () => {
    const progress = (mockData.savings.current / mockData.savings.goal) * 100;
    
    return (
      <View style={styles.savingsCard}>
        <Text style={styles.savingsTitle}>Savings Progress</Text>
        <View style={styles.savingsProgress}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
        <View style={styles.savingsInfo}>
          <View>
            <Text style={styles.savingsLabel}>Current</Text>
            <Text style={styles.savingsAmount}>${mockData.savings.current}</Text>
          </View>
          <View>
            <Text style={styles.savingsLabel}>Goal</Text>
            <Text style={styles.savingsAmount}>${mockData.savings.goal}</Text>
          </View>
          <View>
            <Text style={styles.savingsLabel}>Monthly Target</Text>
            <Text style={styles.savingsAmount}>${mockData.savings.monthlyTarget}</Text>
          </View>
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
