import React, { createContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";
import { getNewsAPI, getSourceAPI } from "./api";

type NewsType = {
  articles: Array<{
    source: { id: string; name: string };
    author: string;
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    content: string;
  }>;
  status: string;
  totalResults: number;
};

type NewsContextType = {
  news: NewsType | null;
  category: string;
  index: number;
  darkTheme: boolean;
  loading: boolean;
  setCategory: (category: string) => void;
  setIndex: (index: number) => void;
  fetchNews: (category?: string) => Promise<void>;
  setSource: (source: string) => void;
  setDarkTheme: (darkTheme: boolean) => void;
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

  const fetchNews = async (rest: string = category) => {
    setLoading(true);
    try {
      const response = await axios.get(getNewsAPI(rest));
      setNews(response.data);
      setIndex(1);
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
      if (!response) throw new Error("No Response");
      setNews(response.data);
      setIndex(1);
    } catch (error) {
      console.error(`Error Fetching News from Source: `, error);
    } finally {
      setLoading(false);
    }
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
        setCategory,
        setIndex,
        fetchNews,
        setSource,
        setDarkTheme,
      }}
    >
      {children}
    </NewsContext.Provider>
  );
};

export default Context;
