import React, { useContext, useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  View,
  StatusBar,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Platform
} from 'react-native';
import Swiper from '@zhenyudu/react-native-snap-carousel';
import { useRouter } from 'expo-router';
import { NewsContext } from '../API/Context';
import SingleNews from '../components/SingleNews';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const NewsScreen = () => {
  const router = useRouter();
  const { loading, news, darkTheme } = useContext(NewsContext);

  // More robust null checking for articles
  const articles = news?.articles && Array.isArray(news.articles) && news.articles.length > 0
      ? news.articles
      : [];

  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('My Feed');
  const [isCarouselReady, setIsCarouselReady] = useState(false);

  // Set carousel ready state after data is loaded
  useEffect(() => {
    if (articles.length > 0) {
      // Small delay to ensure data is properly loaded before rendering carousel
      const timer = setTimeout(() => {
        setIsCarouselReady(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setIsCarouselReady(false);
    }
  }, [articles]);

  // Handle index change when card changes
  const handleIndexChange = (index) => {
    setActiveIndex(index);
  };

  // Render a single news item - Don't add key here
  const renderItem = ({ item, index }) => {
    // Ensure item has required properties
    const newsKey = `news-item-${index}-${item?.url || ''}`;
    if (!item) return null;

    return (
        <View style={styles.cardContainer} key={newsKey}>
          <SingleNews
              item={item}
              index={index}
              darkTheme={darkTheme}
          />
        </View>
    );
  };

  const tabs = [
    { id: 'feed', label: 'My Feed' },
    { id: 'sale', label: 'Instawoooow Sale' },
    { id: 'match', label: 'Match Center' },
    { id: 'videos', label: 'Videos' },
  ];

  // Render the tab navigation
  const renderTabNavigation = () => (
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.tabTextContainer}>
            {tabs.map((tab) => (
                <TouchableOpacity
                    key={tab.id}
                    onPress={() => setActiveTab(tab.label)}
                >
                  <Text
                      style={activeTab === tab.label ? styles.activeTabText : styles.inactiveTabText}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
  );

  // Loading state
  if (loading) {
    return (
        <SafeAreaView style={styles.safeArea}>
          <StatusBar barStyle="light-content" backgroundColor="#000" />
          {renderTabNavigation()}
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#007AFF" size="large" />
          </View>
        </SafeAreaView>
    );
  }

  // Empty state
  if (!articles || articles.length === 0) {
    return (
        <SafeAreaView style={styles.safeArea}>
          <StatusBar barStyle="light-content" backgroundColor="#000" />
          {renderTabNavigation()}
          <View style={styles.noContent}>
            <Text>No articles available</Text>
          </View>
        </SafeAreaView>
    );
  }

  // Main content
  return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        {renderTabNavigation()}

        {/* Only render carousel when data is ready */}
        <View style={styles.cardsContainer}>
          {isCarouselReady ? (
              <Swiper
                  data={articles}
                  renderItem={renderItem}
                  sliderWidth={windowWidth}
                  itemWidth={windowWidth}
                  sliderHeight={windowHeight - 110}
                  itemHeight={windowHeight - 110}
                  layout={'stack'}
                  firstItem={activeIndex}
                  onSnapToItem={handleIndexChange}
                  vertical={true}
                  loop={false}
                  inactiveSlideScale={0.94}
                  inactiveSlideOpacity={0.7}
                  containerCustomStyle={styles.swiperContainer}
                  contentContainerCustomStyle={styles.swiperContentContainer}
                  shouldOptimizeUpdates={true}
                  useScrollView={true}
              />
          ) : (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#007AFF" size="large" />
              </View>
          )}
        </View>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  tabContainer: {
    backgroundColor: '#000',
    height: 50,
    paddingHorizontal: 10,
    justifyContent: 'center',
    zIndex: 10,
  },
  tabTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    height: 50,
  },
  activeTabText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
    marginRight: 20,
  },
  inactiveTabText: {
    color: '#999',
    fontSize: 16,
    marginRight: 20,
  },
  cardsContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  swiperContainer: {
    flex: 1,
  },
  swiperContentContainer: {
    alignItems: 'center',
  },
  cardContainer: {
    height: windowHeight - 110,
    width: windowWidth,
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  noContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  }
});

export default NewsScreen;