import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CustomInput from '../components/common/CustomInput';
import CustomButton from '../components/common/CustomButton';
import { colors, spacing, typography } from '../theme/colors';

const ProfileScreen = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    dateOfBirth: '1990-01-01',
    occupation: 'Software Engineer',
    monthlyIncome: '5000',
    phoneNumber: '+1 234 567 8900',
    address: '123 Main Street, City, Country',
    currency: 'USD',
    language: 'English',
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const renderField = (label, field, placeholder, keyboardType = 'default') => (
    <View style={styles.fieldContainer}>
      {isEditing ? (
        <CustomInput
          label={label}
          value={formData[field]}
          onChangeText={(value) => handleChange(field, value)}
          placeholder={placeholder}
          keyboardType={keyboardType}
        />
      ) : (
        <>
          <Text style={styles.fieldLabel}>{label}</Text>
          <Text style={styles.fieldValue}>{formData[field]}</Text>
        </>
      )}
    </View>
  );

  return (
    <LinearGradient
      colors={[colors.background.light, colors.primary.light]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Profile</Text>
            <TouchableOpacity
              onPress={() => setIsEditing(!isEditing)}
              style={styles.editButton}
            >
              <Text style={styles.editButtonText}>
                {isEditing ? 'Cancel' : 'Edit'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.profileImageContainer}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.profileImage}
            />
            {isEditing && (
              <TouchableOpacity style={styles.changePhotoButton}>
                <Text style={styles.changePhotoText}>Change Photo</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.form}>
            {renderField('Full Name', 'fullName', 'Enter your full name')}
            {renderField('Email', 'email', 'Enter your email', 'email-address')}
            {renderField('Date of Birth', 'dateOfBirth', 'YYYY-MM-DD')}
            {renderField('Occupation', 'occupation', 'Enter your occupation')}
            {renderField('Monthly Income', 'monthlyIncome', 'Enter your monthly income', 'numeric')}
            {renderField('Phone Number', 'phoneNumber', 'Enter your phone number', 'phone-pad')}
            {renderField('Address', 'address', 'Enter your address')}
            {renderField('Preferred Currency', 'currency', 'Select your currency')}
            {renderField('Language', 'language', 'Select your language')}

            {isEditing && (
              <CustomButton
                title="Save Changes"
                onPress={handleSave}
                size="large"
                style={styles.saveButton}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.h1.fontSize,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  editButton: {
    padding: spacing.sm,
  },
  editButtonText: {
    color: colors.primary.main,
    fontSize: typography.body.fontSize,
    fontWeight: '600',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: spacing.md,
  },
  changePhotoButton: {
    padding: spacing.sm,
  },
  changePhotoText: {
    color: colors.primary.main,
    fontSize: typography.body.fontSize,
  },
  form: {
    flex: 1,
  },
  fieldContainer: {
    marginBottom: spacing.lg,
  },
  fieldLabel: {
    fontSize: typography.caption.fontSize,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  fieldValue: {
    fontSize: typography.body.fontSize,
    color: colors.text.primary,
    backgroundColor: colors.background.main,
    padding: spacing.md,
    borderRadius: spacing.md,
  },
  saveButton: {
    marginTop: spacing.xl,
  },
});

export default ProfileScreen;
