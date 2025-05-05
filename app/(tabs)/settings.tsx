import { View, Text, StyleSheet, Switch, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useContext } from 'react';
import { NewsContext } from '../../API/Context';
import { useAuth } from '../../API/AuthContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const { darkTheme, setDarkTheme } = useContext(NewsContext);
  const { user, isLoggedIn, signOut } = useAuth();
  const router = useRouter();

  const handleLoginPress = () => {
    router.push('/auth/login');
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
      <ScrollView style={[styles.container, { backgroundColor: darkTheme ? '#282c35' : '#fff' }]}>
        <Text style={[styles.title, { color: darkTheme ? '#fff' : '#1a1a1a' }]}>Settings</Text>

        {/* User Profile Section */}
        <View style={[styles.profileSection, { backgroundColor: darkTheme ? '#3a3f4b' : '#f5f5f5' }]}>
          {isLoggedIn && user ? (
              <View style={styles.profileInfo}>
                {user.user_metadata?.avatar_url ? (
                    <Image
                        source={{ uri: user.user_metadata.avatar_url }}
                        style={styles.profileImage}
                    />
                ) : (
                    <View style={[styles.profileImage, styles.profilePlaceholder]}>
                      <Text style={styles.profilePlaceholderText}>
                        {user.email?.substring(0, 1).toUpperCase() || 'U'}
                      </Text>
                    </View>
                )}
                <View style={styles.profileText}>
                  <Text style={[styles.profileName, { color: darkTheme ? '#fff' : '#1a1a1a' }]}>
                    {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                  </Text>
                  <Text style={[styles.profileEmail, { color: darkTheme ? '#ccc' : '#666' }]}>
                    {user.email || ''}
                  </Text>
                </View>
              </View>
          ) : (
              <TouchableOpacity style={styles.loginButton} onPress={handleLoginPress}>
                <Ionicons name="log-in-outline" size={22} color="#fff" style={styles.loginIcon} />
                <Text style={styles.loginButtonText}>Sign in with Google</Text>
              </TouchableOpacity>
          )}
        </View>

        {/* App Settings */}
        <Text style={[styles.sectionTitle, { color: darkTheme ? '#fff' : '#1a1a1a' }]}>
          App Settings
        </Text>

        <View style={[styles.settingItem, { borderBottomColor: darkTheme ? '#444' : '#ccc' }]}>
          <Text style={[styles.settingText, { color: darkTheme ? '#fff' : '#1a1a1a' }]}>
            Dark Mode
          </Text>
          <Switch
              value={darkTheme}
              onValueChange={setDarkTheme}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={darkTheme ? '#007AFF' : '#f4f3f4'}
          />
        </View>

        {/* Account Settings (only shown when logged in) */}
        {isLoggedIn && (
            <>
              <Text style={[styles.sectionTitle, { color: darkTheme ? '#fff' : '#1a1a1a' }]}>
                Account
              </Text>

              <TouchableOpacity
                  style={[styles.settingItem, { borderBottomColor: darkTheme ? '#444' : '#ccc' }]}
                  onPress={handleSignOut}
              >
                <Text style={[styles.settingText, { color: '#ff3b30' }]}>
                  Sign Out
                </Text>
                <Ionicons name="log-out-outline" size={22} color="#ff3b30" />
              </TouchableOpacity>
            </>
        )}

        {/* About Section */}
        <Text style={[styles.sectionTitle, { color: darkTheme ? '#fff' : '#1a1a1a' }]}>
          About
        </Text>

        <View style={[styles.settingItem, { borderBottomColor: darkTheme ? '#444' : '#ccc' }]}>
          <Text style={[styles.settingText, { color: darkTheme ? '#fff' : '#1a1a1a' }]}>
            Version
          </Text>
          <Text style={[styles.settingValue, { color: darkTheme ? '#ccc' : '#666' }]}>
            1.0.0
          </Text>
        </View>

        <View style={[styles.settingItem, { borderBottomColor: darkTheme ? '#444' : '#ccc' }]}>
          <Text style={[styles.settingText, { color: darkTheme ? '#fff' : '#1a1a1a' }]}>
            Terms of Service
          </Text>
          <Ionicons name="chevron-forward" size={22} color={darkTheme ? '#ccc' : '#666'} />
        </View>

        <View style={[styles.settingItem, { borderBottomColor: darkTheme ? '#444' : '#ccc' }]}>
          <Text style={[styles.settingText, { color: darkTheme ? '#fff' : '#1a1a1a' }]}>
            Privacy Policy
          </Text>
          <Ionicons name="chevron-forward" size={22} color={darkTheme ? '#ccc' : '#666'} />
        </View>
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    marginBottom: 20,
  },
  profileSection: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  profilePlaceholder: {
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePlaceholderText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileText: {
    flex: 1,
  },
  profileName: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginBottom: 4,
  },
  profileEmail: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  loginButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginIcon: {
    marginRight: 8,
  },
  loginButtonText: {
    color: '#fff',
    fontFamily: 'Inter-Bold',
    fontSize: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  settingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  settingValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
});