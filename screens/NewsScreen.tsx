import React, { useContext, useState } from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, View } from 'react-native';
import { NewsContext } from '../API/Context';
import SingleNews from '../components/SingleNews';
import Carousel from '@zhenyudu/react-native-snap-carousel';

const windowHeight = Dimensions.get('window').height;

const NewsScreen = () => {
  const { loading, news, darkTheme } = useContext(NewsContext);
  const articles = news?.articles;
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <View style={styles.carousel}>
      {loading ? (
        <>
          <ActivityIndicator color={darkTheme ? "white" : 'lightgray'} size="large" />
        </>
      ) : (
        <>
          {articles && (
            <Carousel
              data={articles}
              renderItem={({ item, index }) => (
                <SingleNews item={item} index={index} darkTheme={darkTheme} />
              )}
              sliderHeight={300}
              vertical={true}
              itemHeight={windowHeight}
              onSnapToItem={(index) => setActiveIndex(index)}
            />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  carousel: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%'
  },
});

export default NewsScreen;
