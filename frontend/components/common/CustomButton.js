/**
 * CustomButton Component
 * 
 * A reusable button component with multiple variants and sizes.
 * This component provides a consistent look and feel across the application
 * and includes built-in support for loading states and disabled states.
 * 
 * @component
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../../theme/colors';

const CustomButton = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  /**
   * Get the appropriate button style based on variant
   * @returns {Object} Style object for the button variant
   */
  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryButton;
      case 'secondary':
        return styles.secondaryButton;
      case 'outline':
        return styles.outlineButton;
      default:
        return styles.primaryButton;
    }
  };

  /**
   * Get the appropriate button size style
   * @returns {Object} Style object for the button size
   */
  const getButtonSize = () => {
    switch (size) {
      case 'small':
        return styles.smallButton;
      case 'medium':
        return styles.mediumButton;
      case 'large':
        return styles.largeButton;
      default:
        return styles.mediumButton;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        getButtonSize(),
        disabled && styles.disabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={colors.text.light} />
      ) : (
        <Text style={[styles.text, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  primaryButton: {
    backgroundColor: colors.primary.light,
  },
  secondaryButton: {
    backgroundColor: colors.secondary.light,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary.light,
  },
  smallButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  mediumButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  largeButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  disabledButton: {
    opacity: 0.5,
  },
  text: {
    color: colors.text.light,
    fontSize: typography.body.fontSize,
    fontWeight: '600',
  },
});

export default CustomButton;
