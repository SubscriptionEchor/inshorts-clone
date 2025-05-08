import React, { useContext } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { NewsContext } from '../API/Context';
import { categories, sources } from '../API/api';
import Search from '../components/Search';

const windowWidth = Dimensions.get('window').width;
const CATEGORY_WIDTH = (windowWidth - 40) / 2;

const DiscoverScreen = () => {
  const { setCategory, darkTheme, setSource } = useContext(NewsContext);

  return (
    <ScrollView style={[styles.container, { backgroundColor: darkTheme ? '#000' : '#fff' }]}>
      <Search />
      <View style={styles.content}>
        <Text style={[styles.subtitle, { color: darkTheme ? '#fff' : '#1a1a1a' }]}>
          Categories
        </Text>
        <View style={styles.categoriesGrid}>
          {categories.map((item) => (
            <TouchableOpacity
              key={item.name}
              onPress={() => setCategory(item.name)}
              style={[
                styles.categoryCard,
                { backgroundColor: darkTheme ? '#1a1a1a' : '#f5f5f5' }
              ]}
            >
              <Image source={{ uri: item.pic }} style={styles.categoryIcon} />
              <Text style={[
                styles.categoryName,
                { color: darkTheme ? '#fff' : '#1a1a1a' }
              ]}>
                {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.subtitle, { color: darkTheme ? '#fff' : '#1a1a1a', marginTop: 24 }]}>
          Sources
        </Text>
        <View style={styles.sourcesGrid}>
          {sources.map((source) => (
            <TouchableOpacity
              key={source.id}
              onPress={() => setSource(source.id)}
              style={[
                styles.sourceCard,
                { backgroundColor: darkTheme ? '#1a1a1a' : '#f5f5f5' }
              ]}
            >
              <Image source={{ uri: source.pic }} style={styles.sourceLogo} />
              <Text style={[
                styles.sourceName,
                { color: darkTheme ? '#fff' : '#1a1a1a' }
              ]}>
                {source.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default DiscoverScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  subtitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: CATEGORY_WIDTH,
    height: 120,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  sourcesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sourceCard: {
    width: CATEGORY_WIDTH,
    height: 100,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sourceLogo: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },
  sourceName: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  }
});