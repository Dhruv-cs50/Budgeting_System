import React, { useState, useEffect } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import CustomInput from '../components/common/CustomInput';
import CustomButton from '../components/common/CustomButton';
import { colors, spacing, typography } from '../theme/colors';

const ProfileScreen = ({ navigation }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    dob: '',
    occupation: '',
    monthlyIncome: '',
    phoneNumber: '',
    address: '',
    preferredCurrency: '',
    language: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userEmail = await AsyncStorage.getItem('userEmail');
        if (!userEmail) return;
        const res = await fetch('http://192.168.55.153:5001/users/email/' + encodeURIComponent(userEmail));
        const user = await res.json();
        if (user) {
          setFormData({
            firstName: user.fullName || '',
            email: user.email || '',
            dob: user.dateOfBirth || '',
            occupation: user.occupation || '',
            monthlyIncome: user.monthlyIncome ? String(user.monthlyIncome) : '',
            phoneNumber: user.phoneNumber || '',
            address: user.address || '',
            preferredCurrency: user.preferredCurrency || '',
            language: user.language || '',
          });
        }
      } catch (e) {
        // handle error
      }
    };
    fetchProfile();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[\d\s-]{10,}$/;

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.dob) {
      newErrors.dob = 'Date of birth is required';
    }

    if (!formData.occupation.trim()) {
      newErrors.occupation = 'Occupation is required';
    }

    if (!formData.monthlyIncome) {
      newErrors.monthlyIncome = 'Monthly income is required';
    } else if (isNaN(formData.monthlyIncome)) {
      newErrors.monthlyIncome = 'Monthly income must be a number';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.preferredCurrency) {
      newErrors.preferredCurrency = 'Preferred currency is required';
    }

    if (!formData.language) {
      newErrors.language = 'Language is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      const dataToSend = {
        fullName: formData.firstName,
        email: formData.email,
        dateOfBirth: formData.dob,
        occupation: formData.occupation,
        monthlyIncome: parseFloat(formData.monthlyIncome),
        phoneNumber: formData.phoneNumber,
        preferredCurrency: formData.preferredCurrency,
        language: formData.language,
      };
      try {
        const response = await fetch(`http://192.168.55.153:5001/users/email/${encodeURIComponent(formData.email)}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSend),
        });
        if (response.ok) {
          await fetchProfile();
          console.log('Exiting edit mode');
          setIsEditing(false);
          alert('Profile updated successfully!');
        } else {
          const errorData = await response.json();
          alert('Error: ' + (errorData.message || 'Failed to update profile.'));
        }
      } catch (error) {
        alert('Network error: ' + error.message);
      }
    }
  };

  const renderField = (label, field, placeholder, keyboardType = 'default', box = false) => (
    <View style={box ? styles.singleFieldBox : styles.fieldContainer}>
      {isEditing ? (
        <CustomInput
          label={label}
          value={formData[field]}
          onChangeText={(value) => handleChange(field, value)}
          placeholder={placeholder}
          keyboardType={keyboardType}
          error={errors[field]}
        />
      ) : (
        <>
          <Text style={styles.fieldLabel}>{label}</Text>
          <Text style={[styles.fieldValue, { color: 'black' }]}>{formData[field]}</Text>
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
          <View style={styles.profileBox}>
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

            {/* Each field in its own box */}
            {renderField('First Name', 'firstName', 'Enter your first name', 'default', true)}
            {renderField('Date of Birth', 'dob', 'YYYY-MM-DD', 'default', true)}
            {renderField('Occupation', 'occupation', 'Enter your occupation', 'default', true)}
            {renderField('Monthly Income', 'monthlyIncome', 'Enter your monthly income', 'numeric', true)}
            {renderField('Email', 'email', 'Enter your email', 'email-address', true)}
            {renderField('Phone Number', 'phoneNumber', 'Enter your phone number', 'phone-pad', true)}
            {renderField('Preferred Currency', 'preferredCurrency', 'Enter your preferred currency', 'default', true)}
            {renderField('Language', 'language', 'Enter your preferred language', 'default', true)}

            {/* Edit/Save button as full-width below all fields */}
            {!isEditing ? (
              <CustomButton
                title="Edit"
                onPress={() => setIsEditing(true)}
                style={styles.fullWidthButton}
              />
            ) : (
              <CustomButton
                title="Save"
                onPress={handleSubmit}
                style={styles.fullWidthButton}
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
  profileBox: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    marginTop: spacing.xl,
    marginHorizontal: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  profileHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sectionBox: {
    backgroundColor: '#f6f8fa',
    borderRadius: 14,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: typography.h1.fontSize,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: typography.body.fontSize,
    color: colors.text.secondary,
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
  fieldContainer: {
    marginBottom: spacing.lg,
  },
  fieldLabel: {
    fontSize: typography.body.fontSize,
    color: 'black',
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  fieldValue: {
    fontSize: typography.body.fontSize,
    color: 'black',
    marginBottom: spacing.md,
  },
  saveButton: {
    marginTop: spacing.xl,
    backgroundColor: colors.primary.main,
  },
  singleFieldBox: {
    backgroundColor: '#f6f8fa',
    borderRadius: 14,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  fullWidthButton: {
    marginTop: spacing.xl,
    marginHorizontal: 0,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: colors.primary.main,
  },
});

export default ProfileScreen;
