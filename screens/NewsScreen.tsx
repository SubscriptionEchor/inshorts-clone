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
} from 'react-native';
import { Platform } from 'react-native';
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
  const articles = news?.Data && Array.isArray(news.Data) && news.Data.length > 0
      ? news.Data
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
    if (!item) return null;

    return (
        <View style={styles.cardContainer}>
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
    { id: 'trending', label: 'Trending' },
    { id: 'markets', label: 'Markets' },
    { id: 'nft', label: 'NFTs' },
    { id: 'defi', label: 'DeFi' },
    { id: 'metaverse', label: 'Metaverse' },
  ];

  // Render the tab navigation
  const renderTabNavigation = () => (
      <View style={styles.tabContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScrollContent}
        >
          <View style={styles.tabTextContainer}>
            {tabs.map((tab) => (
                <TouchableOpacity
                    key={tab.id}
                    onPress={() => setActiveTab(tab.label)}
                    style={[
                      styles.tabButton,
                      activeTab === tab.label && styles.activeTabButton
                    ]}
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
    height: 60,
    paddingVertical: 8,
    justifyContent: 'center',
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  tabScrollContent: {
    paddingHorizontal: 16,
  },
  tabTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#1a1a1a',
  },
  activeTabButton: {
    backgroundColor: '#007AFF',
  },
  activeTabText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  inactiveTabText: {
    color: '#999',
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  cardsContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  swiperContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  swiperContentContainer: {
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  cardContainer: {
    height: Platform.OS === 'ios' ? windowHeight - 140 : windowHeight - 110,
    width: windowWidth,
    backgroundColor: '#000000',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
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