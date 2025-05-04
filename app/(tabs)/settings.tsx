import { View, Text, StyleSheet, Switch } from 'react-native';
import { useContext } from 'react';
import { NewsContext } from '../../API/Context';

export default function SettingsScreen() {
  const { darkTheme, setDarkTheme } = useContext(NewsContext);

  return (
    <View style={[styles.container, { backgroundColor: darkTheme ? '#282c35' : '#fff' }]}>
      <Text style={[styles.title, { color: darkTheme ? '#fff' : '#1a1a1a' }]}>Settings</Text>
      <View style={styles.settingItem}>
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
    </View>
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
    color: '#1a1a1a',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  settingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 18,
  },
});
