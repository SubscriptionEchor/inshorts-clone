import React, { useState, useContext } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent
} from 'react-native';
import { Linking } from 'react-native';
import { format, parseISO } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import ShareCard from './ShareCard';
import { NewsContext } from '../API/Context';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

type NewsItem = {
  title: string;
  description: string;
  urlToImage: string;
  publishedAt: string;
  author: string;
  content: string;
  url: string;
  source: {
    id: string;
    name: string;
  };
};

type SingleNewsProps = {
  item: NewsItem;
  index: number;
  darkTheme: boolean;
  disableInteraction?: boolean;
  onScrollBegin?: () => void;
  onScrollEnd?: () => void;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
};

const SingleNews = ({
                      item,
                      index,
                      darkTheme,
                      disableInteraction = false,
                      onScrollBegin,
                      onScrollEnd,
                      onScroll
                    }: SingleNewsProps) => {
  const [showShareCard, setShowShareCard] = useState(false);
  const { toggleBookmark, isBookmarked } = useContext(NewsContext);

  const date = parseISO(item?.publishedAt || new Date().toISOString());
  const formattedDate = format(date, 'yyyy-MM-dd');
  const bookmarkStatus = item?.url ? isBookmarked(item.url) : false;

  // Calculate if there's enough content for a quote section
  const hasQuoteSection = item?.content && item.content.length > 70;

  // Toggle bookmark with context function
  const handleBookmarkToggle = () => {
    if (item?.url) {
      toggleBookmark(item.url);
    }
  };

  // Create long content for testing scroll
  const longDescription = item?.description || '';
  // Add extra content for testing if the description is too short
  const testContent = longDescription.length < 500 ?
      longDescription + '\n\n' + (item?.content || '').repeat(5) :
      longDescription;

  // If interaction is disabled, render a simpler version
  if (disableInteraction) {
    return (
        <View style={styles.container}>
          {/* Image for article if available */}
          {item?.urlToImage && (
              <Image
                  style={styles.image}
                  source={{ uri: item?.urlToImage }}
                  onError={(err) => console.error("Error Setting Image URI: ", err.nativeEvent.error)}
              />
          )}

          <View style={styles.contentContainer}>
            {/* Logo and action buttons */}
            <View style={styles.actionContainer}>
              <View style={styles.logoContainer}>
                <Text style={styles.logoText}>inshorts</Text>
              </View>

              <View style={styles.actionButtons}>
                <View style={styles.actionButton}>
                  <Ionicons
                      name={bookmarkStatus ? "bookmark" : "bookmark-outline"}
                      size={22}
                      color="#000"
                  />
                </View>
                <View style={styles.actionButton}>
                  <Ionicons name="share-social-outline" size={22} color="#000" />
                </View>
              </View>
            </View>

            {/* Content as a non-scrollable view */}
            <View>
              <Text style={styles.headline}>{item?.title}</Text>
              <Text style={styles.bodyText}>{item?.description}</Text>
              <Text style={styles.attribution}>
                few hours ago | {item.author || "Unknown"} | {item.source?.name || "News"}
              </Text>

              {hasQuoteSection && (
                  <View style={styles.quoteContainer}>
                    <Text style={styles.quoteText}>
                      '{item.content?.slice(0, 60)}...'
                    </Text>
                    <Text style={styles.quoteAttribution}>
                      {item.source?.name || "Source"} further stated
                    </Text>
                  </View>
              )}
            </View>
          </View>
        </View>
    );
  }

  // Normal interactive version with scrolling
  return (
      <View style={styles.container}>
        {/* Image for article if available */}
        {item?.urlToImage && (
            <Image
                style={styles.image}
                source={{ uri: item?.urlToImage }}
                onError={(err) => console.error("Error Setting Image URI: ", err.nativeEvent.error)}
            />
        )}

        {/* Use ScrollView with proper event handlers */}
        <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
            scrollEventThrottle={16} // Important for smooth scroll event handling
            onScroll={onScroll}
            onScrollBeginDrag={() => onScrollBegin && onScrollBegin()}
            onScrollEndDrag={() => onScrollEnd && onScrollEnd()}
            onMomentumScrollBegin={() => onScrollBegin && onScrollBegin()}
            onMomentumScrollEnd={() => onScrollEnd && onScrollEnd()}
        >
          <View style={styles.contentContainer}>
            {/* Logo and action buttons */}
            <View style={styles.actionContainer}>
              <View style={styles.logoContainer}>
                <Text style={styles.logoText}>inshorts</Text>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleBookmarkToggle}
                >
                  <Ionicons
                      name={bookmarkStatus ? "bookmark" : "bookmark-outline"}
                      size={22}
                      color="#000"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => setShowShareCard(true)}
                >
                  <Ionicons name="share-social-outline" size={22} color="#000" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Headline */}
            <Text style={styles.headline}>{item?.title}</Text>

            {/* Body text - use the longer content for testing scroll */}
            <Text style={styles.bodyText}>{item?.description}</Text>

            {/* For testing scroll - can be removed in production */}
            <Text style={styles.bodyText}>{item?.content}</Text>

            {/* Attribution line */}
            <Text style={styles.attribution}>
              few hours ago | {item.author || "Unknown"} | {item.source?.name || "News"}
            </Text>

            {/* Optional footer content/quote */}
            {hasQuoteSection && (
                <View style={styles.quoteContainer}>
                  <Text style={styles.quoteText}>
                    '{item.content?.slice(0, 60)}...'
                  </Text>
                  <Text style={styles.quoteAttribution}>
                    {item.source?.name || "Source"} further stated
                  </Text>
                </View>
            )}

            {/* Add padding at the bottom for better scrolling */}
            <View style={styles.scrollPadding} />
          </View>
        </ScrollView>

        {/* Share Card Modal */}
        <ShareCard
            title={item?.title || ''}
            description={item?.description || ''}
            imageUrl={item?.urlToImage || null}
            author={item?.author || 'Unknown'}
            source={item?.source?.name || 'News'}
            url={item?.url || ''}
            visible={showShareCard}
            onClose={() => setShowShareCard(false)}
        />
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: windowHeight - 120, // Adjust for tab bars
    width: windowWidth,
    backgroundColor: '#fff',
    flexDirection: 'column',
  },
  image: {
    width: windowWidth,
    height: windowHeight * 0.35,
    resizeMode: 'cover',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentContainer: {
    padding: 15,
    position: 'relative',
    minHeight: windowHeight * 0.4, // Ensure there's enough content for scrolling
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
    zIndex: 10,
  },
  logoContainer: {
    backgroundColor: '#f73131',
    padding: 5,
    borderRadius: 4,
  },
  logoText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 15,
    padding: 5, // Make touch target larger
  },
  headline: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000',
    lineHeight: 26,
  },
  bodyText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    marginBottom: 15,
  },
  attribution: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
    marginBottom: 15,
  },
  quoteContainer: {
    backgroundColor: '#333',
    padding: 15,
    marginTop: 15,
    borderRadius: 4,
  },
  quoteText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quoteAttribution: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 5,
  },
  scrollPadding: {
    height: 60, // Add padding at the bottom for better scrolling
  }
});

export default SingleNews;