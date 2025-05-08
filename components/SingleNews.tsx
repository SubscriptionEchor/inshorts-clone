import React, { useState, useContext } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Platform
} from 'react-native';
import { format, fromUnixTime } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import ShareCard from './ShareCard';
import { NewsContext } from '../API/Context';
import { useAuth } from '../API/AuthContext';
import { useRouter } from 'expo-router';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

type NewsItem = {
  title: string;
  body: string;
  imageurl: string;
  published_on: number;
  source_info: {
    name: string;
    lang: string;
    img: string;
  };
  url: string;
  categories: string;
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

  const date = fromUnixTime(item?.published_on || Date.now() / 1000);
  const formattedDate = format(date, 'MMM d, yyyy');
  const bookmarkStatus = item?.url ? isBookmarked(item.url) : false;

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

      toggleBookmark(item.url, item.title || '', item.imageurl || '');
    }
  };

  // Normal interactive version
  return (
      <View style={styles.container}>
        {/* Fixed image container at the top */}
        <View style={styles.imageContainer}>
          {item?.imageurl ? (
              <Image
                  style={styles.image}
                  source={{ uri: item?.imageurl }}
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
              <Text style={styles.logoText}>CryptoShorts</Text>
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
          <Text style={styles.bodyText} numberOfLines={7}>{item?.body || 'No Description'}</Text>

          {/* Attribution line */}
          <Text style={styles.attribution}>
            {formattedDate} | {item?.source_info?.name || "Unknown"}
          </Text>

          {/* Optional footer content/quote */}
          {item?.categories && (
              <View style={styles.quoteContainer}>
                <Text style={styles.quoteText} numberOfLines={2}>
                  Categories: {item.categories}
                </Text>
                <Text style={styles.quoteAttribution}>
                  {item.source_info?.name || "Source"}
                </Text>
              </View>
          )}
        </View>

        {/* Share Card Modal */}
        <ShareCard
            title={item?.title || ''}
            description={item?.body || ''}
            imageUrl={item?.imageurl || null}
            author={item?.source_info?.name || 'Unknown'}
            source={item?.source_info?.name || 'News'}
            url={item?.url || ''}
            visible={showShareCard}
            onClose={() => setShowShareCard(false)}
        />
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: windowHeight - (Platform.OS === 'ios' ? 140 : 110),
    width: windowWidth,
    backgroundColor: '#000000',
    flexDirection: 'column',
  },
  imageContainer: {
    width: windowWidth,
    height: windowHeight * 0.35,
    backgroundColor: '#1a1a1a',
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
    backgroundColor: '#000000',
    justifyContent: 'space-between'
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
    paddingHorizontal: 8,
  },
  logoText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Inter-Bold',
  },
  actionButtons: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 6,
  },
  actionButton: {
    marginLeft: 15,
    padding: 8,
  },
  headline: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#fff',
    lineHeight: 28,
    fontFamily: 'Inter-Bold'
  },
  bodyText: {
    fontSize: 16,
    color: '#ccc',
    lineHeight: 22,
    marginBottom: 15,
    fontFamily: 'Inter-Regular'
  },
  attribution: {
    fontSize: 12,
    color: '#666',
    marginBottom: 'auto',
  },
  quoteContainer: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    marginTop: 10,
    borderRadius: 4,
    width: '100%',
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