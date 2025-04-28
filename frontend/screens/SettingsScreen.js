import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CustomButton from '../components/common/CustomButton';
import { colors, spacing, typography } from '../theme/colors';

const SettingsScreen = ({ navigation }) => {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    biometricAuth: true,
    currency: 'USD',
    language: 'English',
  });

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => navigation.navigate('Welcome'),
        },
      ],
      { cancelable: true }
    );
  };

  const handleToggle = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const renderSettingItem = (title, value, type = 'toggle', onPress = null) => {
    return (
      <TouchableOpacity
        style={styles.settingItem}
        onPress={onPress}
        disabled={type === 'toggle'}
      >
        <Text style={styles.settingTitle}>{title}</Text>
        {type === 'toggle' ? (
          <Switch
            value={value}
            onValueChange={() => handleToggle(title.toLowerCase())}
            trackColor={{ false: colors.background.dark, true: colors.primary.light }}
            thumbColor={colors.common.white}
          />
        ) : (
          <View style={styles.settingValue}>
            <Text style={styles.settingValueText}>{value}</Text>
            <Text style={styles.chevron}>›</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient
      colors={[colors.background.light, colors.primary.light]}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          {renderSettingItem('Notifications', settings.notifications)}
          {renderSettingItem('Dark Mode', settings.darkMode)}
          {renderSettingItem('Biometric Auth', settings.biometricAuth)}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          {renderSettingItem('Currency', settings.currency, 'text', () => {})}
          {renderSettingItem('Language', settings.language, 'text', () => {})}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.settingTitle}>Profile</Text>
            <View style={styles.settingValue}>
              <Text style={styles.chevron}>›</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => navigation.navigate('Security')}
          >
            <Text style={styles.settingTitle}>Security</Text>
            <View style={styles.settingValue}>
              <Text style={styles.chevron}>›</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => navigation.navigate('Help')}
          >
            <Text style={styles.settingTitle}>Help & Support</Text>
            <View style={styles.settingValue}>
              <Text style={styles.chevron}>›</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => navigation.navigate('Terms')}
          >
            <Text style={styles.settingTitle}>Terms of Service</Text>
            <View style={styles.settingValue}>
              <Text style={styles.chevron}>›</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => navigation.navigate('Privacy')}
          >
            <Text style={styles.settingTitle}>Privacy Policy</Text>
            <View style={styles.settingValue}>
              <Text style={styles.chevron}>›</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.settingItem}>
            <Text style={styles.settingTitle}>App Version</Text>
            <Text style={styles.settingValueText}>1.0.0</Text>
          </View>
        </View>

        <View style={styles.logoutContainer}>
          <CustomButton
            title="Logout"
            onPress={handleLogout}
            variant="outline"
            style={styles.logoutButton}
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
  section: {
    backgroundColor: colors.background.main,
    borderRadius: spacing.md,
    margin: spacing.lg,
    padding: spacing.md,
    elevation: 2,
    shadowColor: colors.common.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: typography.h3.fontSize,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.background.dark,
  },
  settingTitle: {
    fontSize: typography.body.fontSize,
    color: colors.text.primary,
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValueText: {
    fontSize: typography.body.fontSize,
    color: colors.text.secondary,
    marginRight: spacing.sm,
  },
  chevron: {
    fontSize: typography.h2.fontSize,
    color: colors.text.secondary,
  },
  logoutContainer: {
    padding: spacing.lg,
  },
  logoutButton: {
    backgroundColor: colors.background.main,
  },
});

export default SettingsScreen; 