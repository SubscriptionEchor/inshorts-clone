import React, { useState, useContext } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert
} from 'react-native';
import { format, parseISO } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import ShareCard from './ShareCard';
import { NewsContext } from '../API/Context';
import { useAuth } from '../API/AuthContext';
import { useRouter } from 'expo-router';

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
};

const SingleNews = ({
                      item,
                      index,
                      darkTheme,
                      disableInteraction = false
                    }: SingleNewsProps) => {
  const [showShareCard, setShowShareCard] = useState(false);
  const { toggleBookmark, isBookmarked } = useContext(NewsContext);
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const date = parseISO(item?.publishedAt || new Date().toISOString());
  const formattedDate = format(date, 'yyyy-MM-dd');
  const bookmarkStatus = item?.url ? isBookmarked(item.url) : false;

  // Calculate if there's enough content for a quote section
  const hasQuoteSection = item?.content && item.content.length > 70;

  // Toggle bookmark with context function
  const handleBookmarkToggle = () => {
    if (item?.url) {
      if (!isLoggedIn && !bookmarkStatus) {
        // Prompt to login if not logged in and trying to bookmark
        Alert.alert(
            "Sign in Required",
            "Please sign in to save bookmarks across devices",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Sign In", onPress: () => router.push('/auth/login') }
            ]
        );
        return;
      }

      toggleBookmark(item.url, item.title || '', item.urlToImage || '');
    }
  };

  // If interaction is disabled, render a simpler version
  if (disableInteraction) {
    return (
        <View style={styles.container}>
          {/* Image for article if available */}
          <View style={styles.imageContainer}>
            {item?.urlToImage ? (
                <Image
                    style={styles.image}
                    source={{ uri: item?.urlToImage }}
                    onError={(err) => console.error("Error Setting Image URI: ", err.nativeEvent.error)}
                />
            ) : (
                <View style={[styles.image, styles.placeholderImage]} />
            )}
          </View>

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
            <Text style={styles.headline} numberOfLines={3}>{item?.title || 'No Title'}</Text>
            <Text style={styles.bodyText} numberOfLines={7}>{item?.description || 'No Description'}</Text>
            <Text style={styles.attribution}>
              few hours ago | {item?.author || "Unknown"} | {item?.source?.name || "News"}
            </Text>

            {hasQuoteSection && (
                <View style={styles.quoteContainer}>
                  <Text style={styles.quoteText} numberOfLines={2}>
                    '{item.content?.slice(0, 60)}...'
                  </Text>
                  <Text style={styles.quoteAttribution}>
                    {item.source?.name || "Source"} further stated
                  </Text>
                </View>
            )}
          </View>
        </View>
    );
  }

  // Normal interactive version
  return (
      <View style={styles.container}>
        {/* Fixed image container at the top */}
        <View style={styles.imageContainer}>
          {item?.urlToImage ? (
              <Image
                  style={styles.image}
                  source={{ uri: item?.urlToImage }}
                  onError={(err) => console.error("Error Setting Image URI: ", err.nativeEvent.error)}
              />
          ) : (
              <View style={[styles.image, styles.placeholderImage]} />
          )}
        </View>

        {/* Non-scrollable content */}
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
          <Text style={styles.headline} numberOfLines={3}>{item?.title || 'No Title'}</Text>

          {/* Body text - limit to prevent overflow */}
          <Text style={styles.bodyText} numberOfLines={7}>{item?.description || 'No Description'}</Text>

          {/* Attribution line */}
          <Text style={styles.attribution}>
            few hours ago | {item?.author || "Unknown"} | {item?.source?.name || "News"}
          </Text>

          {/* Optional footer content/quote */}
          {hasQuoteSection && (
              <View style={styles.quoteContainer}>
                <Text style={styles.quoteText} numberOfLines={2}>
                  '{item.content?.slice(0, 60)}...'
                </Text>
                <Text style={styles.quoteAttribution}>
                  {item.source?.name || "Source"} further stated
                </Text>
              </View>
          )}
        </View>

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
    height: windowHeight - 110, // Adjusted for tab bar
    width: windowWidth,
    backgroundColor: '#fff',
    flexDirection: 'column',
  },
  imageContainer: {
    width: windowWidth,
    height: windowHeight * 0.35,
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    backgroundColor: '#e0e0e0',
  },
  contentContainer: {
    flex: 1,
    padding: 15,
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
    marginBottom: 15,
  },
  quoteContainer: {
    backgroundColor: '#333',
    padding: 15,
    marginTop: 5,
    marginBottom: 15,
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
  }
});

export default SingleNews;