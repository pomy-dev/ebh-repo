import React from 'react';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Switch } from 'react-native';
import { useAuth } from '../../context/app-state/auth-context';
import Icon from '@expo/vector-icons';

const SettingsScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [emailAlertsEnabled, setEmailAlertsEnabled] = React.useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);
  const { onLogout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    onLogout().then(() => {
      console.log('Logged out!')
      router.replace('/(auth)/login');
    }).catch((error) => {
      console.error('Logout failed:', error);
    })
  }

  return (
    <View style={styles.container}>
      <View
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View
          style={styles.profileSection}
        >
          <Image
            source={require('../../assets/pomy.png')}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Pomy Nxumalo</Text>
            <Text style={styles.profileEmail}>pomy.nxumalo@gmail.com</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View
        >
          <Text style={styles.sectionTitle}>Account</Text>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuItemIcon, { backgroundColor: '#EEF2FF' }]}>
                <Icon name='user' size={20} color="#4F46E5" />
              </View>
              <Text style={styles.menuItemText}>Personal Information</Text>
            </View>
            <Icon name='chevron-forward' size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuItemIcon, { backgroundColor: '#FEF2F2' }]}>
                <Icon name='creditcard' size={20} color="#DC2626" />
              </View>
              <Text style={styles.menuItemText}>Payment Methods</Text>
            </View>
            <Icon name='chevron-forward' size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuItemIcon, { backgroundColor: '#F0FDF4' }]}>
                <Icon name='home' size={20} color="#16A34A" />
              </View>
              <Text style={styles.menuItemText}>Property Details</Text>
            </View>
            <Icon name='chevron-forward' size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuItemIcon, { backgroundColor: '#F5F3FF' }]}>
                <Icon name='lock1' size={20} color="#8B5CF6" />
              </View>
              <Text style={styles.menuItemText}>Security Settings</Text>
            </View>
            <Icon name='chevron-forward' size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <View
        >
          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Preferences</Text>

          <View style={styles.toggleItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuItemIcon, { backgroundColor: '#FEF3C7' }]}>
                <Icon name='bells' size={20} color="#D97706" />
              </View>
              <Text style={styles.menuItemText}>Push Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#E5E7EB', true: '#4F46E5' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.toggleItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuItemIcon, { backgroundColor: '#DBEAFE' }]}>
                <Icon name='mail-outline' size={20} color="#2563EB" />
              </View>
              <Text style={styles.menuItemText}>Email Alerts</Text>
            </View>
            <Switch
              value={emailAlertsEnabled}
              onValueChange={setEmailAlertsEnabled}
              trackColor={{ false: '#E5E7EB', true: '#4F46E5' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.toggleItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuItemIcon, { backgroundColor: '#E0E7FF' }]}>
                <Icon name='mone-outline' size={20} color="#4F46E5" />
              </View>
              <Text style={styles.menuItemText}>Dark Mode</Text>
            </View>
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: '#E5E7EB', true: '#4F46E5' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <View
        >
          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Support</Text>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuItemIcon, { backgroundColor: '#F0FDF4' }]}>
                <Icon name='help-outline' size={20} color="#16A34A" />
              </View>
              <Text style={styles.menuItemText}>Help Center</Text>
            </View>
            <Icon name='chevron-forward' size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}
            onPress={handleLogout}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuItemIcon, { backgroundColor: '#FEF2F2' }]}>
                <Icon name='logout' size={20} color="#DC2626" />
              </View>
              <Text style={[styles.menuItemText, { color: '#DC2626' }]}>Log Out</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Naku Ekhaya v1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4F46E5',
  },
  editButtonText: {
    color: '#4F46E5',
    fontSize: 14,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  toggleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  versionText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
});

export default SettingsScreen;