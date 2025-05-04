import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { NewsContext } from '../../API/Context';
import NewsScreen from '../../screens/NewsScreen';

export default function HomeScreen() {
  const { darkTheme } = useContext(NewsContext);

  return (
      <View style={[styles.container, { backgroundColor: darkTheme ? '#282c35' : '#fff' }]}>
        <NewsScreen />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});