import React, { createContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";
import { getNewsAPI, getSourceAPI } from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

type NewsItem = {
  source: { id: string; name: string };
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
};

type NewsType = {
  articles: NewsItem[];
  status: string;
  totalResults: number;
};

type NewsContextType = {
  news: NewsType | null;
  category: string;
  index: number;
  darkTheme: boolean;
  loading: boolean;
  bookmarks: string[]; // Array of article URLs that are bookmarked
  setCategory: (category: string) => void;
  setIndex: (index: number) => void;
  fetchNews: (category?: string) => Promise<void>;
  setSource: (source: string) => void;
  setDarkTheme: (darkTheme: boolean) => void;
  toggleBookmark: (url: string) => void;
  isBookmarked: (url: string) => boolean;
};

export const NewsContext = createContext<NewsContextType>({} as NewsContextType);

type ContextProviderProps = {
  children: ReactNode;
};

const Context = ({ children }: ContextProviderProps) => {
  const [loading, setLoading] = useState(false);
  const [news, setNews] = useState<NewsType | null>(null);
  const [category, setCategory] = useState("general");
  const [source, setSource] = useState("bbc-news");
  const [index, setIndex] = useState(1);
  const [darkTheme, setDarkTheme] = useState(false);
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  // Load saved bookmarks and theme on startup
  useEffect(() => {
    const loadSavedSettings = async () => {
      try {
        // Load saved theme preference
        const savedTheme = await AsyncStorage.getItem('darkTheme');
        if (savedTheme !== null) {
          setDarkTheme(savedTheme === 'true');
        }

        // Load saved bookmarks
        const savedBookmarks = await AsyncStorage.getItem('bookmarks');
        if (savedBookmarks !== null) {
          setBookmarks(JSON.parse(savedBookmarks));
        }
      } catch (error) {
        console.error('Error loading saved settings:', error);
      }
    };

    loadSavedSettings();
  }, []);

  // Save theme preference when it changes
  useEffect(() => {
    const saveThemePreference = async () => {
      try {
        await AsyncStorage.setItem('darkTheme', darkTheme.toString());
      } catch (error) {
        console.error('Error saving theme preference:', error);
      }
    };

    saveThemePreference();
  }, [darkTheme]);

  // Save bookmarks when they change
  useEffect(() => {
    const saveBookmarks = async () => {
      try {
        await AsyncStorage.setItem('bookmarks', JSON.stringify(bookmarks));
      } catch (error) {
        console.error('Error saving bookmarks:', error);
      }
    };

    saveBookmarks();
  }, [bookmarks]);

  const fetchNews = async (rest: string = category) => {
    setLoading(true);
    try {
      const response = await axios.get(getNewsAPI(rest));
      if (response.data && response.data.articles) {
        setNews(response.data);
        setIndex(1);
      } else {
        console.error('Invalid response format:', response.data);
      }
    } catch (error) {
      console.error(`Error Fetching News: `, error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNewsFromSource = async () => {
    setLoading(true);
    try {
      const response = await axios.get(getSourceAPI(source));
      if (response.data && response.data.articles) {
        setNews(response.data);
        setIndex(1);
      } else {
        console.error('Invalid response format:', response.data);
      }
    } catch (error) {
      console.error(`Error Fetching News from Source: `, error);
    } finally {
      setLoading(false);
    }
  };

  // Function to toggle bookmark status
  const toggleBookmark = (url: string) => {
    if (bookmarks.includes(url)) {
      // Remove from bookmarks
      setBookmarks(bookmarks.filter(bookmark => bookmark !== url));
    } else {
      // Add to bookmarks
      setBookmarks([...bookmarks, url]);
    }
  };

  // Check if a URL is bookmarked
  const isBookmarked = (url: string): boolean => {
    return bookmarks.includes(url);
  };

  useEffect(() => {
    fetchNews();
  }, [category]);

  useEffect(() => {
    fetchNewsFromSource();
  }, [source]);

  return (
      <NewsContext.Provider
          value={{
            news,
            category,
            index,
            darkTheme,
            loading,
            bookmarks,
            setCategory,
            setIndex,
            fetchNews,
            setSource,
            setDarkTheme,
            toggleBookmark,
            isBookmarked,
          }}
      >
        {children}
      </NewsContext.Provider>
  );
};

export default Context;