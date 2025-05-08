import React, { createContext, useEffect, useState, ReactNode, useRef, useContext } from "react";
import axios from "axios";
import { getNewsAPI, getSourceAPI } from "./api";
import { userStorage } from "../lib/storage";
import { AuthContext } from "./AuthContext";

type NewsItem = {
  source_info: {
    name: string;
    lang: string;
    img: string;
  };
  author: string;
  title: string;
  body: string;
  url: string;
  imageurl: string;
  published_on: number;
  categories: string;
};

type NewsType = {
  Data: NewsItem[];
  Message: string;
  Type: number;
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
  toggleBookmark: (url: string, title: string, imageUrl: string) => void;
  isBookmarked: (url: string) => boolean;
};

export const NewsContext = createContext<NewsContextType>({} as NewsContextType);

type ContextProviderProps = {
  children: ReactNode;
};

const Context = ({ children }: ContextProviderProps) => {
  const { user, isLoggedIn } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [news, setNews] = useState<NewsType | null>(null);
  const [category, setCategory] = useState("general");
  const [source, setSource] = useState("bbc-news");
  const [index, setIndex] = useState(1);
  const [darkTheme, setDarkTheme] = useState(false);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const isInitialMount = useRef(true);

  // Set user ID in storage service when auth changes
  useEffect(() => {
    if (isLoggedIn && user) {
      userStorage.setUser(user.id);
    } else {
      userStorage.setUser(null);
    }
  }, [isLoggedIn, user]);

  // Initial data loading - runs on mount and when auth changes
  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      try {
        // Load saved settings
        try {
          const userSettings = await userStorage.loadSettings();
          if (userSettings) {
            setDarkTheme(userSettings.dark_theme);
          }

          // Load bookmarks
          const storedBookmarks = await userStorage.getBookmarks();
          setBookmarks(storedBookmarks.map(bookmark => bookmark.url));
        } catch (error) {
          console.error('Error loading saved settings:', error);
        }

        // Fetch initial news
        const response = await axios.get(getNewsAPI(category));
        if (response.data && response.data.articles) {
          setNews(response.data);
        } else {
          console.error('Invalid response format:', response.data);
        }
      } catch (error) {
        console.error(`Error during initialization:`, error);
        // Fallback to a second attempt with a different endpoint if the first fails
        try {
          const response = await axios.get(getSourceAPI(source));
          if (response.data && response.data.articles) {
            setNews(response.data);
          }
        } catch (fallbackError) {
          console.error('Fallback fetch also failed:', fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [isLoggedIn, user?.id]); // Reinitialize when auth state changes

  // Save theme preference when it changes
  useEffect(() => {
    const saveThemePreference = async () => {
      try {
        await userStorage.saveSettings({
          dark_theme: darkTheme,
          updated_at: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error saving theme preference:', error);
      }
    };

    // Skip saving on initial mount
    if (!isInitialMount.current) {
      saveThemePreference();
    }
  }, [darkTheme]);

  const fetchNews = async (rest: string = category) => {
    setLoading(true);
    try {
      const response = await axios.get(getNewsAPI(rest));
      if (response.data && response.data.Data) {
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
      if (response.data && response.data.Data) {
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

  // Toggle bookmark status
  const toggleBookmark = async (url: string, title: string, imageUrl: string) => {
    try {
      if (bookmarks.includes(url)) {
        // Remove from bookmarks
        await userStorage.removeBookmark(url);
        setBookmarks(bookmarks.filter(bookmark => bookmark !== url));
      } else {
        // Add to bookmarks
        await userStorage.addBookmark({
          url,
          title,
          image_url: imageUrl
        });
        setBookmarks([...bookmarks, url]);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  // Check if a URL is bookmarked
  const isBookmarked = (url: string): boolean => {
    return bookmarks.includes(url);
  };

  // Handle category changes
  useEffect(() => {
    // Skip the first render since we're already loading data in the initialization
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    fetchNews();
  }, [category]);

  // Handle source changes
  useEffect(() => {
    // Skip the first render since we're already loading data in the initialization
    if (isInitialMount.current) {
      return;
    }

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