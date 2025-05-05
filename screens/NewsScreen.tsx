import React, { useContext, useState, useRef } from 'react';
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
  Animated,
  PanResponder,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { NewsContext } from '../API/Context';
import SingleNews from '../components/SingleNews';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const NewsScreen = () => {
  const router = useRouter();
  const { loading, news, darkTheme } = useContext(NewsContext);
  const articles = news?.articles || [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('My Feed');

  // Animation values
  const position = useRef(new Animated.ValueXY()).current;
  const nextCardOpacity = useRef(new Animated.Value(0.3)).current;
  const nextCardScale = useRef(new Animated.Value(0.92)).current;
  const currentCardScale = useRef(new Animated.Value(1)).current;

  // State to track if currently swiping to prevent multiple swipes
  const isSwiping = useRef(false);

  // Reset position after a canceled swipe
  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      friction: 5,
      tension: 40,
      useNativeDriver: true
    }).start(() => {
      isSwiping.current = false;
    });

    Animated.parallel([
      Animated.spring(currentCardScale, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true
      }),
      Animated.spring(nextCardOpacity, {
        toValue: 0.3,
        friction: 5,
        tension: 40,
        useNativeDriver: true
      }),
      Animated.spring(nextCardScale, {
        toValue: 0.92,
        friction: 5,
        tension: 40,
        useNativeDriver: true
      })
    ]).start();
  };

  // Swipe up to next card
  const swipeUp = () => {
    if (activeIndex >= articles.length - 1 || isSwiping.current) {
      resetPosition();
      return;
    }

    isSwiping.current = true;

    // Animate the current card up and off screen
    Animated.timing(position, {
      toValue: { x: 0, y: -windowHeight },
      duration: 300,
      useNativeDriver: true
    }).start();

    // Animate the next card scale and opacity
    Animated.parallel([
      Animated.timing(nextCardScale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.timing(nextCardOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.timing(currentCardScale, {
        toValue: 0.8,
        duration: 300,
        useNativeDriver: true
      })
    ]).start();

    // Use timeout to ensure reliable state update
    setTimeout(() => {
      setActiveIndex(prevIndex => prevIndex + 1);
      position.setValue({ x: 0, y: 0 });
      nextCardScale.setValue(0.92);
      nextCardOpacity.setValue(0.3);
      currentCardScale.setValue(1);
      isSwiping.current = false;
    }, 310);
  };

  // Swipe down to previous card
  const swipeDown = () => {
    if (activeIndex <= 0 || isSwiping.current) {
      resetPosition();
      return;
    }

    isSwiping.current = true;

    // Animate the current card down and off screen
    Animated.timing(position, {
      toValue: { x: 0, y: windowHeight },
      duration: 300,
      useNativeDriver: true
    }).start();

    // Animate the current card scale
    Animated.timing(currentCardScale, {
      toValue: 0.8,
      duration: 300,
      useNativeDriver: true
    }).start();

    // Use timeout to ensure reliable state update
    setTimeout(() => {
      setActiveIndex(prevIndex => prevIndex - 1);
      position.setValue({ x: 0, y: 0 });
      currentCardScale.setValue(1);
      isSwiping.current = false;
    }, 310);
  };

  // PanResponder for handling swipe gestures
  const panResponder = useRef(
      PanResponder.create({
        // Only capture initial touches, not moves
        onStartShouldSetPanResponder: () => true,

        // Capture only vertical movements
        onMoveShouldSetPanResponder: (_, gestureState) => {
          const { dx, dy } = gestureState;
          return Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 10;
        },

        onPanResponderGrant: () => {
          // Don't do anything if already swiping
          if (isSwiping.current) return false;
        },

        onPanResponderMove: (_, gestureState) => {
          // Don't do anything if already mid-swipe
          if (isSwiping.current) return;

          const { dy } = gestureState;

          // Apply resistance as we swipe further
          const resistanceFactor = 0.9;
          position.setValue({
            x: 0,
            y: dy * resistanceFactor
          });

          // Visual feedback during swipe
          if (dy < 0 && activeIndex < articles.length - 1) {
            // Swiping up - show next card
            const progress = Math.min(Math.abs(dy) / 300, 1);
            nextCardOpacity.setValue(0.3 + (0.7 * progress));
            nextCardScale.setValue(0.92 + (0.08 * progress));
            currentCardScale.setValue(1 - (0.2 * progress));
          } else if (dy > 0 && activeIndex > 0) {
            // Swiping down - scale current card
            const progress = Math.min(Math.abs(dy) / 300, 1);
            currentCardScale.setValue(1 - (0.1 * progress));
          }
        },

        onPanResponderRelease: (_, gestureState) => {
          if (isSwiping.current) return;

          const { dy, vy } = gestureState;
          const SWIPE_THRESHOLD = 70; // Lower threshold for easier swiping
          const VELOCITY_THRESHOLD = 0.3; // Add velocity detection

          // Check swipe distance and velocity
          if (
              (dy < -SWIPE_THRESHOLD || vy < -VELOCITY_THRESHOLD) &&
              activeIndex < articles.length - 1
          ) {
            swipeUp();
          } else if (
              (dy > SWIPE_THRESHOLD || vy > VELOCITY_THRESHOLD) &&
              activeIndex > 0
          ) {
            swipeDown();
          } else {
            resetPosition();
          }
        },

        // Handle interrupted gestures
        onPanResponderTerminate: () => {
          resetPosition();
        }
      })
  ).current;

  const tabs = [
    { id: 'feed', label: 'My Feed' },
    { id: 'sale', label: 'Instawoooow Sale' },
    { id: 'match', label: 'Match Center' },
    { id: 'videos', label: 'Videos' },
  ];

  if (loading) {
    return (
        <SafeAreaView style={styles.safeArea}>
          <StatusBar barStyle="light-content" backgroundColor="#000" />
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
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#007AFF" size="large" />
          </View>
        </SafeAreaView>
    );
  }

  if (!articles || articles.length === 0) {
    return (
        <SafeAreaView style={styles.safeArea}>
          <StatusBar barStyle="light-content" backgroundColor="#000" />
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
          <View style={styles.noContent}>
            <Text>No articles available</Text>
          </View>
        </SafeAreaView>
    );
  }

  return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />

        {/* Tab Navigation */}
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

        {/* Swipeable news cards container */}
        <View style={styles.cardsContainer}>
          {/* Card behind current card (only visible during swipe) */}
          {activeIndex < articles.length - 1 && (
              <Animated.View
                  style={[
                    styles.nextCardContainer,
                    {
                      opacity: nextCardOpacity,
                      transform: [
                        { scale: nextCardScale }
                      ]
                    }
                  ]}
              >
                <SingleNews
                    item={articles[activeIndex + 1]}
                    index={activeIndex + 1}
                    darkTheme={darkTheme}
                    disableInteraction={true}
                />
              </Animated.View>
          )}

          {/* Current card with pan responder */}
          <Animated.View
              style={[
                styles.currentCardContainer,
                {
                  transform: [
                    { translateY: position.y },
                    { scale: currentCardScale }
                  ]
                }
              ]}
              {...panResponder.panHandlers}
          >
            <SingleNews
                item={articles[activeIndex]}
                index={activeIndex}
                darkTheme={darkTheme}
            />
          </Animated.View>
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
  currentCardContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    zIndex: 2,
    borderRadius: 2,
    overflow: 'hidden',
  },
  nextCardContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    zIndex: 1,
    borderRadius: 2,
    overflow: 'hidden',
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