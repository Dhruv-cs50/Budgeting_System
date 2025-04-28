import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../../theme/colors';

const CustomInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  error,
  style,
  inputStyle,
  labelStyle,
  ...props
}) => {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          inputStyle,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.text.secondary}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.body.fontSize,
    color: colors.text.primary,
    marginBottom: spacing.xs,
    fontWeight: '500',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.secondary.light,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    fontSize: typography.body.fontSize,
    color: colors.text.primary,
    backgroundColor: colors.background.main,
  },
  inputError: {
    borderColor: '#ff4444',
  },
  errorText: {
    color: '#ff4444',
    fontSize: typography.caption.fontSize,
    marginTop: spacing.xs,
  },
});

export default CustomInput;
