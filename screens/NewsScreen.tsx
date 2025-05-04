import React, { useContext, useState, useRef, useEffect } from 'react';
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
  GestureResponderEvent,
  PanResponderGestureState
} from 'react-native';
import { useRouter } from 'expo-router';
import { NewsContext } from '../API/Context';
import SingleNews from '../components/SingleNews';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 80; // Lower threshold for easier swipe detection

const NewsScreen = () => {
  const router = useRouter();
  const { loading, news, darkTheme } = useContext(NewsContext);
  const articles = news?.articles || [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('My Feed');

  // Animation values
  const position = useRef(new Animated.ValueXY()).current;
  const swipeAnim = useRef(new Animated.Value(0)).current;
  const nextCardOpacity = useRef(new Animated.Value(0.2)).current;

  // Track if the user is scrolling content
  const [isScrolling, setIsScrolling] = useState(false);
  // Track where the touch started
  const [touchStartY, setTouchStartY] = useState(0);
  // Track the current card scroll position
  const [cardScrollY, setCardScrollY] = useState(0);

  // Reset position after swipe
  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      friction: 5,
      tension: 40,
      useNativeDriver: true
    }).start();
  };

  // Animate to next card
  const swipeUp = () => {
    if (activeIndex < articles.length - 1) {
      Animated.timing(swipeAnim, {
        toValue: -windowHeight,
        duration: 300,
        useNativeDriver: true
      }).start(() => {
        setActiveIndex(activeIndex + 1);
        position.setValue({ x: 0, y: 0 });
        swipeAnim.setValue(0);
      });
    } else {
      resetPosition();
    }
  };

  // Animate to previous card
  const swipeDown = () => {
    if (activeIndex > 0) {
      Animated.timing(swipeAnim, {
        toValue: windowHeight,
        duration: 300,
        useNativeDriver: true
      }).start(() => {
        setActiveIndex(activeIndex - 1);
        position.setValue({ x: 0, y: 0 });
        swipeAnim.setValue(0);
      });
    } else {
      resetPosition();
    }
  };

  // This function decides whether a gesture should be handled as a swipe or scroll
  const shouldHandleSwipe = (gestureState: PanResponderGestureState): boolean => {
    // Get vertical gesture distance
    const { dy, moveY, vy } = gestureState;

    // Don't swipe if actively scrolling content
    if (isScrolling) return false;

    // If at the top of content and swiping down, handle as card swipe
    if (cardScrollY <= 0 && dy > SWIPE_THRESHOLD) {
      return true;
    }

    // If at the bottom of content and swiping up, handle as card swipe
    // We don't have a direct way to detect bottom, so use velocity as hint
    if (dy < -SWIPE_THRESHOLD && Math.abs(vy) > 0.5) {
      return true;
    }

    // Otherwise, it's probably a content scroll
    return false;
  };

  // Pan responder for swipe gestures
  const panResponder = useRef(
      PanResponder.create({
        // Initially, don't claim to be the responder
        onStartShouldSetPanResponder: () => false,

        // This is critical - only become responder for significant vertical movements
        onMoveShouldSetPanResponder: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
          // Store the initial touch position for reference
          if (touchStartY === 0) {
            setTouchStartY(gestureState.moveY);
          }

          // Only handle as swipe if it meets our criteria
          return shouldHandleSwipe(gestureState);
        },

        // Don't capture child events if we're primarily scrolling
        onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
          return Math.abs(gestureState.dy) > 40 && !isScrolling;
        },

        onPanResponderGrant: () => {
          // When a swipe starts, ensure position is at current value
          position.setOffset({
            x: position.x._value,
            y: position.y._value
          });
          position.setValue({ x: 0, y: 0 });
        },

        onPanResponderMove: (evt, gestureState) => {
          // Only move if significant vertical distance to prevent accidental swipes
          if (Math.abs(gestureState.dy) > 10) {
            // Apply dampening for natural feel
            const dampening = 0.7;
            position.setValue({
              x: 0,
              y: gestureState.dy * dampening
            });

            // Calculate the opacity of the next card based on swipe distance
            const nextOpacity = Math.min(0.8, Math.abs(gestureState.dy) / (windowHeight / 3) + 0.2);
            nextCardOpacity.setValue(nextOpacity);
          }
        },

        onPanResponderRelease: (evt, gestureState) => {
          position.flattenOffset();
          setTouchStartY(0); // Reset touch tracking

          // If swiped far enough, navigate cards
          if (gestureState.dy < -SWIPE_THRESHOLD && !isScrolling) {
            swipeUp();
          } else if (gestureState.dy > SWIPE_THRESHOLD && !isScrolling) {
            swipeDown();
          } else {
            // Otherwise, reset position
            resetPosition();

            // Reset the next card opacity
            Animated.timing(nextCardOpacity, {
              toValue: 0.2,
              duration: 300,
              useNativeDriver: true
            }).start();
          }
        },

        // Allow other responders to become responder
        onPanResponderTerminationRequest: () => true,

        onPanResponderTerminate: () => {
          // Reset when terminated
          resetPosition();
          setTouchStartY(0);
        }
      })
  ).current;

  // Dynamic position styling for the current card
  const getCardStyle = () => {
    // Spring effect with damping
    const translateY = position.y.interpolate({
      inputRange: [-windowHeight, 0, windowHeight],
      outputRange: [-windowHeight/15, 0, windowHeight/15],
      extrapolate: 'clamp'
    });

    // Scale effect - card gets slightly smaller as it's swiped
    const scale = position.y.interpolate({
      inputRange: [-windowHeight, 0, windowHeight],
      outputRange: [0.95, 1, 0.95],
      extrapolate: 'clamp'
    });

    // Combine with the swipe animation
    return {
      transform: [
        { translateY: Animated.add(translateY, swipeAnim) },
        { scale }
      ]
    };
  };

  // Next card position styling
  const getNextCardStyle = () => {
    // The next card should initially be below the current one
    const translateY = position.y.interpolate({
      inputRange: [-windowHeight, 0, windowHeight],
      outputRange: [0, windowHeight/10, windowHeight/5],
      extrapolate: 'clamp'
    });

    return {
      transform: [
        { translateY: Animated.add(translateY, swipeAnim) },
        { scale: 0.95 }
      ],
      opacity: nextCardOpacity,
      zIndex: 1 // Keep next card behind current
    };
  };

  // Handle scroll position tracking
  const handleScroll = (event) => {
    // Get current scroll position of the content
    const scrollY = event.nativeEvent.contentOffset.y;
    setCardScrollY(scrollY);
  };

  // Handle when content scrolling begins
  const handleScrollBegin = () => {
    setIsScrolling(true);
  };

  // Handle when content scrolling ends
  const handleScrollEnd = () => {
    // Small delay to ensure we don't capture a swipe immediately after scrolling
    setTimeout(() => {
      setIsScrolling(false);
    }, 100);
  };

  // Manual navigation buttons - optional
  const goToNextCard = () => swipeUp();
  const goToPrevCard = () => swipeDown();

  const tabs = [
    { id: 'feed', label: 'My Feed' },
    { id: 'sale', label: 'Instawoooow Sale' },
    { id: 'match', label: 'Match Center' },
    { id: 'videos', label: 'Videos' },
  ];

  // Render loading state
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

  // Render empty state
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

        {/* Swipeable news cards */}
        <View style={styles.cardsContainer}>
          {/* Card behind current card (only visible during swipe) */}
          {activeIndex < articles.length - 1 && (
              <Animated.View
                  style={[styles.nextCardContainer, getNextCardStyle()]}
                  pointerEvents="none" // Prevent interaction with next card
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
              style={[styles.currentCardContainer, getCardStyle()]}
              {...panResponder.panHandlers}
          >
            <SingleNews
                item={articles[activeIndex]}
                index={activeIndex}
                darkTheme={darkTheme}
                onScrollBegin={handleScrollBegin}
                onScrollEnd={handleScrollEnd}
                onScroll={handleScroll}
            />
          </Animated.View>

          {/* For debugging: Optional navigation buttons
        <View style={styles.navButtons}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={goToPrevCard}
            disabled={activeIndex === 0}
          >
            <Text style={styles.navButtonText}>Previous</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navButton}
            onPress={goToNextCard}
            disabled={activeIndex === articles.length - 1}
          >
            <Text style={styles.navButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
        */}
        </View>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000', // Set to black for status bar area
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  currentCardContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    zIndex: 2, // Ensure current card is on top
  },
  nextCardContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    zIndex: 1, // Keep next card behind current
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
  },
  navButtons: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex: 100,
  },
  navButton: {
    backgroundColor: 'rgba(0, 122, 255, 0.8)',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  navButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default NewsScreen;