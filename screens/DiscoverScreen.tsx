import React, { useContext } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NewsContext } from '../API/Context';
import Carousel from '@zhenyudu/react-native-snap-carousel';
import { categories, sources } from '../API/api';
import Search from '../components/Search';

const windowWidth = Dimensions.get('window').width;

const DiscoverScreen = () => {
  const { setCategory, darkTheme, setSource } = useContext(NewsContext);
  const SLIDE_WIDTH = Math.round(windowWidth / 3.5);

  return (
    <View style={styles.container}>
      <Search />
      <Text style={{ ...styles.subtitle, paddingTop: 10, color: darkTheme ? 'white' : 'gray' }}>Categories</Text>
      <Carousel
        data={categories}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => setCategory(item?.name)}
            style={{ ...styles.categoriesStyles }}>
            <Image
              source={{ uri: item?.pic }}
              style={styles.categoryImage}
            />
            <Text
              style={{ ...styles.categoriesName, color: darkTheme ? 'white' : 'gray' }}
            >{item?.name}</Text>
          </TouchableOpacity>
        )}
        sliderWidth={windowWidth}
        itemWidth={SLIDE_WIDTH}
        horizontal={true}
        activeSlideAlignment='start'
        inactiveSlideScale={1}
        inactiveSlideOpacity={2}
      />
      <Text style={{ ...styles.subtitle, color: darkTheme ? 'white' : 'gray' }}>
        Sources
      </Text>
      <View style={styles.sources}>
        {sources.map(s => (
          <TouchableOpacity
            onPress={() => setSource(s?.id)}
            key={s?.id}
            style={styles.sourceContainer}
          >
            <Image
              source={{ uri: s?.pic }}
              style={styles.sourceImage}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default DiscoverScreen;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingBottom: 8,
    marginHorizontal: 5,
    borderBottomColor: '#007fff',
    borderBottomWidth: 5,
    alignSelf: 'flex-start',
    borderRadius: 10,
  },
  categoriesName: {
    textAlign: 'center',
    fontSize: 18,
  },
  categoriesStyles: {
    height: 150,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },
  categoryImage: {
    height: '40%',
    width: '100%',
    resizeMode: 'contain'
  },
  sourceContainer: {
    height: 150,
    width: "40%",
    borderRadius: 10,
    margin: 15,
    backgroundColor: '#cc313d'
  },
  sources: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  sourceImage: {
    height: '100%',
    borderRadius: 10,
    resizeMode: 'cover'
  }
});
