import { View, StyleSheet } from 'react-native';
import DiscoverScreen from '../../screens/DiscoverScreen';
import { useContext } from 'react';
import { NewsContext } from '../../API/Context';

export default function DiscoverTab() {
  const { darkTheme } = useContext(NewsContext);

  return (
    <View style={[styles.container, { backgroundColor: darkTheme ? '#282c35' : '#fff' }]}>
      <DiscoverScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
