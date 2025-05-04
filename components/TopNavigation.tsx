import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NewsContext } from '../API/Context';
import { Ionicons } from '@expo/vector-icons';

type TopNavigationProps = {
  index: number;
  setIndex: (index: number) => void;
};

const TopNavigation = ({ index, setIndex }: TopNavigationProps) => {
  const { fetchNews, darkTheme, setDarkTheme } = useContext(NewsContext);

  return (
    <View style={{ ...styles.container, backgroundColor: darkTheme ? '#282c35' : 'white' }}>
      {index === 0 ? (
        <TouchableOpacity
          onPress={() => setDarkTheme(!darkTheme)}
          style={{ ...styles.left, color: darkTheme ? 'lightgray' : 'gray' }}
        >
          <Ionicons name={darkTheme ? "moon" : "moon-outline"} size={24} color={darkTheme ? "#007fff" : 'gray'} />
          <Text style={{ ...styles.text }}>
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={{ ...styles.left, color: darkTheme ? 'lightgray' : 'gray' }}
          onPress={() => setIndex(index === 0 ? 1 : 0)}
        >
          <Ionicons name="arrow-back" size={24} color={darkTheme ? "#007fff" : 'gray'} />
          <Text style={{ ...styles.text, color: darkTheme ? 'lightgray' : 'gray' }}>
            Discover
          </Text>
        </TouchableOpacity>
      )}
      <Text style={{ ...styles.center, color: darkTheme ? "white" : 'black' }}>
        {index ? "All News" : "Discover"}
      </Text>
      {index ? (
        <TouchableOpacity
          onPress={() => fetchNews('general')}
          style={styles.right}
        >
          <Text style={styles.text}>
            <Ionicons name="refresh" size={24} color={darkTheme ? "#007fff" : 'gray'} />
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.left}
          onPress={() => setIndex(index === 0 ? 1 : 0)}
        >
          <Text style={{ ...styles.text, color: darkTheme ? "white" : 'gray' }}>
            All News
          </Text>
          <Ionicons name="arrow-forward" size={24} color={darkTheme ? "#007fff" : 'gray'} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default TopNavigation;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    alignItems: 'center',
    borderBottomColor: 'black',
    borderBottomWidth: 0.5
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
    justifyContent: 'space-between',
  },
  right: {
    width: 80,
    height: 40,
    justifyContent: 'center',
    paddingRight: 7,
    alignItems: "flex-end",
  },
  center: {
    paddingBottom: 6,
    borderBottomColor: '#007fff',
    borderRadius: 5,
    borderRadius: 10,
    fontSize: 16,
    fontWeight: '700'
  },
  text: {
    fontSize: 16,
    borderBottomColor: '#007fff',
  },
});
